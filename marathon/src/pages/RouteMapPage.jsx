import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MarathonRouteMap } from '../components/MarathonRouteMap';
import {
  MapPin,
  Calendar,
  Award,
  ShieldCheck,
  ArrowRight,
  Navigation,
  HeartPulse,
  Droplet,
  Users,
  Flag,
  HelpCircle,
} from 'lucide-react';

export const RouteMapPage = () => {
  const { isUserAuthenticated, openAuthModal } = useAuth();
  const navigate = useNavigate();

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

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-200">
      {/* Hero Banner */}
      <section className="relative pt-8 pb-12 sm:pt-12 sm:pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-[var(--orange)]/10 via-[var(--bg-primary)] to-[var(--bg-primary)] border-b border-[var(--border-color)]">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb / Category Tag */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--cyan)]/15 border border-[var(--cyan)]/30 text-[var(--cyan)] text-xs font-black tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-[var(--cyan)] animate-pulse" />
              <span>Official 3.5KM Course Route • Adoni 2026</span>
            </div>
          </div>

          <div className="max-w-3xl">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black font-heading tracking-tight leading-tight text-[var(--text-primary)]">
              Anti-Drug Movement <span className="text-[var(--orange)]">Marathon Route Map</span>
            </h1>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base text-[var(--text-muted)] leading-relaxed font-medium">
              Explore the certified 3.5 kilometer marathon route weaving through Adoni's prominent landmarks.
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
              <p className="text-xl sm:text-2xl font-black text-[var(--text-primary)]">3.5 KM</p>
              <p className="text-[11px] text-[var(--text-muted)] font-medium">Certified Route</p>
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

