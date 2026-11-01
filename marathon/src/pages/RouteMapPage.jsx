import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MarathonRouteMap } from '../components/MarathonRouteMap';
import {
  MapPin,
  Calendar,
  Clock,
  Award,
  ShieldCheck,
  ArrowRight,
  Share2,
  Navigation,
  HeartPulse,
  Droplet,
  Compass,
  CheckCircle2,
  Users,
  Flag,
  HelpCircle,
} from 'lucide-react';

export const RouteMapPage = () => {
  const { isUserAuthenticated, openAuthModal } = useAuth();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    document.title = 'Official Marathon Route Map | Anti-Drug Run Adoni 2026';
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  const handleRegisterClick = () => {
    if (!isUserAuthenticated) {
      openAuthModal('signup', '/register');
    } else {
      navigate('/register');
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Anti-Drug Movement Marathon 2026 - Route Map',
          text: 'Check out the official 7KM Route Map for the Anti-Drug Movement Marathon in Adoni on 20 December 2026!',
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch (_) {}
  };

  const checkpointsList = [
    {
      num: '1',
      title: 'Municipal High School (START)',
      km: '0.0 KM',
      type: 'Flag-off Point',
      color: 'bg-emerald-500',
      desc: 'Participant assembly, warm-up stretching, bib distribution check, and official flag-off ceremony at 6:00 AM.',
    },
    {
      num: '2',
      title: 'Gosha Hospital (Govt. Hospital Adoni)',
      km: 'Course Waypoint',
      type: 'Hydration & Aid Station',
      color: 'bg-cyan-500',
      desc: 'Dedicated hydration station with electrolytes, fresh water bottles, first-aid medical support, and volunteer cheer station.',
    },
    {
      num: '3',
      title: 'Chinmaya Mission, Adoni (FINISH ARCH)',
      km: 'Finish Point',
      type: 'Finish & Celebration',
      color: 'bg-orange-500',
      desc: 'Grand finish line arch, official finisher medal distribution, participant certificates, and nutritious breakfast.',
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-200">
      {/* Hero Banner */}
      <section className="relative pt-8 pb-12 sm:pt-12 sm:pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-[var(--orange)]/10 via-[var(--bg-primary)] to-[var(--bg-primary)] border-b border-[var(--border-color)]">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb / Category Tag */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--cyan)]/15 border border-[var(--cyan)]/30 text-[var(--cyan)] text-xs font-black tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-[var(--cyan)] animate-pulse" />
              <span>Official 7KM Course Route • Adoni 2026</span>
            </div>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-[var(--orange)] text-xs font-bold text-[var(--text-primary)] transition-all cursor-pointer shadow-sm"
              title="Share Route Map"
            >
              <Share2 className="w-3.5 h-3.5 text-[var(--orange)]" />
              <span>{copied ? 'Link Copied!' : 'Share Route'}</span>
            </button>
          </div>

          <div className="max-w-3xl">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black font-heading tracking-tight leading-tight text-[var(--text-primary)]">
              Anti-Drug Movement <span className="text-[var(--orange)]">Marathon Route Map</span>
            </h1>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base text-[var(--text-muted)] leading-relaxed font-medium">
              Explore the certified 7 kilometer marathon route weaving through Adoni's prominent landmarks.
              Beginning from <strong>Municipal High School Grounds</strong> and triumphantly finishing at{' '}
              <strong>Chinmaya Mission Complex</strong>. Publicly accessible to all participants and families!
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 sm:mt-8">
            <div className="p-3.5 sm:p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] shadow-sm">
              <div className="flex items-center gap-2 text-xs font-extrabold text-[var(--orange)] uppercase tracking-wider mb-1">
                <Navigation className="w-4 h-4 shrink-0" />
                <span>Distance</span>
              </div>
              <p className="text-xl sm:text-2xl font-black text-[var(--text-primary)]">7.0 KM</p>
              <p className="text-[11px] text-[var(--text-muted)] font-medium">Certified City Loop</p>
            </div>

            <div className="p-3.5 sm:p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] shadow-sm">
              <div className="flex items-center gap-2 text-xs font-extrabold text-[var(--cyan)] uppercase tracking-wider mb-1">
                <Calendar className="w-4 h-4 shrink-0" />
                <span>Event Date</span>
              </div>
              <p className="text-sm sm:text-base font-black text-[var(--text-primary)] leading-tight">Sun, 20 Dec 2026</p>
              <p className="text-[11px] text-[var(--text-muted)] font-medium">Flag-off at 6:00 AM</p>
            </div>

            <div className="p-3.5 sm:p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] shadow-sm">
              <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-500 uppercase tracking-wider mb-1">
                <Flag className="w-4 h-4 shrink-0" />
                <span>Start Point</span>
              </div>
              <p className="text-sm sm:text-base font-black text-[var(--text-primary)] leading-tight truncate">Municipal School</p>
              <p className="text-[11px] text-[var(--text-muted)] font-medium">Reporting: 5:30 AM</p>
            </div>

            <div className="p-3.5 sm:p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] shadow-sm">
              <div className="flex items-center gap-2 text-xs font-extrabold text-purple-500 uppercase tracking-wider mb-1">
                <MapPin className="w-4 h-4 shrink-0" />
                <span>Finish Point</span>
              </div>
              <p className="text-sm sm:text-base font-black text-[var(--text-primary)] leading-tight truncate">Chinmaya Mission</p>
              <p className="text-[11px] text-[var(--text-muted)] font-medium">Medals & Breakfast</p>
            </div>
          </div>

          {/* Quick Actions Bar */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-6">
            <a
              href="https://maps.app.goo.gl/aBVcfaNbbFJTNvmX9?g_st=aw"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary py-3 px-6 sm:px-8 text-xs sm:text-sm font-extrabold shadow-lg hover:shadow-xl flex items-center gap-2 cursor-pointer transition-transform hover:scale-[1.02] text-decoration-none"
            >
              <Navigation className="w-4 h-4" />
              <span>OPEN IN GOOGLE MAPS</span>
            </a>

            <button
              onClick={handleRegisterClick}
              className="py-3 px-5 sm:px-6 text-xs sm:text-sm font-extrabold rounded-2xl bg-[var(--cyan)] hover:bg-[var(--cyan)]/80 text-slate-950 flex items-center gap-2 cursor-pointer transition-transform hover:scale-[1.02] shadow-md border-0"
            >
              <Award className="w-4 h-4" />
              <span>REGISTER NOW</span>
            </button>

            <Link
              to="/faqs"
              className="btn-secondary py-3 px-5 sm:px-6 text-xs sm:text-sm font-bold text-decoration-none bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-[var(--orange)] transition-colors flex items-center gap-2"
            >
              <HelpCircle className="w-4 h-4 text-[var(--text-muted)]" />
              <span>FAQs</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Interactive Map Section */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
        <div className="space-y-4">
          <MarathonRouteMap className="w-full" />
        </div>

        {/* Course Highlights & Checkpoints Breakdown */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-color)] pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black font-heading text-[var(--text-primary)]">
                Route Checkpoints & Aid Stations
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
                Comprehensive guide to all official stations, hydration booths, and medical posts along the 7KM loop.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[var(--text-muted)]">7 Stations Active</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {checkpointsList.map((cp) => (
              <div
                key={cp.num}
                className="p-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] shadow-sm hover:border-[var(--orange)]/40 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-muted)]">
                      Station #{cp.num}
                    </span>
                    <span className="text-xs font-extrabold text-[var(--orange)] font-mono">
                      {cp.km}
                    </span>
                  </div>

                  <h3 className="text-base font-black text-[var(--text-primary)] leading-snug">
                    {cp.title}
                  </h3>
                  <span className="inline-block mt-1 text-[11px] font-bold text-[var(--cyan)]">
                    {cp.type}
                  </span>
                  <p className="mt-2 text-xs text-[var(--text-muted)] leading-relaxed">
                    {cp.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Medical & Participant Safety Guarantees */}
        <section className="p-6 sm:p-8 rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-color)] shadow-sm">
          <h2 className="text-lg sm:text-xl font-black font-heading text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <span>Runner Safety & Support Along The Route</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[var(--bg-tertiary)]/50 border border-[var(--border-color)]">
              <Droplet className="w-5 h-5 text-cyan-500 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-[var(--text-primary)] font-bold mb-0.5">Continuous Hydration</strong>
                <p className="text-[var(--text-muted)] leading-relaxed">
                  Drinking water bottles and electrolytes provided at every 1.5 KM along with waste bins.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[var(--bg-tertiary)]/50 border border-[var(--border-color)]">
              <HeartPulse className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-[var(--text-primary)] font-bold mb-0.5">Dedicated Ambulances</strong>
                <p className="text-[var(--text-muted)] leading-relaxed">
                  Two medical response ambulances with certified first-aid paramedics following the runner pack.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[var(--bg-tertiary)]/50 border border-[var(--border-color)]">
              <Users className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-[var(--text-primary)] font-bold mb-0.5">100+ Route Marshals</strong>
                <p className="text-[var(--text-muted)] leading-relaxed">
                  Dedicated CYK volunteers and Adoni police officers ensuring zero-traffic running lanes.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA Card */}
        <section className="relative p-6 sm:p-10 rounded-3xl bg-gradient-to-r from-[var(--orange)]/15 via-[var(--bg-secondary)] to-[var(--cyan)]/15 border border-[var(--border-color)] shadow-xl overflow-hidden text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[var(--orange)]/20 text-[var(--orange)] mb-2">
              <Award className="w-3.5 h-3.5" />
              <span>Finisher Medal & Certificate Guaranteed</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-black font-heading text-[var(--text-primary)]">
              Ready to Run with Adoni's Youth?
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1.5 leading-relaxed">
              Register now individually or with your school/college peers. Stand united against drugs and make your mark!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
            <button
              onClick={handleRegisterClick}
              className="btn-primary w-full sm:w-auto py-3.5 px-7 text-xs sm:text-sm font-extrabold shadow-lg hover:shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-105"
            >
              <Award className="w-4 h-4" />
              <span>REGISTER NOW</span>
            </button>
            <Link
              to="/"
              className="btn-secondary w-full sm:w-auto py-3.5 px-6 text-xs sm:text-sm font-bold text-decoration-none bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-[var(--orange)] flex items-center justify-center gap-2"
            >
              <span>Back to Home</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default RouteMapPage;

