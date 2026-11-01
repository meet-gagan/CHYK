import React, { useState } from 'react';
import { ExternalLink, Compass, Droplet, MapPin, Check, RotateCcw, Users } from 'lucide-react';

export const GOOGLE_MAPS_ROUTE_URL = 'https://maps.app.goo.gl/aBVcfaNbbFJTNvmX9?g_st=aw';
const FULL_ROUTE_EMBED_URL = 'https://maps.google.com/maps?saddr=Municipal%20High%20School%2C%20Adoni&daddr=Gosha%20Hospital%20Govt.Hospital%20Adoni%20to%3AChinmaya%20Mission%2C%20Adoni&t=&z=14&ie=UTF8&iwloc=&output=embed';

const WATER_POINTS = [
  {
    number: 1,
    name: 'Government hospital',
    desc: 'Hydration & First Aid Station',
    embedUrl: 'https://maps.google.com/maps?q=Gosha+Hospital+Govt+Hospital+Adoni&t=&z=16&ie=UTF8&iwloc=&output=embed',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Gosha+Hospital+Govt+Hospital+Adoni',
    badgeGradient: 'from-blue-500 to-cyan-500',
    cardBg: 'bg-gradient-to-r from-blue-50/70 via-white to-white',
    cardBorder: 'border-blue-200/80 hover:border-blue-400',
    shadowColor: 'shadow-blue-500/20',
  },
  {
    number: 2,
    name: 'VSB circle',
    desc: 'Hydration & Energy Station',
    embedUrl: 'https://maps.google.com/maps?q=VSB+Circle+Adoni+Andhra+Pradesh&t=&z=16&ie=UTF8&iwloc=&output=embed',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=VSB+Circle+Adoni+Andhra+Pradesh',
    badgeGradient: 'from-amber-500 to-orange-500',
    cardBg: 'bg-gradient-to-r from-orange-50/70 via-white to-white',
    cardBorder: 'border-orange-200/80 hover:border-orange-400',
    shadowColor: 'shadow-orange-500/20',
  },
  {
    number: 3,
    name: 'Yemmiganur circle',
    desc: 'Hydration & Refreshment Station',
    embedUrl: 'https://maps.google.com/maps?q=Yemmiganur+Circle+Adoni+Andhra+Pradesh&t=&z=16&ie=UTF8&iwloc=&output=embed',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Yemmiganur+Circle+Adoni+Andhra+Pradesh',
    badgeGradient: 'from-emerald-500 to-teal-500',
    cardBg: 'bg-gradient-to-r from-emerald-50/70 via-white to-white',
    cardBorder: 'border-emerald-200/80 hover:border-emerald-400',
    shadowColor: 'shadow-emerald-500/20',
  },
  {
    number: 4,
    name: 'Chinmaya mission',
    desc: 'Finish Line Hydration & Recovery',
    embedUrl: 'https://maps.google.com/maps?q=Chinmaya+Mission+Adoni+Andhra+Pradesh&t=&z=16&ie=UTF8&iwloc=&output=embed',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Chinmaya+Mission+Adoni+Andhra+Pradesh',
    badgeGradient: 'from-purple-500 to-indigo-600',
    cardBg: 'bg-gradient-to-r from-purple-50/70 via-white to-white',
    cardBorder: 'border-purple-200/80 hover:border-purple-400',
    shadowColor: 'shadow-purple-500/20',
  },
];

