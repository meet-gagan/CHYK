import React, { useState, useEffect, useMemo } from 'react';
import {
  Flame,
  Calendar,
  Clock,
  MapPin,
  Award,
  Sparkles,
  ShieldCheck,
  Share2,
  Users,
  Compass,
} from 'lucide-react';

export const MarathonComingSoonPage = () => {
  const targetDate = '2026-12-20T06:00:00.000+05:30';

  const calculateTimeLeft = () => {
    const eventTime = Date.parse(targetDate);
    const difference = eventTime - new Date().getTime();

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    document.title = 'Coming Soon | Anti-Drug Movement Marathon Run 2026 - Adoni';
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatUnit = (num) => String(num).padStart(2, '0');

  // Random ambient glowing particle stars
  const particles = useMemo(() => {
    return Array.from({ length: 32 }, (_, i) => ({
      id: i,
      left: `${(Math.random() * 100).toFixed(1)}%`,
      top: `${(Math.random() * 85).toFixed(1)}%`,
      opacity: (0.2 + Math.random() * 0.6).toFixed(2),
      size: Math.random() > 0.8 ? 4 : 2,
    }));
  }, []);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Anti-Drug Movement Marathon Run 2026 • Coming Soon',
          text: 'Get ready for the biggest youth movement in Adoni! Anti-Drug Movement Marathon 2026 is coming soon.',
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (_) {}
  };

  return (
    <div className="min-h-screen w-full bg-[#07162D] text-white selection:bg-[#F0441D] selection:text-white relative overflow-hidden flex flex-col justify-between font-sans">
      {/* Background Animated Gradient Glows */}
      <div className="absolute top-[-15%] left-[20%] w-[500px] h-[500px] bg-[#F0441D]/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[10%] w-[550px] h-[550px] bg-[#06B6D4]/15 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-[40%] left-[-10%] w-[400px] h-[400px] bg-[#FFD12D]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Ambient Particle Sparks */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {particles.map((p) => (
          <span
            key={p.id}
            className="absolute rounded-full bg-[#FFD12D] animate-pulse"
            style={{
              left: p.left,
              top: p.top,
              opacity: p.opacity,
              width: `${p.size}px`,
              height: `${p.size}px`,
            }}
          />
        ))}
      </div>

      {/* Top Header / Brand Bar */}
      <header className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white/10 border border-white/20 p-2 flex items-center justify-center backdrop-blur-md shadow-lg">
            <Flame className="w-6 h-6 text-[#F0441D]" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#F0441D] block">
              CHINMAYA MISSION & CHYK
            </span>
            <span className="text-xs sm:text-sm font-extrabold text-white block">
              ADONI, ANDHRA PRADESH
            </span>
          </div>
        </div>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white transition-all cursor-pointer shadow-md"
        >
          <Share2 className="w-3.5 h-3.5 text-[#F0441D]" />
          <span>{copied ? 'Link Copied!' : 'Share'}</span>
        </button>
      </header>

      {/* Main Coming Soon Hero Content */}
      <main className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16 text-center space-y-8 my-auto">
        {/* Campaign Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F0441D]/20 border border-[#F0441D]/40 text-[#F0441D] text-xs font-black tracking-widest uppercase shadow-lg">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>WE RISE • WE RUN • WE RESIST</span>
        </div>

        {/* Big Typography Headings */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black font-heading tracking-tight leading-[1.1] text-white">
            ANTI-DRUG MOVEMENT <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F0441D] via-[#FFD12D] to-[#06B6D4]">
              MARATHON RUN 2026
            </span>
          </h1>

          <p className="text-base sm:text-xl font-bold text-[#F6D9BA] max-w-2xl mx-auto pt-2">
            Something powerful is brewing in Adoni. The road is being prepared and registrations are opening soon.
          </p>
        </div>

        {/* Live Countdown Clock */}
        <div className="max-w-xl mx-auto p-4 sm:p-6 rounded-3xl bg-white/5 border border-white/15 backdrop-blur-xl shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3 text-xs font-extrabold uppercase tracking-wider text-slate-300">
            <span className="flex items-center gap-1.5 text-[#06B6D4]">
              <Calendar className="w-4 h-4" />
              <span>Sunday, 20 Dec 2026</span>
            </span>
            <span className="flex items-center gap-1.5 text-[#FFD12D]">
              <Clock className="w-4 h-4" />
              <span>6:00 AM Flag-off</span>
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2 sm:gap-4">
            {[
              { label: 'Days', val: timeLeft.days, color: 'text-[#F0441D]' },
              { label: 'Hours', val: timeLeft.hours, color: 'text-[#FFD12D]' },
              { label: 'Minutes', val: timeLeft.minutes, color: 'text-[#06B6D4]' },
              { label: 'Seconds', val: timeLeft.seconds, color: 'text-emerald-400' },
            ].map((unit) => (
              <div
                key={unit.label}
                className="p-3 sm:p-4 rounded-2xl bg-black/40 border border-white/10 flex flex-col items-center justify-center shadow-inner"
              >
                <span className={`text-2xl sm:text-4xl font-black font-mono leading-none ${unit.color}`}>
                  {formatUnit(unit.val)}
                </span>
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 mt-1">
                  {unit.label}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2 flex items-center justify-center gap-2 text-xs font-semibold text-slate-300">
            <MapPin className="w-4 h-4 text-[#F0441D]" />
            <span>Starting from Municipal High School to Chinmaya Mission, Adoni</span>
          </div>
        </div>

        {/* 4 Feature Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto pt-2">
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-left">
            <Compass className="w-4 h-4 text-[#06B6D4] mb-1.5" />
            <h4 className="text-xs font-extrabold text-white">7KM Course</h4>
            <p className="text-[11px] text-slate-400">Certified city loop</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-left">
            <Award className="w-4 h-4 text-[#FFD12D] mb-1.5" />
            <h4 className="text-xs font-extrabold text-white">Finisher Medals</h4>
            <p className="text-[11px] text-slate-400">& official certificates</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-left">
            <Users className="w-4 h-4 text-[#F0441D] mb-1.5" />
            <h4 className="text-xs font-extrabold text-white">Youth Movement</h4>
            <p className="text-[11px] text-slate-400">Schools & colleges united</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-left">
            <ShieldCheck className="w-4 h-4 text-emerald-400 mb-1.5" />
            <h4 className="text-xs font-extrabold text-white">Safe & Supported</h4>
            <p className="text-[11px] text-slate-400">Hydration & ambulances</p>
          </div>
        </div>

        {/* WhatsApp & Community Links */}
        <div className="pt-2">
          <p className="text-xs font-bold text-slate-400 mb-3">
            Stay updated with official route announcements and early-bird pass notifications:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://chat.whatsapp.com/Hd0DpUk36qSGIQ6UTULvke?mode=hq2tcli"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-full bg-[#25D366] text-white text-xs font-extrabold shadow-lg hover:bg-[#20ba59] transition-all flex items-center gap-2 text-decoration-none"
            >
              <span>Join WhatsApp Community</span>
            </a>
            <a
              href="https://www.instagram.com/chinmayamission_adoni?srtk=ZDNlZDc0MzIxNw=="
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-extrabold transition-all flex items-center gap-2 text-decoration-none"
            >
              <span>Follow on Instagram</span>
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full py-5 text-center text-xs text-slate-400 border-t border-white/10">
        <p>
          An initiative by <strong>Chinmaya Mission, Adoni</strong> & <strong>Chinmaya Yuva Kendra, Adoni</strong>
        </p>
        <p className="text-[11px] text-slate-500 mt-0.5">
          © 2026 Anti-Drug Movement Marathon. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default MarathonComingSoonPage;

