import React from 'react';
import { Link } from 'react-router-dom';
import './ScrollingAnnouncementBanner.css';

const DEFAULT_EN =
  '🕉️ Celebrate Magamasam with Devotion | 7 Feb – 8 Mar 2027 | Registrations Open!';
const DEFAULT_TE =
  '🕉️ భక్తిశ్రద్ధలతో మాఘమాస వేడుకల్లో పాల్గొనండి | ఫిబ్రవరి 7 – మార్చి 8, 2027 | రిజిస్ట్రేషన్లు ప్రారంభం!';

/**
 * Continuous Scrolling Announcement Banner
 * Displays English and Telugu Magamasam announcements in a seamless, single horizontal line.
 * Appears exclusively on the Chinmaya Mission homepage directly below the header.
 * Strictly respects isEnabled status: if disabled or false, renders null.
 */
export const ScrollingAnnouncementBanner = ({
  isEnabled = true,
  englishContent,
  teluguContent,
  linkUrl = '/shri-shantamalleshwara-swami-temple#maha-shivaratri',
}) => {
  // If disabled by administrator, do not render
  if (!isEnabled) {
    return null;
  }

  const enText = englishContent || DEFAULT_EN;
  const teText = teluguContent || DEFAULT_TE;
  const targetLink =
    linkUrl && linkUrl !== '#'
      ? linkUrl.includes('maha-shivaratri')
        ? linkUrl
        : `${linkUrl}#maha-shivaratri`
      : '/shri-shantamalleshwara-swami-temple#maha-shivaratri';

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
      aria-label="Shri Shantamalleshwara Swami Temple Announcement"
    >
      <Link
        to={targetLink}
        className="announcement-banner-link"
        title="Shri Shantamalleshwara Swami Temple — Maha Shivaratri Special"
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
