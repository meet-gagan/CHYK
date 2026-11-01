import React from 'react';
import { ExternalLink, Compass } from 'lucide-react';

export const GOOGLE_MAPS_ROUTE_URL = 'https://maps.app.goo.gl/aBVcfaNbbFJTNvmX9?g_st=aw';
const EMBED_MAP_URL = 'https://maps.google.com/maps?saddr=Municipal%20High%20School%2C%20Adoni&daddr=Gosha%20Hospital%20Govt.Hospital%20Adoni%20to%3AChinmaya%20Mission%2C%20Adoni&t=&z=14&ie=UTF8&iwloc=&output=embed';

export const MarathonRouteMap = ({ className = '' }) => {
  return (
    <div className={`w-full flex justify-center ${className}`}>
      {/* Embedded Google Maps View (Square Shape) */}
      <div
        className="relative w-full max-w-[560px] aspect-square rounded-3xl overflow-hidden border border-[var(--border-color)] shadow-xl bg-slate-900"
        style={{ aspectRatio: '1 / 1' }}
      >
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

        {/* Floating Quick Action Overlay */}
        <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 z-10">
          <a
            href={GOOGLE_MAPS_ROUTE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950/85 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold hover:bg-slate-900 transition-all shadow-md hover:border-orange-500 text-decoration-none"
            title="Open directions in Google Maps app"
          >
            <Compass className="w-3 h-3 text-amber-400" />
            <span>Interactive Directions</span>
            <ExternalLink className="w-2.5 h-2.5 text-orange-400" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default MarathonRouteMap;
