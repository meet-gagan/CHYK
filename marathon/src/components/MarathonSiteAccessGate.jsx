import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { useMarathonSiteSettings } from '../context/MarathonSiteSettingsContext';
import { MarathonComingSoonPage } from '../pages/MarathonComingSoonPage';
import { getAdminToken } from '../services/api';

const COMING_SOON_PATHS = ['/coming-soon', '/comming-soon', '/launch', '/teaser'];

export function MarathonSiteAccessGate({ children }) {
  const { isLive, loading, toggleLive } = useMarathonSiteSettings();
  const location = useLocation();
  const pathname = location.pathname.toLowerCase().replace(/\/+$/, '') || '/';

  const hostname = typeof window !== 'undefined' ? window.location.hostname.toLowerCase() : '';

  // 1. If accessed via marathon.chinmayamissionadoni.org, always display Coming Soon!
  const isComingSoonDomain =
    hostname.includes('marathon.chinmayamissionadoni.org') ||
    hostname.includes('marathon.chinmayamissionadoni.org');

  if (isComingSoonDomain) {
    return <MarathonComingSoonPage />;
  }

  // 2. If accessed via chyk.vercel.app, keep it unconditionally LIVE!
  const isChykLiveDomain = hostname.includes('chyk.vercel.app');

  // 3. Always allow Admin routes and Pass Verification unconditionally
  if (pathname.startsWith('/admin') || pathname.startsWith('/verify-pass') || pathname.startsWith('/pass/')) {
    return (
      <>
        {children}
        <AdminStatusToggle isLive={isChykLiveDomain ? true : isLive} onToggle={toggleLive} />
      </>
    );
  }

  // 4. Loading state while checking marathon site settings from API (bypass spinner if on chyk.vercel.app)
  if (loading && !isChykLiveDomain) {
    return (
      <div className="min-h-screen bg-[#07162D] flex flex-col items-center justify-center text-orange-400">
        <div className="w-10 h-10 border-4 border-[#F0441D] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs font-bold tracking-widest text-[#F6D9BA] uppercase">
          CHINMAYA YUVA KENDRA • MARATHON 2026
        </p>
      </div>
    );
  }

  const effectiveIsLive = isChykLiveDomain ? true : isLive;
  const isComingSoonRoute = COMING_SOON_PATHS.includes(pathname);

  // 5. When isLive === false (Coming Soon mode active):
  //    Block all public routes and display the Marathon Coming Soon page
  if (!effectiveIsLive) {
    if (isComingSoonRoute) {
      return (
        <>
          <MarathonComingSoonPage />
          <AdminStatusToggle isLive={effectiveIsLive} onToggle={toggleLive} />
        </>
      );
    }
    // Blocked: Any attempt to access public routes redirects to /coming-soon
    return <Navigate to="/coming-soon" replace />;
  }

  // 6. When isLive === true (Live mode active):
  //    Display everything EXCEPT the coming soon page (which redirects to /)
  if (effectiveIsLive && isComingSoonRoute) {
    return <Navigate to="/" replace />;
  }

  // Normal live website rendering
  return (
    <>
      {children}
      <AdminStatusToggle isLive={effectiveIsLive} onToggle={toggleLive} />
    </>
  );
}

/**
 * Floating quick-toggle badge visible to administrators for testing and toggling live status.
 */
function AdminStatusToggle({ isLive, onToggle }) {
  const hasAdmin = Boolean(getAdminToken());
  const [isUpdating, setIsUpdating] = React.useState(false);

  // Only render if an admin session token is found
  if (!hasAdmin) return null;

  const handleToggle = async () => {
    if (isUpdating) return;
    setIsUpdating(true);
    try {
      await onToggle();
    } catch (err) {
      alert('Failed to toggle marathon status: ' + err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-[999999] flex items-center gap-2 bg-[#07162D] border border-orange-500/40 text-white px-3 py-2 rounded-full shadow-2xl backdrop-blur-md text-xs font-mono">
      <span className="flex items-center gap-1.5">
        <span
          className={`w-2.5 h-2.5 rounded-full ${
            isLive ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
          }`}
        />
        <span className="font-semibold text-slate-200">
          Marathon: <strong className={isLive ? 'text-emerald-400' : 'text-amber-300'}>{isLive ? 'LIVE' : 'COMING SOON'}</strong>
        </span>
      </span>
      <button
        type="button"
        onClick={handleToggle}
        disabled={isUpdating}
        className="ml-1 px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-[11px] border border-white/20 transition-all cursor-pointer disabled:opacity-50"
      >
        {isUpdating ? '...' : isLive ? 'Switch to Coming Soon' : 'Switch to Live'}
      </button>
    </div>
  );
}

export default MarathonSiteAccessGate;

