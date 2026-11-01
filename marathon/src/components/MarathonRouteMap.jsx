import React from 'react';
import { MapPin, Navigation, ExternalLink, Flag, Award, Compass } from 'lucide-react';

export const GOOGLE_MAPS_ROUTE_URL = 'https://maps.app.goo.gl/aBVcfaNbbFJTNvmX9?g_st=aw';
const EMBED_MAP_URL = 'https://maps.google.com/maps?saddr=Municipal%20High%20School%2C%20Adoni&daddr=Gosha%20Hospital%20Govt.Hospital%20Adoni%20to%3AChinmaya%20Mission%2C%20Adoni&t=&z=14&ie=UTF8&iwloc=&output=embed';

export const MarathonRouteMap = ({ className = '' }) => {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with Title and Google Maps Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-color)] shadow-lg">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--cyan)]/15 border border-[var(--cyan)]/30 text-[var(--cyan)] text-xs font-black tracking-wider uppercase">
            <span className="w-2 h-2 rounded-full bg-[var(--cyan)] animate-pulse" />
            <span>Official Marathon Route Map • Adoni 2026</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black font-heading text-[var(--text-primary)]">
            Course Directions & Live Route
          </h3>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] font-medium">
            Starting from <strong>Municipal High School</strong>, passing <strong>Gosha Hospital</strong>, and culminating at <strong>Chinmaya Mission</strong>.
          </p>
        </div>

        <a
          href={GOOGLE_MAPS_ROUTE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-2xl bg-gradient-to-r from-[var(--orange)] to-amber-500 hover:from-amber-500 hover:to-[var(--orange)] text-slate-950 font-black text-xs sm:text-sm shadow-xl hover:shadow-orange-500/25 transition-all duration-300 transform hover:scale-[1.02] cursor-pointer shrink-0 text-decoration-none"
        >
          <Navigation className="w-4 h-4" />
          <span>OPEN IN GOOGLE MAPS</span>
          <ExternalLink className="w-4 h-4 ml-0.5" />
        </a>
      </div>

      {/* Embedded Google Maps View */}
      <div className="relative rounded-3xl overflow-hidden border-2 border-[var(--border-color)] shadow-2xl bg-slate-900">
        <div className="aspect-[16/10] sm:aspect-[16/9] w-full min-h-[380px] sm:min-h-[500px]">
          <iframe
            src={EMBED_MAP_URL}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Anti-Drug Marathon 2026 Route Map - Municipal High School to Chinmaya Mission via Gosha Hospital"
            className="w-full h-full"
          />
        </div>

        {/* Floating Quick Action Overlay */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10">
          <a
            href={GOOGLE_MAPS_ROUTE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-slate-950/85 backdrop-blur-md border border-white/20 text-white text-xs font-bold hover:bg-slate-900 transition-all shadow-lg hover:border-orange-500"
            title="Open directions in Google Maps app"
          >
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>Interactive Directions</span>
            <ExternalLink className="w-3 h-3 text-orange-400" />
          </a>
        </div>
      </div>

      {/* Route Key Waypoints Guide */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0 font-black text-xs">
            <Flag className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-black tracking-widest text-emerald-400">Step 1 • Start Point</div>
            <h4 className="text-sm font-black text-[var(--text-primary)]">Municipal High School</h4>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">Flag-off & participant assembly at 6:00 AM</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0 font-black text-xs">
            <Navigation className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-black tracking-widest text-cyan-400">Step 2 • Waypoint</div>
            <h4 className="text-sm font-black text-[var(--text-primary)]">Gosha Hospital (Govt. Hospital)</h4>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">Hydration, medical station & volunteer cheer zone</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-orange-500/15 border border-orange-500/30 text-orange-400 flex items-center justify-center shrink-0 font-black text-xs">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-black tracking-widest text-orange-400">Step 3 • Finish Arch</div>
            <h4 className="text-sm font-black text-[var(--text-primary)]">Chinmaya Mission Adoni</h4>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">Finish line, medal ceremony & breakfast</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarathonRouteMap;
