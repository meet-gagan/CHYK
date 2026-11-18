import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { webContentService } from '../services/api';
import {
  Heart,
  CalendarDays,
  ArrowRight,
  Sparkles,
  Users,
  Sun,
  Compass,
  Flame,
  Maximize2,
  X,
} from 'lucide-react';
import '../styles/homepage.css';

const corePillars = [
  {
    id: 'vision',
    icon: Compass,
    title: 'Our Vision',
    text: 'The inner transformation of individuals through knowledge of Vedanta, spiritual practices and service to society, resulting in a happy world around them.',
    badgeClass: 'pillar-badge-vision',
  },
  {
    id: 'mission',
    icon: Flame,
    title: 'Our Mission',
    text: 'To provide to individuals from any background, the wisdom of Vedanta and the practical means for spiritual growth and happiness enabling them to become positive contributors to society.',
    badgeClass: 'pillar-badge-mission',
  },
  {
    id: 'motto',
    icon: Heart,
    title: 'Our Motto',
    text: 'To give maximum happiness to the maximum number for the maximum time.',
    badgeClass: 'pillar-badge-motto',
  },
];

export const RAMA_NAVAMI_DESCRIPTION = `Sri Rama Navami Celebrations

Date: 15 April 2027

Let us celebrate Sri Rama Navami with devotion and joy!

Join us for the following special events:

•  Sri Sita Rama Kalyanam: Enjoy the beautiful wedding ceremony of Lord Sri Rama and Goddess Sita.
•  Annadanam: All devotees are invited to take part in the Annadanam.
•  Sri Sita Rama Pallaki Seva (Evening): Join us for the evening procession of Lord Sri Rama and Goddess Sita in a beautifully decorated palanquin(Pallaki Seva).

Let us come together and celebrate this special day with love and devotion.

May Lord Sri Rama and Goddess Sita bless everyone with happiness and peace.

All devotees are welcome!`;

export const MAGAMASAM_DESCRIPTION = `Magamasam Sacred Poojallu & Celebrations

Date: FEB 07 To March 08

Special Auspicious Poojas and Abhishekam to Lord Shiva throughout holy Magamasam:
• Rudra Abhishekam: Sacred bathing of Lord Shiva with Vedic chants.
• Rudra Homam: Holy fire ritual for world peace and universal prosperity.
• Siva Parvathi Kalyanam: Divine celestial wedding ceremony.
• Amavasya Poojalu: Special new moon archana and deepa aradhana.

All devotees are cordially invited to participate with family and receive divine blessings.`;

export const HANUMAN_DESCRIPTION = `Sri Hanuman Jayanthi Mahotsavam

Date: April 20th, 2027

Join us in celebrating the auspicious birth of Sri Hanumanji:
• Special Sindhoora Pooja and Abhishekam.
• Sampoorna Hanuman Chalisa Parayanam.
• Vada Maala offering and Maha Mangala Harathi.
• Distribution of sanctified Prasadam to all devotees.`;

export const KRISHNA_DESCRIPTION = `Sri Krishna Janmashtami Celebrations

Date: August 25th, 2027

Joyous celebration of Lord Sri Krishna's divine appearance:
• Midnight Sri Krishna Janma Pooja and Abhishekam.
• Bala Vihar cultural performances, bhajans and Radha-Krishna costume events.
• Dahi Handi utsavam and devotional chanting.
• Maha Prasadam distribution.`;

export const KARTHIKA_DESCRIPTION = `Holy Karthika Masam Deepotsavam

Date: Daily Special Poojas

Sacred Deepotsavam and daily special Shiva Archana during holy Karthika Masam.
Devotees gather for divine blessings, lighting ghee lamps, Bilva archana, and sacred chanting throughout the holy month.`;

export const RUDRA_DESCRIPTION = `Sacred Sri Rudra Abhishekam

Date: Daily Sacred Rituals

Sacred Vedic Abhishekam to Lord Shiva with sanctified dravyas and Sri Rudram Namakam Chamakam chanting.
Performed for universal peace, spiritual growth, and the prosperity and well-being of all devotees.`;