export const MarathonRouteMap = ({ className = '' }) => {
  const [selectedPointNumber, setSelectedPointNumber] = useState(null);

  const activePoint = WATER_POINTS.find((p) => p.number === selectedPointNumber);
  const currentEmbedUrl = activePoint ? activePoint.embedUrl : FULL_ROUTE_EMBED_URL;
  const currentDirectionsUrl = activePoint ? activePoint.mapUrl : GOOGLE_MAPS_ROUTE_URL;

  const handleCardClick = (pointNumber) => {
    setSelectedPointNumber((prev) => (prev === pointNumber ? null : pointNumber));
  };

  return (
    <div className={`w-full max-w-6xl mx-auto ${className}`}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
        {/* Left Side: Interactive Map */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="relative w-full h-full min-h-[380px] sm:min-h-[440px] rounded-3xl overflow-hidden border border-[var(--border-color)] shadow-xl bg-slate-900 flex-1">
            <iframe
              key={currentEmbedUrl}
              src={currentEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={
                activePoint
                  ? `${activePoint.name} - Anti-Drug Marathon 2026 Water Point`
                  : 'Anti-Drug Marathon 2026 Route Map - Municipal High School to Chinmaya Mission via Gosha Hospital'
              }
              className="w-full h-full min-h-[380px] sm:min-h-[440px]"
            />

            {/* Top-Left: Active Location / Full Route Mode Indicator */}
            <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 z-10 flex items-center gap-2">
              {activePoint ? (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950/90 backdrop-blur-md border border-cyan-400/40 text-white text-[11px] font-bold shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span className="truncate max-w-[160px] sm:max-w-none">{activePoint.name}</span>
                  <button
                    type="button"
                    onClick={() => setSelectedPointNumber(null)}
                    className="ml-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/20 hover:bg-white/30 text-amber-300 hover:text-white text-[10px] font-extrabold transition-colors cursor-pointer border-0"
                    title="Reset to view full marathon route"
                  >
                    <RotateCcw className="w-2.5 h-2.5" />
                    <span>Full Route</span>
                  </button>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950/85 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold shadow-md">
                  <MapPin className="w-3 h-3 text-cyan-400" />
                  <span>Full 3.5 KM Marathon Route</span>
                </div>
              )}
            </div>

            {/* Top-Right: External Directions Overlay */}
            <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 z-10">
              <a
                href={currentDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950/85 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold hover:bg-slate-900 transition-all shadow-md hover:border-orange-500 text-decoration-none"
                title="Open in Google Maps app"
              >
                <Compass className="w-3 h-3 text-amber-400" />
                <span className="hidden sm:inline">Interactive Directions</span>
                <span className="sm:hidden">Directions</span>
                <ExternalLink className="w-2.5 h-2.5 text-orange-400" />
              </a>
            </div>
          </div>
        </div>

        {/* Right Side: Water Points Heading and 4 Cards */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-cyan-500/15 text-cyan-700 border border-cyan-500/25">
                <Droplet className="w-3.5 h-3.5 fill-cyan-500 text-cyan-500" />
                <span>Hydration Along The Route</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-amber-500/15 text-amber-700 border border-amber-500/25">
                <Users className="w-3.5 h-3.5 text-amber-600" />
                <span>Route Marshals</span>
              </div>
            </div>
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-2xl sm:text-3xl font-black font-heading text-[var(--text-primary)]">
                Water Points
              </h3>
              {activePoint && (
                <button
                  type="button"
                  onClick={() => setSelectedPointNumber(null)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--orange)] hover:underline cursor-pointer bg-transparent border-0"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Show Full Route</span>
                </button>
              )}
            </div>
          </div>

          {/* 4 Cards with Dynamic Selection (Updates Map directly on left side) */}
          <div className="grid grid-cols-1 gap-3 sm:gap-3.5 flex-1 justify-center">
            {WATER_POINTS.map((point) => {
              const isSelected = selectedPointNumber === point.number;
              return (
                <button
                  key={point.number}
                  type="button"
                  onClick={() => handleCardClick(point.number)}
                  className={`w-full text-left p-3.5 sm:p-4 rounded-2xl ${point.cardBg} border ${
                    isSelected
                      ? 'border-cyan-500 ring-2 ring-cyan-400/50 shadow-md scale-[1.01]'
                      : `${point.cardBorder} shadow-[0_1px_3px_rgba(11,35,64,0.04),0_8px_24px_rgba(11,35,64,0.06)] hover:shadow-md`
                  } transition-all duration-200 flex items-center gap-3.5 group cursor-pointer`}
                  title={`Click to show ${point.name} directly in the map on the left`}
                >
                  {/* Number Badge with Unique Color Gradient */}
                  <div
                    className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br ${point.badgeGradient} text-white flex items-center justify-center font-black text-sm shrink-0 shadow-md ${point.shadowColor} ${
                      isSelected ? 'scale-110' : 'group-hover:scale-105'
                    } transition-transform`}
                  >
                    <span>{point.number}</span>
                  </div>

                  {/* Point Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-sm sm:text-base font-extrabold text-[var(--text-primary)] group-hover:text-[var(--orange)] transition-colors">
                        {point.name}
                      </h4>
                      {isSelected && (
                        <span className="shrink-0 inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-600 text-white shadow-sm">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                          <span>Shown on Map</span>
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] sm:text-xs text-[var(--text-muted)] font-medium mt-0.5">
                      {point.desc}
                    </p>
                  </div>

                  {/* Map Pin Indicator */}
                  <div
                    className={`shrink-0 flex items-center gap-1 transition-colors ${
                      isSelected ? 'text-cyan-600' : 'text-[var(--text-muted)] group-hover:text-[var(--orange)]'
                    }`}
                  >
                    <MapPin
                      className={`w-4 h-4 ${
                        isSelected ? 'scale-125 text-cyan-600' : 'group-hover:scale-110'
                      } transition-transform`}
                    />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Route Marshals Security & Safety Card */}
          <div className="p-3 sm:p-3.5 rounded-2xl bg-[var(--bg-secondary,#FFFBF5)] border border-[var(--border-color)] flex items-center gap-3 shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-600 flex items-center justify-center shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <strong className="block text-xs sm:text-sm font-black text-[var(--text-primary)]">
                Route Marshals
              </strong>
              <p className="text-[10px] sm:text-[11px] text-[var(--text-muted)] font-medium leading-tight">
                Dedicated CYK volunteers ensuring zero-traffic running lanes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarathonRouteMap;
