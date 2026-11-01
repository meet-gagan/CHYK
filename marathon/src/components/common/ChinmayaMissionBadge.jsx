import React from 'react';
import { MapPin, ExternalLink } from 'lucide-react';

export const ChinmayaMissionBadge = ({ className = '', size = 'medium' }) => {
  const handleClick = (e) => {
    e.preventDefault();
    window.open('https://maps.app.goo.gl/aBVcfaNbbFJTNvmX9?g_st=aw', '_blank', 'noopener,noreferrer');
  };

  const isSmall = size === 'small';

  return (
    <button
      onClick={handleClick}
      type="button"
      className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[var(--bg-secondary)] border-2 border-[var(--cyan)] shadow-md hover:shadow-cyan-500/20 hover:scale-105 transition-all text-decoration-none cursor-pointer ${className}`}
      title="Click to view Marathon Route Map on Google Maps"
    >
      <div className={`rounded-full bg-[var(--cyan)]/20 flex items-center justify-center text-[var(--cyan)] ${isSmall ? 'w-5 h-5' : 'w-6 h-6'}`}>
        <MapPin className={isSmall ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      </div>
      <span className={`font-extrabold text-[var(--text-primary)] tracking-wide ${isSmall ? 'text-xs' : 'text-sm'}`}>
        Route of Marathon
      </span>
      <ExternalLink className={isSmall ? 'w-3 h-3 text-[var(--orange)]' : 'w-3.5 h-3.5 text-[var(--orange)]'} />
    </button>
  );
};

export default ChinmayaMissionBadge;