const events = [
  {
    title: 'Magamasam Poojallu',
    subtitle: 'Rudra Abhishekam, Rudra Homam, Siva Parvathi Kalyanam & Amavasya Poojalu',
    description: MAGAMASAM_DESCRIPTION,
    date: 'FEB 07 To March 08',
    kind: 'devotion',
    image: '/assets/magamasam-poojallu.jpg',
    icon: '🔥',
    url: '/activities',
    isExternal: false,
  },
  {
    title: 'Rama Navami',
    subtitle: 'Sri Sita Rama Kalyanam & Divine Celebrations',
    description: RAMA_NAVAMI_DESCRIPTION,
    date: 'April 15th, 2027',
    kind: 'journey',
    image: '/assets/rama-navami.jpg',
    icon: '✦',
    url: '/activities',
    isExternal: false,
  },
  {
    title: 'Hanuman Jayanthi',
    subtitle: 'Special Pooja & Hanuman Chalisa Parayanam',
    description: HANUMAN_DESCRIPTION,
    date: 'April 20th, 2027',
    kind: 'wisdom',
    image: '/assets/hanuman-jayanthi.png',
    icon: 'ॐ',
    url: '/activities',
    isExternal: false,
  },
  {
    title: 'Krishna Janmashtami',
    subtitle: 'Lord Krishna Birth Celebrations & Utsavam',
    description: KRISHNA_DESCRIPTION,
    date: 'August 25th, 2027',
    kind: 'meditation',
    image: '/assets/krishna-janmashtami.jpg',
    icon: '☼',
    url: '/activities',
    isExternal: false,
  },
];

