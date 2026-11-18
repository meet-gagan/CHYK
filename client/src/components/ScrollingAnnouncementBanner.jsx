import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { webContentService } from '../services/api';
import './ScrollingAnnouncementBanner.css';

const DEFAULT_EN =
  '🕉️ Celebrate Magamasam with Devotion | 7 Feb – 8 Mar 2027 | Registrations Open!';
const DEFAULT_TE =
  '🕉️ భక్తిశ్రద్ధలతో మాఘమాస వేడుకల్లో పాల్గొనండి | ఫిబ్రవరి 7 – మార్చి 8, 2027 | రిజిస్ట్రేషన్లు ప్రారంభం!';

/**
 * Continuous Scrolling Announcement Banner
 * Displays English and Telugu announcements in a seamless, single horizontal line.
 * Appears below the header across all pages.
 * Controlled dynamically by CMS (scrolling_announcement section in chinmaya home content)
 * or via optional component props.
 */
export const ScrollingAnnouncementBanner = ({
  isEnabled: propIsEnabled,
  englishContent: propEnglish,
  teluguContent: propTelugu,
  linkUrl: propLink,
}) => {
  const [data, setData] = useState({
    isEnabled: propIsEnabled !== undefined ? propIsEnabled : true,
    englishContent: propEnglish || DEFAULT_EN,
    teluguContent: propTelugu || DEFAULT_TE,
    linkUrl: propLink || '/maga-masam-poojalu',
  });

  useEffect(() => {
    // If props are explicitly supplied, respect them
    if (propIsEnabled !== undefined) {
      setData({
        isEnabled: propIsEnabled,
        englishContent: propEnglish || DEFAULT_EN,
        teluguContent: propTelugu || DEFAULT_TE,
        linkUrl: propLink || '/maga-masam-poojalu',
      });
      return;
    }

    const fetchBanner = () => {
      webContentService
        .getPublicPage('chinmaya', 'home')
        .then((res) => {
          if (res.data?.success && res.data?.data) {
            const page = res.data.data;
            const sec = (page.sections || []).find((s) => s.sectionId === 'scrolling_announcement');
            const f = page.fieldsMap?.scrolling_announcement;
            const enabled = sec
              ? (sec.isEnabled === true || sec.isEnabled === 'true')
              : (f?._isEnabled === true || f?._isEnabled === 'true');
            const en = f?.english_content || sec?.fields?.find((x) => x.key === 'english_content')?.value;
            const te = f?.telugu_content || sec?.fields?.find((x) => x.key === 'telugu_content')?.value;
            const link = f?.link_url || sec?.fields?.find((x) => x.key === 'link_url')?.value;

            setData({
              isEnabled: enabled !== false,
              englishContent: en || DEFAULT_EN,
              teluguContent: te || DEFAULT_TE,
              linkUrl: link || '/maga-masam-poojalu',
            });
          }
        })
        .catch(() => {});
    };

    fetchBanner();

    const handleCmsUpdate = () => fetchBanner();
    window.addEventListener('cms_updated', handleCmsUpdate);
    window.addEventListener('storage', handleCmsUpdate);
    return () => {
      window.removeEventListener('cms_updated', handleCmsUpdate);
      window.removeEventListener('storage', handleCmsUpdate);
    };
  }, [propIsEnabled, propEnglish, propTelugu, propLink]);

  // If disabled by administrator, do not render
  if (!data.isEnabled) {
    return null;
  }

  const enText = data.englishContent || DEFAULT_EN;
  const teText = data.teluguContent || DEFAULT_TE;
  const targetLink =
    data.linkUrl &&
    data.linkUrl !== '#' &&
    !data.linkUrl.includes('shantamalleshwara') &&
    !data.linkUrl.includes('maha-shivaratri')
      ? data.linkUrl
      : '/maga-masam-poojalu';

  const renderUnits = (prefix = 'seq') => {
    return Array.from({ length: 3 }).map((_, idx) => (
      <span key={`${prefix}-${idx}`} className="announcement-unit">
        <span className="announcement-text-en">
          {enText}
        </span>
        <span className="announcement-bullet" aria-hidden="true">
          •
        </span>
        <span className="announcement-text-te">
          {teText}
        </span>
        <span className="announcement-bullet" aria-hidden="true">
          •
        </span>
      </span>
    ));
  };

  return (
    <div
      className="announcement-banner-wrapper"
      role="region"
      aria-label="Chinmaya Mission Adoni Announcement"
    >
      <Link
        to={targetLink}
        className="announcement-banner-link"
        title="Chinmaya Mission Adoni — Maga Masam Poojalu"
      >
        <div className="announcement-marquee-track">
          {/* Primary Track Content (Read by Screen Readers) */}
          <div className="announcement-track-content">
            {renderUnits('primary')}
          </div>

          {/* Secondary Duplicate Track Content for 100% Seamless Looping (Hidden from Screen Readers) */}
          <div className="announcement-track-content" aria-hidden="true">
            {renderUnits('clone')}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ScrollingAnnouncementBanner;
