import React, { useState, useEffect } from 'react';
import { Sparkles, X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

export const ContinuousVerticalBannerSlider = ({ banners = [] }) => {
  const [activeModalIndex, setActiveModalIndex] = useState(null);
  // Default 7 poster visuals if backend banners are loading or empty
  const defaultPosters = [
    {
      id: 'p1',
      imageUrl: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?q=80&w=800&auto=format&fit=crop',
      title: 'SAY NO TO DRUGS • CHOOSE LIFE',
      tag: 'HEALTH & ENERGY',
      color: 'from-orange-600 to-amber-500',
    },
    {
      id: 'p2',
      imageUrl: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=800&auto=format&fit=crop',
      title: 'YOUTH FOR A DRUG-FREE FUTURE',
      tag: 'DISCIPLINE & PURPOSE',
      color: 'from-cyan-600 to-blue-500',
    },
    {
      id: 'p3',
      imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop',
      title: 'RUN FOR FITNESS, FRIENDSHIP & FREEDOM',
      tag: 'CONFIDENCE & WILLPOWER',
      color: 'from-emerald-600 to-green-500',
    },
    {
      id: 'p4',
      imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=800&auto=format&fit=crop',
      title: 'PEER PRESSURE IS OUT • INTEGRITY IS IN',
      tag: 'CHINMAYA YUVA KENDRA, ADONI',
      color: 'from-purple-600 to-indigo-500',
    },
    {
      id: 'p5',
      imageUrl: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=800&auto=format&fit=crop',
      title: 'YOUR CHOICE DEFINES YOUR TOMORROW',
      tag: 'DECEMBER 20, 2026',
      color: 'from-pink-600 to-rose-500',
    },
    {
      id: 'p6',
      imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=800&auto=format&fit=crop',
      title: 'UNITED SCHOOLS & COLLEGES',
      tag: 'COMMUNITY POWER',
      color: 'from-yellow-600 to-orange-500',
    },
    {
      id: 'p7',
      imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop',
      title: 'MOVE. INSPIRE. CONNECT. 2026',
      tag: 'ANTI-DRUG MOVEMENT',
      color: 'from-blue-600 to-cyan-400',
    },
  ];

  // Filter out any default 'Vertical Poster' items
  const cleanBanners = (banners || []).filter(
    (b) => !/^Vertical Poster/i.test(b.title || '')
  );
  const itemsToDisplay = cleanBanners.length > 0 ? cleanBanners : defaultPosters;
  // Duplicate list to guarantee seamless infinite loop from right to left
  const duplicatedItems = [...itemsToDisplay, ...itemsToDisplay];

  // Lock background scroll and listen for keyboard navigation when popup is open
  useEffect(() => {
    if (activeModalIndex !== null) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          setActiveModalIndex(null);
        } else if (e.key === 'ArrowLeft') {
          setActiveModalIndex((prev) => (prev > 0 ? prev - 1 : itemsToDisplay.length - 1));
        } else if (e.key === 'ArrowRight') {
          setActiveModalIndex((prev) => (prev < itemsToDisplay.length - 1 ? prev + 1 : 0));
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = prevOverflow;
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [activeModalIndex, itemsToDisplay.length]);

  const activeItem = activeModalIndex !== null ? itemsToDisplay[activeModalIndex] : null;
  const activeCleanTag = activeItem
    ? (activeItem.tag || activeItem.category || '')
        .replace(/\bmarathon\b\s*/gi, '')
        .replace(/\b2026\b/gi, '')
        .trim()
    : '';

  return (
    <div className="w-full overflow-hidden py-10 sm:py-14 bg-[var(--bg-dark-section)] relative border-y border-[var(--border-color)]">
      
      {/* Header Container aligned with main layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[var(--yellow)]/15 text-[var(--yellow)] font-extrabold text-xs tracking-widest uppercase border border-[var(--yellow)]/30">
          <Sparkles className="w-3.5 h-3.5" />
          <span>MOVEMENT POSTERS & INSPIRATION</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-extrabold font-heading text-white tracking-tight uppercase">
          CHINMAYA YUVA KENDRA, ADONI
        </h3>
      </div>

      {/* Visual Overlay Gradients for smooth fade on left/right edges */}
      <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-[var(--bg-dark-section)] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-[var(--bg-dark-section)] to-transparent z-10 pointer-events-none" />

      {/* Infinite Right-to-Left Continuous Loop Container */}
      <div className="animate-scroll gap-5 sm:gap-6 px-4">
        {duplicatedItems.map((item, idx) => {
          const cleanTag = (item.tag || item.category || '')
            .replace(/\bmarathon\b\s*/gi, '')
            .replace(/\b2026\b/gi, '')
            .trim();

          const originalIndex = idx % itemsToDisplay.length;

          return (
            <div
              key={`${item._id || item.id || idx}-${idx}`}
              role="button"
              tabIndex={0}
              onClick={() => setActiveModalIndex(originalIndex)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setActiveModalIndex(originalIndex);
                }
              }}
              title="Click to view full photo"
              className="w-64 sm:w-72 h-88 sm:h-96 flex-shrink-0 rounded-3xl overflow-hidden relative group border border-white/15 shadow-2xl transition-all duration-300 hover:scale-[1.03] hover:border-[var(--orange)] hover:shadow-[0_0_30px_rgba(249,115,22,0.35)] cursor-pointer bg-slate-900 select-none"
            >
              <img
                src={item.imageUrl}
                alt={item.title || 'Chinmaya Yuva Kendra'}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-90 group-hover:brightness-100 block"
                loading="lazy"
              />

              {/* Hover Click to Enlarge Badge */}
              <div className="absolute top-3.5 right-3.5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold flex items-center gap-1.5 shadow-lg z-10 pointer-events-none">
                <ZoomIn className="w-3 h-3 text-[var(--orange)]" />
                <span>Click to expand</span>
              </div>
              
              {/* Poster Card Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent p-5 sm:p-6 flex flex-col justify-end text-left space-y-2">
                {cleanTag && cleanTag.toLowerCase() !== 'banner' ? (
                  <span className="inline-block self-start px-2.5 py-1 text-[10px] font-black tracking-wider rounded-lg bg-[var(--orange)] text-white shadow-md uppercase">
                    {cleanTag}
                  </span>
                ) : null}
                <h4 className="text-base font-extrabold text-white leading-snug font-heading group-hover:text-[var(--yellow)] transition-colors line-clamp-2">
                  {item.title}
                </h4>
                <p className="text-xs text-[var(--yellow)] font-bold tracking-wider uppercase">
                  CHINMAYA YUVA KENDRA, ADONI
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox Pop-up Modal for Full Image Display */}
      {activeModalIndex !== null && activeItem && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setActiveModalIndex(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
        >
          {/* Modal Container */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl max-h-[92vh] flex flex-col items-center justify-between rounded-3xl bg-slate-950/95 border border-white/20 p-3 sm:p-5 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
          >
            {/* Top Bar: Counter & Close Button */}
            <div className="w-full flex items-center justify-between gap-3 pb-3 mb-2 border-b border-white/10 px-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[var(--orange)] animate-pulse" />
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Photo Preview ({activeModalIndex + 1} of {itemsToDisplay.length})
                </span>
              </div>

              <button
                type="button"
                onClick={() => setActiveModalIndex(null)}
                aria-label="Close image popup"
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Image with Navigation Arrows */}
            <div className="relative w-full flex items-center justify-center overflow-hidden my-auto py-2">
              {/* Prev Button */}
              {itemsToDisplay.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveModalIndex((prev) => (prev > 0 ? prev - 1 : itemsToDisplay.length - 1));
                  }}
                  aria-label="Previous photo"
                  className="absolute left-2 sm:left-4 z-20 p-2 sm:p-3 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 transition-all hover:scale-110 cursor-pointer shadow-lg backdrop-blur-sm"
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              )}

              {/* Full Image */}
              <div className="max-h-[66vh] sm:max-h-[72vh] flex items-center justify-center overflow-hidden rounded-2xl bg-black/50">
                <img
                  src={activeItem.imageUrl}
                  alt={activeItem.title || 'Chinmaya Yuva Kendra'}
                  className="max-h-[66vh] sm:max-h-[72vh] max-w-full object-contain rounded-2xl select-none shadow-2xl"
                />
              </div>

              {/* Next Button */}
              {itemsToDisplay.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveModalIndex((prev) => (prev < itemsToDisplay.length - 1 ? prev + 1 : 0));
                  }}
                  aria-label="Next photo"
                  className="absolute right-2 sm:right-4 z-20 p-2 sm:p-3 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 transition-all hover:scale-110 cursor-pointer shadow-lg backdrop-blur-sm"
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              )}
            </div>

            {/* Bottom Caption & Tag */}
            <div className="w-full pt-3 mt-2 border-t border-white/10 px-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="text-left">
                <h4 className="text-base sm:text-lg font-black text-white leading-snug">
                  {activeItem.title}
                </h4>
                <p className="text-xs text-slate-400 font-bold tracking-wider uppercase">
                  CHINMAYA YUVA KENDRA, ADONI • Anti-Drug Movement 2026
                </p>
              </div>

              {activeCleanTag && activeCleanTag.toLowerCase() !== 'banner' && (
                <span className="px-3 py-1 rounded-full bg-[var(--orange)] text-white text-[10px] font-black uppercase tracking-wider shadow">
                  {activeCleanTag}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