export function HomePage() {
  const [active, setActive] = useState('Home');
  const [previewEvent, setPreviewEvent] = useState(null);
  const navigate = useNavigate();
  const mobileVideoRef = useRef(null);

  useEffect(() => {
    if (mobileVideoRef.current) {
      mobileVideoRef.current.defaultMuted = true;
      mobileVideoRef.current.muted = true;
      const playPromise = mobileVideoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    }
  }, []);

  const [pageData, setPageData] = useState(() => {
    try {
      for (let i = 1; i <= 20; i++) {
        localStorage.removeItem(`cached_cms_chinmaya_home_v${i}`);
      }
      localStorage.removeItem('cached_cms_chinmaya_home');
    } catch {}
    return null;
  });

  const fetchPublicPageData = () => {
    webContentService
      .getPublicPage('chinmaya', 'home')
      .then((res) => {
        if (res.data?.success && res.data?.data) {
          setPageData(res.data.data);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchPublicPageData();

    const handleCmsUpdate = () => {
      fetchPublicPageData();
    };

    window.addEventListener('cms_updated', handleCmsUpdate);
    window.addEventListener('storage', handleCmsUpdate);
    return () => {
      window.removeEventListener('cms_updated', handleCmsUpdate);
      window.removeEventListener('storage', handleCmsUpdate);
    };
  }, []);

  const f = pageData?.fieldsMap || {};

  const goTo = (label) => {
    setActive(label);
    const targetId = label.toLowerCase();
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const rawEyebrow = (f.hero?.eyebrow || 'Inner Transformation for a Better World').replace(/^[\s\-—–]+/, '').trim();
  const rawHeading = (f.hero?.heading || 'Chinmaya Mission, Adoni').trim();

  let heroEyebrow = rawEyebrow || 'Inner Transformation for a Better World';
  let heroHeading = rawHeading || 'Chinmaya Mission, Adoni';

  // Normalize so Chinmaya Mission, Adoni is the heading (above) and Inner Transformation for a Better World is the tagline
  if (/inner\s*transformation/i.test(heroHeading) && /chinmaya\s*mission/i.test(heroEyebrow)) {
    heroHeading = 'Chinmaya Mission, Adoni';
    heroEyebrow = 'Inner Transformation for a Better World';
  } else if (!/chinmaya\s*mission/i.test(heroHeading) && /chinmaya\s*mission/i.test(heroEyebrow)) {
    heroHeading = 'Chinmaya Mission, Adoni';
    heroEyebrow = 'Inner Transformation for a Better World';
  }
  const heroDesc = f.hero?.description || 'Through Vedanta, values and service, we strive to build a generation of conscious, compassionate and capable individuals.';
  const primaryBtnText = f.hero?.primaryBtnText || 'Explore Our Mission';
  const primaryBtnLink = f.hero?.primaryBtnLink || '#about';
  const rawPortrait = f.hero?.portraitImage;
  const portraitImg =
    rawPortrait &&
    typeof rawPortrait === 'string' &&
    !rawPortrait.includes('cutout') &&
    !rawPortrait.includes('suitable-bg')
      ? rawPortrait
      : '/assets/swami-chinmayananda-golden-tree.jpg';
  const portraitQuote = f.hero?.portraitQuote || 'Arise, Awake and Guide Others';
  const portraitSig = f.hero?.portraitSignature || 'Swami Chinmayananda';
  const portraitSub = f.hero?.portraitSubtitle || 'Founder Of Chinmaya Mission';

  const aboutEyebrow = f.about_purpose?.eyebrow || 'OUR PURPOSE';
  let aboutHeading = f.about_purpose?.heading || 'About Chinmaya Mission, Adoni';
  if (!/adoni/i.test(aboutHeading)) {
    aboutHeading = 'About Chinmaya Mission, Adoni';
  }
  const rawAboutDesc = f.about_purpose?.description || 'Chinmaya Mission, Adoni has been serving the spiritual, cultural and educational needs of the community for over three decades. The Mission was established in 1992 by Swamini Shyamananda (Dr. Shyamala) under the guidance and blessings of Swamini Sharadapriyananda, with the wholehearted support of dedicated well-wishers including Sri Vita Bhimaiah and Sri B. V. R. Reddy.\n\nWe believe that true transformation begins with understanding oneself and applying spiritual wisdom in everyday life. Through spiritual learning, cultural programmes, youth engagement and community initiatives, we strive to nurture individuals who are thoughtful, compassionate and committed to the well-being of society.';
  const aboutDesc = rawAboutDesc
    .replace(/Swami Shyamananda/g, 'Swamini Shyamananda')
    .replace(/Swami Sharadapriyananda/g, 'Swamini Sharadapriyananda')
    .replace(/^Chinmaya Mission,?\s*has been serving/i, 'Chinmaya Mission, Adoni has been serving')
    .replace(/^Chinmaya Mission,?\s*Adoni,?\s*has been serving/i, 'Chinmaya Mission, Adoni has been serving')
    .replace(/\s{2,}/g, ' ');
  const aboutLinkText = f.about_purpose?.linkText || 'Learn More';
  const aboutLinkUrl = f.about_purpose?.linkUrl || '/chinmaya-mission-adoni';

  const valuesEyebrow = f.core_values?.eyebrow || 'WHAT GUIDES US';
  const valuesHeading = f.core_values?.heading || 'Our Core Values';
  const dynamicPillars = f.core_values?.items?.length
    ? f.core_values.items.map((it, idx) => ({
        id: it.itemId || `pillar-${idx}`,
        icon: idx === 0 ? Compass : idx === 1 ? Flame : Heart,
        title: it.title,
        text: it.description,
        badgeClass: idx === 0 ? 'pillar-badge-vision' : idx === 1 ? 'pillar-badge-mission' : 'pillar-badge-motto',
      }))
    : corePillars;

  const chykEyebrow = f.chyk_section?.eyebrow || 'THE YOUTH WING';
  const chykHeading = f.chyk_section?.heading || 'CHYK — The Youth Wing';
  const chykDesc = f.chyk_section?.description || 'CHYK (Chinmaya Yuva Kendra) empowers young minds through value-based education, spiritual learning, cultural activities and social service.';
  const chykTag1 = f.chyk_section?.tag1 || 'Discover your potential';
  const chykTag2 = f.chyk_section?.tag2 || 'Serve with purpose';
  const chykBtnText = f.chyk_section?.buttonText || 'Join CHYK';
  const chykBtnLink = f.chyk_section?.buttonLink || '/lets-connect';
  const rawChykImg = f.chyk_section?.imageUrl;
  const chykImg = (!rawChykImg || rawChykImg.includes('youth-runners'))
    ? '/assets/chyk-group.jpg'
    : rawChykImg;

  // On Going Events CMS configuration
  const ongoingEyebrow =
    f.ongoing_events?.eyebrow && f.ongoing_events?.eyebrow !== 'DEVOTIONAL CELEBRATIONS'
      ? f.ongoing_events.eyebrow
      : '';
  const ongoingHeading = f.ongoing_events?.heading || 'On Going Events';

  const defaultOngoingEvents = [
    {
      title: 'Karthika Masam',
      subtitle:
        'Sacred Deepotsavam and daily special Shiva Archana during holy Karthika Masam.\nDevotees gather for divine blessings, lighting ghee lamps and sacred chanting.',
      description: KARTHIKA_DESCRIPTION,
      date: 'Daily Special Poojas',
      kind: 'devotion',
      image: '/assets/karthika-masam.jpg',
      icon: '🪔',
      url: '/activities',
      isExternal: false,
    },
  ];

  const rawOngoingItems = (f.ongoing_events?.items || []).filter(
    (it) =>
      it &&
      !it.title?.toLowerCase().includes('marathon') &&
      !it.title?.toLowerCase().includes('rudra')
  );

  const dynamicOngoingEvents =
    rawOngoingItems.length > 0
      ? rawOngoingItems.map((it, idx) => {
          const isKarthika = (it.title || '').toLowerCase().includes('karthika');
          const defaultImg = isKarthika ? '/assets/karthika-masam.jpg' : (it.imageUrl || '/assets/karthika-masam.jpg');
          const defaultDesc = isKarthika ? KARTHIKA_DESCRIPTION : (it.description || '');
          return {
            title: it.title,
            subtitle: it.subtitle || '',
            description: it.description || defaultDesc,
            date: it.dateOrYear || 'Daily Special Poojas',
            kind: idx === 0 ? 'devotion' : 'wisdom',
            image: it.imageUrl || defaultImg,
            url: it.linkUrl || '/activities',
            isExternal: Boolean(it.linkUrl && it.linkUrl.startsWith('http')),
          };
        })
      : defaultOngoingEvents;

  const eventsEyebrow = f.upcoming_events?.eyebrow || 'COME BE A PART';
  const eventsHeading = f.upcoming_events?.heading || 'Upcoming Events';
  const eventsLinkText = f.upcoming_events?.linkText || 'View All';
  const eventsLinkUrl = f.upcoming_events?.linkUrl || '/activities';

  const rawEventItems = (f.upcoming_events?.items || []).filter(
    (it) => {
      if (!it || it.itemId === 'event-marathon') return false;
      const titleLower = (it.title || '').toLowerCase();
      const idLower = (it.itemId || '').toLowerCase();
      if (
        titleLower.includes('marathon') ||
        titleLower.includes('daily hanuman chalisa') ||
        titleLower.includes('11-times hanuman chalisa') ||
        titleLower.includes('hanuman chalisa pooja pass') ||
        idLower.includes('daily-hanuman-chalisa') ||
        idLower.includes('11-times-hanuman-chalisa')
      ) {
        return false;
      }
      return true;
    }
  );

  const magamasamCard = {
    title: 'Magamasam Poojallu',
    subtitle: 'Rudra Abhishekam, Rudra Homam, Siva Parvathi Kalyanam & Amavasya Poojalu',
    description: MAGAMASAM_DESCRIPTION,
    date: 'FEB 07 To March 08',
    kind: 'devotion',
    image: '/assets/magamasam-poojallu.jpg',
    icon: '🔥',
    url: '/activities',
    isExternal: false,
  };

  const baseEvents =
    rawEventItems.length > 0 &&
    !rawEventItems.some(
      (it) =>
        it.title?.includes('Amrit Yatra') ||
        it.title?.includes('Jnana Yajna') ||
        it.title?.includes('Bala Vihar')
    )
      ? rawEventItems.map((it, idx) => {
          const targetUrl = it.linkUrl || '/activities';
          const titleLower = (it.title || '').toLowerCase();
          const isRamaNavami = titleLower.includes('rama navami');
          const isHanuman = titleLower.includes('hanuman');
          const isKrishna = titleLower.includes('krishna');

          let defaultImg = '';
          let defaultDesc = '';
          if (isRamaNavami) {
            defaultImg = '/assets/rama-navami.jpg';
            defaultDesc = RAMA_NAVAMI_DESCRIPTION;
          } else if (isHanuman) {
            defaultImg = '/assets/hanuman-jayanthi.png';
            defaultDesc = HANUMAN_DESCRIPTION;
          } else if (isKrishna) {
            defaultImg = '/assets/krishna-janmashtami.jpg';
            defaultDesc = KRISHNA_DESCRIPTION;
          }

          const eventImage =
            it.imageUrl && !it.imageUrl.includes('rama-navami-procession')
              ? it.imageUrl
              : defaultImg;

          return {
            title: it.title,
            subtitle: it.subtitle || '',
            description: it.description || defaultDesc,
            date: it.dateOrYear || 'Upcoming',
            kind: idx === 0 ? 'journey' : idx === 1 ? 'wisdom' : idx === 2 ? 'meditation' : 'journey',
            image: eventImage,
            url: targetUrl,
            isExternal: Boolean(targetUrl && targetUrl.startsWith('http')),
          };
        })
      : events;

  // Always bring Magamasam Poojallu to 1st place and strictly prevent duplicate/legacy cards
  const isMagaMasamMatch = (title = '') => {
    const clean = title.toLowerCase().replace(/\s+/g, '');
    return (
      clean.includes('magamasam') ||
      clean.includes('magamasa') ||
      clean.includes('sacredpooja')
    );
  };

  const otherEvents = baseEvents.filter((e) => !isMagaMasamMatch(e.title));
  const foundMagamasam = baseEvents.find((e) => isMagaMasamMatch(e.title));
  const magamasamCardFinal = {
    title: 'Magamasam Poojallu',
    subtitle: 'Rudra Abhishekam, Rudra Homam, Siva Parvathi Kalyanam & Amavasya Poojalu',
    description: foundMagamasam?.description || MAGAMASAM_DESCRIPTION,
    date: 'FEB 07 To March 08',
    kind: 'devotion',
    image: foundMagamasam?.image || '/assets/magamasam-poojallu.jpg',
    icon: '🔥',
    url: '/activities',
    isExternal: false,
  };

  const dynamicEvents = [magamasamCardFinal, ...otherEvents];

  // Scrolling Announcement CMS configuration
  const announcementSec = (pageData?.sections || []).find(
    (s) => s.sectionId === 'scrolling_announcement'
  );
  const announcementFields = f.scrolling_announcement;

  const isAnnouncementEnabled = announcementSec
    ? (announcementSec.isEnabled === true || announcementSec.isEnabled === 'true')
    : (announcementFields?._isEnabled === true || announcementFields?._isEnabled === 'true');

  const englishAnnouncement =
    announcementFields?.english_content ||
    announcementSec?.fields?.find((field) => field.key === 'english_content')?.value;

  const teluguAnnouncement =
    announcementFields?.telugu_content ||
    announcementSec?.fields?.find((field) => field.key === 'telugu_content')?.value;

  const announcementLink =
    announcementFields?.link_url ||
    announcementSec?.fields?.find((field) => field.key === 'link_url')?.value ||
    '/shri-shantamalleshwara-swami-temple#maha-shivaratri';

  return (
    <div className="site-shell">
      <main>
        {/* HERO SECTION */}
        <section className="hero" id="home">
          {/* Desktop Background Video (Shown only on tablet, laptop & desktop screens) */}
          <div className="hero-video-wrap hero-video-wrap-desktop" aria-hidden="true">
            <video
              className="hero-video-bg hero-video-desktop"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
            >
              <source src="/assets/download.mp4" type="video/mp4" />
            </video>
            <div className="hero-video-overlay" />
          </div>

          <div className="hero-glow" />
          <div className="hero-content">
            <h1 className="hero-main-heading">
              {heroHeading.toLowerCase().includes('chinmaya mission') ? (
                <>Chinmaya Mission, <em>Adoni</em></>
              ) : heroHeading.toLowerCase().includes('inner transformation') && heroHeading.toLowerCase().includes('better world') ? (
                <>Inner Transformation <em>for a Better World</em></>
              ) : (
                heroHeading
              )}
            </h1>
            <p className="hero-tagline">
              {heroEyebrow}
            </p>
            <p className="hero-description whitespace-pre-line">
              {heroDesc}
            </p>

            {/* Mobile Video: Placed cleanly under the content on mobile, hidden on desktop */}
            <div className="hero-mobile-video-wrap" aria-hidden="true">
              <video
                ref={mobileVideoRef}
                className="hero-mobile-video-el"
                autoPlay
                loop
                muted
                playsInline
                webkit-playsinline="true"
                preload="auto"
              >
                <source src="/assets/homepagevideo.mp4" type="video/mp4" />
                <source src="/homepagevideo.mp4" type="video/mp4" />
                <source src="/assets/download.mp4" type="video/mp4" />
              </video>
            </div>
            <div className="hero-actions">
              {primaryBtnLink.startsWith('#') ? (
                <a
                  className="btn btn-primary"
                  href={primaryBtnLink}
                  onClick={(e) => {
                    e.preventDefault();
                    goTo(primaryBtnLink.replace('#', ''));
                  }}
                >
                  {primaryBtnText} <ArrowRight size={16} />
                </a>
              ) : (
                <Link className="btn btn-primary" to={primaryBtnLink}>
                  {primaryBtnText} <ArrowRight size={16} />
                </Link>
              )}
            </div>
          </div>

          <div className="hero-signature" aria-hidden="true">
            <span className="hero-signature-name">{portraitSig}</span>
            <span className="hero-signature-sub">{portraitSub}</span>
          </div>

          <div className="sun-disc" />
        </section>

        {/* ABOUT SECTION */}
        <section className="about-section section-wrap" id="about">
          <div className="about-copy">
            <p className="eyebrow">{aboutEyebrow}</p>
            <h2>{aboutHeading}</h2>
            <span className="title-underline" />
            {aboutDesc.split('\n\n').map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
            <Link className="text-link" to={aboutLinkUrl}>
              {aboutLinkText} <ArrowRight size={15} />
            </Link>
          </div>
        </section>

        {/* CORE VALUES SECTION */}
        <section className="values-section" id="activities">
          <div className="section-wrap">
            <div className="section-heading">
              <p className="eyebrow">{valuesEyebrow}</p>
              <h2>{valuesHeading}</h2>
              <span className="title-underline" />
            </div>
            <div className="pillars-grid">
              {dynamicPillars.map(({ icon: IconComponent, title, text, badgeClass }) => (
                <article className="pillar-card group" key={title}>
                  <div className="pillar-icon-wrap">
                    <div className={`pillar-icon-badge ${badgeClass}`}>
                      <IconComponent className="w-8 h-8 sm:w-9 sm:h-9" strokeWidth={1.8} />
                    </div>
                  </div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ONGOING EVENTS SECTION */}
        <section className="events-section ongoing-events-section section-wrap" id="ongoing-events">
          <div className="events-heading">
            <div>
              {ongoingEyebrow && <p className="eyebrow">{ongoingEyebrow}</p>}
              <h2>{ongoingHeading}</h2>
              <span className="title-underline" />
            </div>
          </div>
          <div className="ongoing-events-grid">
            {dynamicOngoingEvents.map((event) => (
              <article
                className="event-card group cursor-pointer"
                key={event.title}
                onClick={() => setPreviewEvent(event)}
              >
                <div
                  className={'event-art ' + (event.kind || 'journey')}
                  title="Click to view details"
                >
                  {event.image ? (
                    <>
                      <img
                        src={event.image}
                        alt=""
                        className="event-art-blur-bg"
                        aria-hidden="true"
                      />
                      <img
                        src={event.image}
                        alt={event.title}
                        className="event-art-img"
                      />
                      <button
                        type="button"
                        className="event-art-enlarge-btn"
                        title="Enlarge image"
                        aria-label={`Enlarge image for ${event.title}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewEvent(event);
                        }}
                      >
                        <Maximize2 size={13} />
                      </button>
                    </>
                  ) : (
                    <div className="road-sun" />
                  )}
                </div>
                <div className="event-info">
                  <div className="flex items-start justify-between gap-1">
                    <h3>{event.title}</h3>
                  </div>
                  <p className="whitespace-pre-line leading-relaxed">{event.subtitle}</p>
                  <div className="event-date">
                    <CalendarDays size={14} />
                    {event.date}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* UPCOMING EVENTS SECTION */}
        <section className="events-section section-wrap" id="events">
          <div className="events-heading">
            <div>
              <p className="eyebrow">{eventsEyebrow}</p>
              <h2>{eventsHeading}</h2>
              <span className="title-underline" />
            </div>
          </div>
          <div className="events-grid">
            {dynamicEvents.map((event) => {
              return (
                <article
                  className="event-card group cursor-pointer"
                  key={event.title}
                  onClick={() => setPreviewEvent(event)}
                >
                  <div
                    className={'event-art ' + (event.kind || 'journey')}
                    title="Click to view details"
                  >
                    {event.image ? (
                      <>
                        <img
                          src={event.image}
                          alt=""
                          className="event-art-blur-bg"
                          aria-hidden="true"
                        />
                        <img
                          src={event.image}
                          alt={event.title}
                          className="event-art-img"
                        />
                        <button
                          type="button"
                          className="event-art-enlarge-btn"
                          title="Enlarge image"
                          aria-label={`Enlarge image for ${event.title}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewEvent(event);
                          }}
                        >
                          <Maximize2 size={13} />
                        </button>
                      </>
                    ) : event.kind === 'wisdom' ? (
                      <div className="wisdom-symbol">ॐ</div>
                    ) : event.kind === 'youth' ? (
                      <Users size={50} />
                    ) : event.kind === 'meditation' ? (
                      <Sun size={56} strokeWidth={1.2} />
                    ) : (
                      <div className="road-sun" />
                    )}
                  </div>
                  <div className="event-info">
                    <div className="flex items-start justify-between gap-1">
                      <h3>{event.title}</h3>
                    </div>
                    <p>{event.subtitle}</p>
                    <div className="event-date">
                      <CalendarDays size={14} />
                      {event.date}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* CHYK SECTION */}
        <section className="chyk-section section-wrap" id="chyk">
          <div className="chyk-image">
            <img
              src={chykImg}
              alt="Chinmaya Yuva Kendra and Mission members"
            />
          </div>
          <div className="chyk-copy">
            <p className="eyebrow">{chykEyebrow}</p>
            <h2>
              {chykHeading.includes('—') ? (
                <>
                  {chykHeading.split('—')[0]} <span>— {chykHeading.split('—')[1]}</span>
                </>
              ) : (
                chykHeading
              )}
            </h2>
            <span className="title-underline" />
            <p>{chykDesc}</p>
            <div className="chyk-tags">
              <span>
                <Sparkles size={14} /> {chykTag1}
              </span>
              <span>
                <Heart size={14} /> {chykTag2}
              </span>
            </div>
            <Link
              className="btn btn-primary"
              to={chykBtnLink}
            >
              {chykBtnText} <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </main>

      {/* Full-view Festival Image Modal with Image & Full Event Description */}
      {previewEvent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in"
          onClick={() => setPreviewEvent(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative max-w-3xl w-full max-h-[92vh] bg-slate-950 border border-white/15 rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Close Button */}
            <button
              onClick={() => setPreviewEvent(null)}
              className="sticky top-0 self-end -mr-1 -mt-1 p-2 rounded-full bg-slate-800/90 hover:bg-[var(--orange)] text-white transition-all cursor-pointer z-30 shadow-md border border-white/10"
              aria-label="Close image modal"
            >
              <X size={18} />
            </button>

            {/* Event Image */}
            <div className="w-full flex items-center justify-center py-2">
              <img
                src={previewEvent.image}
                alt={previewEvent.title}
                className="max-w-full max-h-[50vh] sm:max-h-[55vh] w-auto h-auto object-contain rounded-2xl shadow-2xl border border-white/10"
              />
            </div>

            {/* Event Details & Full Description */}
            <div className="w-full pt-4 text-white border-t border-white/10 mt-3 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-wide font-heading">
                    {previewEvent.title}
                  </h3>
                  {previewEvent.subtitle && (
                    <p className="text-xs sm:text-sm text-amber-300 font-medium">
                      {previewEvent.subtitle}
                    </p>
                  )}
                </div>
                {previewEvent.date && (
                  <div className="text-xs font-bold px-3 py-1.5 rounded-full bg-[var(--orange)]/20 text-[var(--orange)] border border-[var(--orange)]/30 shrink-0 flex items-center gap-1.5">
                    <CalendarDays size={13} />
                    <span>{previewEvent.date}</span>
                  </div>
                )}
              </div>

              {previewEvent.description && (
                <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.04] border border-white/10 text-slate-200 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-normal space-y-2">
                  {previewEvent.description}
                </div>
              )}

              <div className="pt-1 flex items-center justify-between text-xs text-slate-400">
                <span className="text-[11px] uppercase tracking-wider text-amber-400 font-bold">
                  🕉️ Chinmaya Mission, Adoni
                </span>
                <button
                  type="button"
                  onClick={() => setPreviewEvent(null)}
                  className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;
