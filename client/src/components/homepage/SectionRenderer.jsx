import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CountdownTimer } from '../CountdownTimer';
import heroRunnersImage from '../../assets/hero-runners-2026-new.jpg';
import {
  Award,
  ArrowRight,
  MapPin,
  Calendar,
  HelpCircle,
  ChevronDown,
} from 'lucide-react';

export const SectionRenderer = ({ section, eventConfig, banners, activities, faqs }) => {
  const [openFaq, setOpenFaq] = useState(null);

  if (!section || !section.isEnabled) return null;

  const eventDateStr = eventConfig?.eventDate || '2026-12-20T06:00:00.000+05:30';

  switch (section.type) {
    case 'hero': {
      const heroGraphicUrl = heroRunnersImage;

      const rawSubtitle = section.subtitle || '';
      const displaySubtitle =
        /YOUR LIFE\.?\s*YOUR CHOICE/i.test(rawSubtitle) || !rawSubtitle
          ? 'WE RISE. WE RUN. WE RESIST.'
          : rawSubtitle;

      const rawDescription = section.description || '';
      const displayDescription =
        /Run for a Drug-Free Future/i.test(rawDescription) || !rawDescription
          ? 'RUN FOR LIFE. STAND AGAINST DRUGS'
          : rawDescription;

      return (
        <section className="relative overflow-hidden bg-gradient-to-b from-[#FFFDF9] via-[var(--bg-primary)] to-[#FFFDF9] border-b border-[var(--border-color)]/30 min-h-[440px] md:min-h-[480px] lg:min-h-[520px] flex items-center">
          {/* Subtle warm decorative glow */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[var(--orange)]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-10 w-80 h-80 bg-[var(--yellow)]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Desktop & Tablet: Right-side image set as background */}
          <div className="hidden md:block absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <img
              src={heroGraphicUrl}
              alt={section.title || 'Anti-Drug Movement Marathon Runners'}
              className="w-full h-full object-cover object-[center_right] lg:object-right"
              onError={(e) => {
                e.target.src = heroRunnersImage;
              }}
            />
            {/* Elegant multi-stop gradient overlay: ensures 100% sharp readability of text on the left while showcasing runners vibrantly on the right */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#FFFDF9] via-[#FFFDF9]/90 md:via-[#FFFDF9]/80 to-[#FFFDF9]/25 lg:to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#FFFDF9]/80 via-transparent to-[#FFFDF9]/40" />
          </div>

          <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center justify-between py-6 sm:py-8 md:py-12 lg:py-14 relative z-10 px-4 sm:px-6 lg:px-8 gap-8">
            {/* Content (Positioned on top of image for Desktop & Tablet) */}
            <div className="w-full md:max-w-xl lg:max-w-2xl flex justify-center md:justify-start items-center py-2 z-10 text-center md:text-left">
              <div className="w-full flex flex-col items-center md:items-start text-center md:text-left space-y-4 sm:space-y-5">
                <div className="space-y-2 sm:space-y-2.5">
                  <h1 className="text-2xl sm:text-4xl lg:text-[2.65rem] font-black font-heading tracking-tight text-[var(--text-primary)] leading-[1.1] uppercase drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
                    {section.title || 'ANTI-DRUG MOVEMENT MARATHON RUN 2026'}
                  </h1>
                  {displaySubtitle && (
                    <p className="text-base sm:text-xl lg:text-2xl font-black font-heading text-[var(--orange)] tracking-wide drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
                      {displaySubtitle}
                    </p>
                  )}
                  {displayDescription && (
                    <p className="text-xs sm:text-sm lg:text-base font-extrabold text-[var(--text-primary)]/85 max-w-lg mx-auto md:mx-0 leading-relaxed tracking-wider uppercase">
                      {displayDescription}
                    </p>
                  )}
                </div>

                {/* Date & Route Pill */}
                <div className="inline-flex flex-wrap items-center justify-center md:justify-start gap-3 sm:gap-5 px-3.5 sm:px-4 py-2.5 rounded-2xl bg-white/95 backdrop-blur-sm border border-[rgba(11,35,64,0.08)] shadow-[0_1px_3px_rgba(11,35,64,0.04),0_8px_24px_rgba(11,35,64,0.06)] text-xs font-bold text-[var(--text-primary)] mx-auto md:mx-0">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[var(--orange)] shrink-0" />
                    <span>Sunday, 20 December 2026</span>
                  </div>
                  <div className="h-4 w-px bg-[var(--border-color)] hidden sm:block" />
                  <Link
                    to="/route-map"
                    className="flex items-center gap-2 text-decoration-none text-[var(--text-primary)] hover:text-[var(--orange)] transition-colors cursor-pointer group"
                    title="Click to view Marathon Route Map"
                  >
                    <MapPin className="w-4 h-4 text-[var(--cyan)] group-hover:scale-110 transition-transform shrink-0" />
                    <span className="underline decoration-dotted underline-offset-4 font-extrabold">Route of Marathon</span>
                  </Link>
                </div>

                {/* Primary & Secondary Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3 pt-1 w-full sm:w-auto mx-auto md:mx-0">
                  {section.primaryButtonText && (
                    <Link
                      to={section.primaryButtonLink || '/register'}
                      className="btn-primary text-xs sm:text-sm py-3 sm:py-3.5 px-6 sm:px-7 text-decoration-none shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto justify-center"
                    >
                      <Award className="w-4 h-4 shrink-0" />
                      <span>{section.primaryButtonText}</span>
                    </Link>
                  )}
                  {section.secondaryButtonText && (
                    <a
                      href={section.secondaryButtonLink || '#about'}
                      className="btn-secondary text-xs sm:text-sm py-3 sm:py-3.5 px-6 sm:px-7 text-decoration-none bg-white/80 hover:bg-white backdrop-blur-sm transition-all duration-300 w-full sm:w-auto justify-center"
                    >
                      <span>{section.secondaryButtonText}</span>
                      <ArrowRight className="w-4 h-4 shrink-0" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile Only: Runners Graphic Card below content (Hidden on tablet and desktop) */}
            <div className="w-full md:hidden shrink-0 flex justify-center items-center">
              <div className="w-full max-w-[340px] sm:max-w-[500px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border border-[rgba(11,35,64,0.08)] bg-white/60 backdrop-blur-sm group">
                <img
                  src={heroGraphicUrl}
                  alt={section.title || 'Anti-Drug Movement Marathon Runners'}
                  className="w-full h-auto max-h-[220px] sm:max-h-[300px] object-cover block"
                  onError={(e) => {
                    e.target.src = heroRunnersImage;
                  }}
                />
              </div>
            </div>
          </div>
        </section>
      );
    }

    case 'marathon':
      return (
        <section className="pt-2 sm:pt-3 pb-2 px-4 sm:px-6 lg:px-8 bg-[var(--bg-primary)]">
          <div className="max-w-7xl mx-auto space-y-3 text-center">
            {section.title && (
              <div className="space-y-1">
                <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-[var(--text-primary)]">
                  {section.title}
                </h2>
                {section.subtitle && (
                  <p className="text-sm font-bold text-[var(--text-muted)]">{section.subtitle}</p>
                )}
              </div>
            )}
            <CountdownTimer targetDate={eventDateStr} />
          </div>
        </section>
      );

    case 'pillars':
      return null;

    case 'activities':
      return (
        <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 sm:space-y-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left pb-2 border-b border-slate-200/60">
            <div>
              <span className="text-xs font-extrabold text-[var(--orange)] uppercase tracking-widest block mb-1">
                {section.subtitle || 'GALLERY & HIGHLIGHTS'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-[var(--text-primary)]">
                {section.title || 'MOVEMENT ACTIVITIES & HIGHLIGHTS'}
              </h2>
            </div>
            {section.primaryButtonText && (
              <Link
                to={section.primaryButtonLink || '/activities'}
                className="btn-secondary py-2.5 px-5 text-xs font-bold text-decoration-none whitespace-nowrap shadow-sm hover:shadow"
              >
                <span>{section.primaryButtonText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>

          {activities && activities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 items-stretch">
              {activities.map((act) => (
                <article
                  key={act._id || act.title}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-[var(--orange)]/50 transition-all duration-300 flex flex-col h-full overflow-hidden group"
                >
                  {/* Full-width Image Area (Total image fully visible without cropping) */}
                  <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-950 flex items-center justify-center block">
                    {/* Ambient blurred backdrop so there are no empty borders */}
                    <img
                      src={act.imageUrl}
                      alt=""
                      aria-hidden="true"
                      className="absolute inset-0 w-full h-full object-cover blur-md opacity-35 scale-110 pointer-events-none"
                    />
                    {/* Full uncropped image visible completely */}
                    <img
                      src={act.imageUrl}
                      alt={act.title}
                      className="relative z-10 w-full h-full object-contain p-1.5 group-hover:scale-105 transition-transform duration-500 ease-out block"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-30 group-hover:opacity-20 transition-opacity z-10 pointer-events-none" />
                    
                    {act.category && (
                      <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/75 backdrop-blur-sm text-white font-bold text-[10px] uppercase tracking-wider border border-white/20 shadow-sm z-20">
                        {act.category}
                      </span>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-5 sm:p-6 flex flex-col flex-1 text-left">
                    <h3 className="text-base sm:text-lg font-bold font-heading text-[var(--text-primary)] group-hover:text-[var(--orange)] transition-colors leading-snug line-clamp-2 mb-2">
                      {act.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed flex-1">
                      {act.description}
                    </p>

                    <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[var(--orange)]">
                      <span className="text-[11px] uppercase tracking-wider text-slate-500">Movement Drive</span>
                      <span className="inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                        <span>Learn more</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="p-10 text-center text-xs font-semibold text-slate-500 bg-white border border-slate-200 rounded-2xl">
              Activities will appear here once published.
            </div>
          )}
        </section>
      );

    case 'faq':
      return (
        <section className="py-16 px-4 bg-[var(--bg-primary)] border-t border-[var(--border-color)]">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <span className="text-xs font-extrabold text-[var(--orange)] uppercase tracking-widest">
                {section.subtitle || 'QUESTIONS & ANSWERS'}
              </span>
              <h2 className="text-3xl font-extrabold font-heading text-[var(--text-primary)]">
                {section.title || 'FREQUENTLY ASKED QUESTIONS'}
              </h2>
            </div>

            <div className="space-y-4">
              {(faqs || []).map((faq, idx) => (
                <div key={faq._id || idx} className="rounded-2xl bg-white border border-[rgba(11,35,64,0.08)] shadow-[0_1px_3px_rgba(11,35,64,0.04),0_4px_12px_rgba(11,35,64,0.04)] overflow-hidden hover:shadow-[0_4px_12px_rgba(11,35,64,0.06),0_8px_24px_rgba(11,35,64,0.08)] transition-all duration-300">
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between p-5 text-left font-bold text-sm text-[var(--text-primary)] hover:text-[var(--orange)] transition-colors"
                  >
                    <span className="flex items-center gap-3">
                      <HelpCircle className="w-5 h-5 text-[var(--orange)] flex-shrink-0" />
                      {faq.question}
                    </span>
                    <ChevronDown className={`w-5 h-5 text-[var(--text-muted)] transition-transform ${openFaq === idx ? 'rotate-180 text-[var(--orange)]' : ''}`} />
                  </button>
                  {openFaq === idx && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed border-t border-[var(--border-color)]/50 pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    case 'cta':
      return (
        <section className="py-16 px-4 bg-gradient-to-r from-[var(--orange)] via-[#E64A19] to-[var(--orange)] text-white text-center">
          <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-5xl font-black font-heading tracking-tight">
              {section.title ? section.title.replace(/\s*IN\s*ADONI/gi, '') : 'BE PART OF THE MOVEMENT!'}
            </h2>
            <p className="text-base sm:text-lg text-white/90 max-w-2xl mx-auto font-medium">
              {section.description || 'Register today individually or submit your school/college bulk student details. Receive your official marathon certificate & pass!'}
            </p>
            {section.primaryButtonText && (
              <div>
                <Link
                  to={section.primaryButtonLink || '/register'}
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white text-slate-900 font-extrabold text-base shadow-2xl hover:bg-slate-100 transition-transform hover:scale-105 text-decoration-none"
                >
                  <Award className="w-5 h-5 text-[var(--orange)]" />
                  <span>{section.primaryButtonText}</span>
                </Link>
              </div>
            )}
          </div>
        </section>
      );

    case 'about':
      return (
        <section className="py-16 px-4 max-w-6xl mx-auto">
          <div className="p-8 sm:p-12 rounded-3xl bg-white border border-[rgba(11,35,64,0.08)] border-l-4 border-l-[var(--orange)] space-y-6 shadow-[0_1px_3px_rgba(11,35,64,0.04),0_8px_24px_rgba(11,35,64,0.06)]">
            {section.badgeText && (
              <span className="px-3.5 py-1 rounded-full bg-[var(--orange)]/15 text-[var(--orange)] font-extrabold text-xs uppercase tracking-widest">
                {section.badgeText}
              </span>
            )}
            <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-[var(--text-primary)]">
              {section.title}
            </h2>
            {section.subtitle && (
              <h3 className="text-lg font-bold text-[var(--orange)]">{section.subtitle}</h3>
            )}
            {section.description && (
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">{section.description}</p>
            )}
            {section.imageUrl && (
              <div className="rounded-2xl overflow-hidden max-h-[350px]">
                <img src={section.imageUrl} alt={section.title} className="w-full object-cover" />
              </div>
            )}
          </div>
        </section>
      );

    case 'custom':
    case 'text':
    default:
      return (
        <section className="py-12 px-4 max-w-6xl mx-auto space-y-4 text-center">
          {section.badgeText && (
            <span className="px-3.5 py-1 rounded-full bg-[var(--orange)]/15 text-[var(--orange)] font-extrabold text-xs uppercase tracking-widest">
              {section.badgeText}
            </span>
          )}
          {section.title && (
            <h2 className="text-3xl font-extrabold font-heading text-[var(--text-primary)]">
              {section.title}
            </h2>
          )}
          {section.subtitle && (
            <p className="text-base font-bold text-[var(--orange)]">{section.subtitle}</p>
          )}
          {section.description && (
            <p className="text-sm text-[var(--text-muted)] leading-relaxed max-w-3xl mx-auto">
              {section.description}
            </p>
          )}
          {section.imageUrl && (
            <div className="rounded-2xl overflow-hidden max-h-[350px] mx-auto max-w-3xl pt-4">
              <img src={section.imageUrl} alt={section.title} className="w-full object-cover" />
            </div>
          )}
          {(section.primaryButtonText || section.secondaryButtonText) && (
            <div className="flex justify-center gap-4 pt-4">
              {section.primaryButtonText && (
                <Link to={section.primaryButtonLink || '/register'} className="btn-primary py-3 px-6 text-xs text-decoration-none">
                  {section.primaryButtonText}
                </Link>
              )}
              {section.secondaryButtonText && (
                <Link to={section.secondaryButtonLink || '/about'} className="btn-secondary py-3 px-6 text-xs text-decoration-none">
                  {section.secondaryButtonText}
                </Link>
              )}
            </div>
          )}
        </section>
      );
  }
};

export const QuoteBanner = () => {
  return (
    <section className="relative overflow-hidden min-h-[100px] sm:min-h-[125px] flex items-center justify-center px-4 sm:px-6 lg:px-12 py-5 sm:py-7 lg:py-8 text-white bg-[#07162D] border-y border-slate-800/80 shadow-xl">
      {/* Background Road Image with Dark Blue Tint */}
      <div
        className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-25 mix-blend-luminosity"
        style={{
          backgroundImage: "url('/assets/sunset-road.jpg')",
          backgroundPosition: "center 60%",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#07162D]/95 via-[#07162D]/90 to-[#07162D]/95 pointer-events-none" />

      {/* Quote Content - 1 Line on Desktop/Tablet, 2 Lines on Mobile */}
      <div className="relative z-10 w-full max-w-7xl mx-auto text-center px-2">
        <p className="font-serif italic text-xs min-[400px]:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-white font-medium leading-relaxed sm:whitespace-nowrap mb-2 sm:mb-3">
          <span className="block sm:inline">
            <span className="font-serif not-italic text-[#FFD12D] text-lg sm:text-xl md:text-2xl lg:text-3xl mr-1 select-none">“</span>
            The youth are not useless, they are used less.{' '}
          </span>
          <span className="block sm:inline">
            The youth are not careless, they are cared less.
            <span className="font-serif not-italic text-[#FFD12D] text-lg sm:text-xl md:text-2xl lg:text-3xl ml-1 select-none">”</span>
          </span>
        </p>
        <small className="inline-block font-sans not-italic text-[11px] sm:text-xs md:text-sm lg:text-base text-[#F6D9BA] font-bold tracking-widest uppercase">
          - Swami Chinmayananda
        </small>
      </div>
    </section>
  );
};
