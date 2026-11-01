import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';

export const ChinmayaMissionBadge = ({ className = '', size = 'medium' }) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    navigate('/route-map');
  };

  const isSmall = size === 'small';

  return (
    <button
      onClick={handleClick}
      type="button"
      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--bg-secondary)] border border-[var(--cyan)] shadow-sm hover:shadow-cyan-500/20 hover:scale-105 transition-all text-decoration-none cursor-pointer ${className}`}
      title="Click to view Marathon Route Map"
    >
      <div className={`rounded-full bg-[var(--cyan)]/20 flex items-center justify-center text-[var(--cyan)] ${isSmall ? 'w-4 h-4' : 'w-5 h-5'}`}>
        <MapPin className={isSmall ? 'w-2.5 h-2.5' : 'w-3 h-3'} />
      </div>
      <span className={`font-extrabold text-[var(--text-primary)] tracking-wide ${isSmall ? 'text-xs' : 'text-xs sm:text-sm'}`}>
        Route of Marathon
      </span>
    </button>
  );
};

export default ChinmayaMissionBadge;
