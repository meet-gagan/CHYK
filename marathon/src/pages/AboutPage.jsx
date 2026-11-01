import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Award,
  ShieldCheck,
  Flame,
  Target,
  HeartHandshake,
  Users,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Activity,
  Flag,
  Globe2,
  Building,
} from 'lucide-react';

export const AboutPage = () => {
  const { isUserAuthenticated, openAuthModal } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'About The Marathon | Run For Life. Stand Against Drugs.';
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  const handleRegisterClick = () => {
    if (!isUserAuthenticated) {
      openAuthModal('signup', '/register');
    } else {
      navigate('/register');
    }
  };

  const reasons = [
    {
      number: '01',
      title: 'To Raise Awareness',
      description:
        'To educate people about the harmful effects of substance abuse and break the silence surrounding addiction.',
      accent: 'border-orange-500/20 bg-orange-500/5 text-[var(--orange)]',
      badgeBg: 'bg-[var(--orange)] text-white',
    },
    {
      number: '02',
      title: 'To Inspire the Youth',
      description:
        'To encourage young minds to choose discipline, confidence, fitness and a meaningful life over substance abuse.',
      accent: 'border-blue-500/20 bg-blue-500/5 text-blue-600',
      badgeBg: 'bg-blue-600 text-white',
    },
    {
      number: '03',
      title: 'To Stand Against Drug Abuse',
      description:
        'To send a strong message that drugs have no place in our homes, communities or future.',
      accent: 'border-red-500/20 bg-red-500/5 text-red-600',
      badgeBg: 'bg-red-600 text-white',
    },
    {
      number: '04',
      title: 'To Support Those Affected',
      description:
        'To show compassion towards individuals and families affected by addiction and encourage awareness, prevention and access to support.',
      accent: 'border-emerald-500/20 bg-emerald-500/5 text-emerald-600',
      badgeBg: 'bg-emerald-600 text-white',
    },
    {
      number: '05',
      title: 'To Build a Drug-Free Society',
      description:
        'To bring communities together and inspire collective responsibility towards a healthier and safer India.',
      accent: 'border-purple-500/20 bg-purple-500/5 text-purple-600',
      badgeBg: 'bg-purple-600 text-white',
    },
  ];

  const visionPoints = [
    'Every individual understands the harmful consequences of drug abuse.',
    'Young people make informed and healthy life choices.',
    'Families and communities actively support prevention and awareness.',
    'Youth become leaders and ambassadors of a drug-free India.',
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary,#FFFDF9)] text-[var(--text-primary,#0B2340)] transition-colors duration-200">
      
      {/* ======================================================== */}
      {/* HERO SECTION */}
      {/* ======================================================== */}
      <section className="relative pt-10 pb-14 sm:pt-16 sm:pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-[var(--orange,#FF6600)]/10 via-[var(--bg-primary)] to-[var(--bg-primary)] border-b border-[var(--border-color,#E5E7EB)]">
        <div className="max-w-5xl mx-auto text-center space-y-4 sm:space-y-6">
          
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--orange)]/15 border border-[var(--orange)]/30 text-[var(--orange)] text-xs font-black uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5 animate-pulse" />
            <span>RUN FOR LIFE. STAND AGAINST DRUGS.</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-heading tracking-tight text-[var(--text-primary)]">
            ABOUT THE MARATHON
          </h1>

          <div className="inline-block px-4 py-1.5 rounded-xl bg-slate-900 text-white text-xs sm:text-sm font-black uppercase tracking-widest shadow-sm">
            WE RISE. WE RUN. WE RESIST.
          </div>

          <p className="max-w-3xl mx-auto text-base sm:text-lg lg:text-xl text-[var(--text-muted,#64748B)] font-medium leading-relaxed">
            Every step we take can make a difference. Every voice we raise can inspire change.
            And every young person who chooses a healthy life brings us one step closer to a drug-free society.
          </p>
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12 sm:space-y-16">
        
        {/* ======================================================== */}
        {/* SECTION 1: INTRODUCTION & 3 PILLARS */}
        {/* ======================================================== */}
        <section className="p-6 sm:p-10 rounded-3xl bg-white border border-[var(--border-color,#E5E7EB)] shadow-sm space-y-6">
          <div className="space-y-4 text-sm sm:text-base leading-relaxed text-[var(--text-muted,#64748B)]">
            <p>
              <strong className="text-[var(--text-primary)] font-bold">Run for Life. Stand Against Drugs.</strong> is
              an anti-drug awareness marathon organised by{' '}
              <strong className="text-[var(--text-primary)] font-bold">Chinmaya Yuva Kendra (CHYK), Adoni</strong>,
              with the vision of creating awareness about the harmful effects of substance abuse and inspiring individuals,
              especially youth, to choose a life of health, purpose and responsibility.
            </p>
            <p>
              This marathon is more than a sporting event; it is a movement of courage, awareness and collective responsibility.
            </p>
          </div>

          {/* 3 Pillars: We Rise, We Run, We Resist */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-5 rounded-2xl bg-[var(--orange)]/5 border border-[var(--orange)]/25 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[var(--orange)]/15 text-[var(--orange)] flex items-center justify-center font-black mb-3">
                  <Flame className="w-5 h-5" />
                </div>
                <h3 className="text-base font-black font-heading text-[var(--text-primary)] mb-1">
                  We Rise
                </h3>
                <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed font-medium">
                  To stand against substance abuse and inspire positive change.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-cyan-500/5 border border-cyan-500/25 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-cyan-500/15 text-cyan-600 flex items-center justify-center font-black mb-3">
                  <Activity className="w-5 h-5" />
                </div>
                <h3 className="text-base font-black font-heading text-[var(--text-primary)] mb-1">
                  We Run
                </h3>
                <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed font-medium">
                  To spread awareness and promote healthy living.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-purple-500/5 border border-purple-500/25 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-600 flex items-center justify-center font-black mb-3">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-base font-black font-heading text-[var(--text-primary)] mb-1">
                  We Resist
                </h3>
                <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed font-medium">
                  The influence of drugs and stand united for a better tomorrow.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-primary,#FFFDF9)] border border-[var(--border-color,#E5E7EB)]">
            <p className="text-xs sm:text-sm text-[var(--text-muted)] font-medium leading-relaxed">
              Bringing together people from all walks of life, this initiative aims to transform awareness into action
              and encourage everyone to take responsibility for building a healthier, stronger and drug-free India.
            </p>
          </div>
        </section>

        {/* ======================================================== */}
        {/* SECTION 2: A COLLECTIVE MISSION */}
        {/* ======================================================== */}
        <section className="p-6 sm:p-10 rounded-3xl bg-white border border-[var(--border-color,#E5E7EB)] shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-600 flex items-center justify-center font-black shrink-0">
              <Globe2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-emerald-600 block">
                National Alignment
              </span>
              <h2 className="text-xl sm:text-2xl font-black font-heading text-[var(--text-primary)]">
                A COLLECTIVE MISSION
              </h2>
            </div>
          </div>

          <div className="space-y-4 text-sm sm:text-base leading-relaxed text-[var(--text-muted)]">
            <p>
              This initiative is part of a collective effort to strengthen the movement towards a drug-free India.
              Organised by <strong className="text-[var(--text-primary)]">Chinmaya Yuva Kendra (CHYK), Adoni</strong>, in
              association with <strong className="text-[var(--text-primary)]">All India Chinmaya Yuva Kendra (AICHYK)</strong>,
              the marathon aligns with the vision of the{' '}
              <strong className="text-[var(--text-primary)]">
                Ministry of Social Justice and Empowerment, Government of India
              </strong>
              , under the national campaign <strong className="text-[var(--orange)]">Nasha Mukt Bharat Abhiyaan</strong>.
            </p>
            <p>
              It also resonates with the ongoing efforts of the Government of Andhra Pradesh towards preventing drug abuse,
              strengthening public awareness and building a drug-free state.
            </p>
            <p>
              Through this initiative, we aim to contribute to the nationwide mission of combating substance abuse by
              empowering youth, spreading awareness and encouraging communities to take an active stand against drug abuse.
            </p>
          </div>

          <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-[var(--bg-primary)] to-transparent border-l-4 border-emerald-500">
            <p className="text-sm sm:text-base font-black text-[var(--text-primary)] italic">
              “Together, we believe that an aware and empowered youth is the foundation of a drug-free nation.”
            </p>
          </div>
        </section>

        {/* ======================================================== */}
        {/* SECTION 3: OUR VISION */}
        {/* ======================================================== */}
        <section className="p-6 sm:p-10 rounded-3xl bg-white border border-[var(--border-color,#E5E7EB)] shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-600 flex items-center justify-center font-black shrink-0">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-purple-600 block">
                Guiding Horizon
              </span>
              <h2 className="text-xl sm:text-2xl font-black font-heading text-[var(--text-primary)]">
                OUR VISION
              </h2>
            </div>
          </div>

          <p className="text-base sm:text-lg font-bold text-[var(--text-primary)] leading-relaxed">
            To inspire a generation that is aware, responsible and committed to living free from substance abuse.
          </p>

          <div className="space-y-3 pt-2">
            <p className="text-xs sm:text-sm font-black uppercase tracking-wider text-[var(--text-muted)]">
              We envision a society where:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {visionPoints.map((point, index) => (
                <div
                  key={index}
                  className="p-4 rounded-2xl bg-[var(--bg-primary,#FFFDF9)] border border-[var(--border-color,#E5E7EB)] flex items-start gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm font-semibold text-[var(--text-primary)] leading-relaxed">
                    {point}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* SECTION 4: WHY RUN? & PURPOSE */}
        {/* ======================================================== */}
        <section className="p-6 sm:p-10 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 text-white shadow-xl space-y-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-400 text-xs font-black tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>EVERY STEP HAS A PURPOSE</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black font-heading text-white">
              WHY RUN?
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-medium">
              We don't run just to reach a finish line. We run to make a statement. We run to raise awareness.
              We run because the future of our youth matters.
            </p>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Drug abuse affects not just individuals but families, friendships, communities and the future of our nation.
              By participating in this marathon, you become part of a larger movement that refuses to remain silent.
            </p>
          </div>

          {/* WE RUN FOR A REASON: 5 CARDS */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2">
              <Flag className="w-4 h-4 text-orange-400" />
              <h3 className="text-sm sm:text-base font-black uppercase tracking-wider text-orange-400">
                WE RUN FOR A REASON
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reasons.map((reason) => (
                <div
                  key={reason.number}
                  className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between gap-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-orange-500 text-white">
                      {reason.number}
                    </span>
                    <HeartHandshake className="w-4 h-4 text-slate-400" />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-white mb-1">
                      {reason.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                      {reason.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* SECTION 5: MORE THAN A MARATHON. A MOVEMENT. */}
        {/* ======================================================== */}
        <section className="p-6 sm:p-10 rounded-3xl bg-white border border-[var(--border-color,#E5E7EB)] shadow-sm space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-orange-500/15 text-[var(--orange)] flex items-center justify-center font-black shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black font-heading text-[var(--text-primary)]">
              MORE THAN A MARATHON. A MOVEMENT.
            </h2>
          </div>

          <div className="space-y-3 text-sm sm:text-base leading-relaxed text-[var(--text-muted)]">
            <p>
              Every participant carries a message. Every kilometre spreads awareness. Every stride represents a choice — a choice for health, strength and a better future.
            </p>
            <p>
              Whether you are a professional runner, a fitness enthusiast, a student or someone who simply believes in this cause, your participation matters.
            </p>
            <p className="font-bold text-[var(--text-primary)]">
              You don't have to be the fastest runner. You just have to be willing to take a stand.
            </p>
          </div>
        </section>

        {/* ======================================================== */}
        {/* SECTION 6: PLEDGE BANNER & CTA */}
        {/* ======================================================== */}
        <section className="relative p-6 sm:p-10 rounded-3xl bg-gradient-to-r from-[var(--orange)]/15 via-[var(--bg-secondary,#FFFBF5)] to-cyan-500/15 border border-[var(--border-color,#E5E7EB)] shadow-xl overflow-hidden text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="max-w-xl space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[var(--orange)]/20 text-[var(--orange)]">
              <Award className="w-3.5 h-3.5" />
              <span>Official Awareness Initiative</span>
            </div>

            <h2 className="text-xl sm:text-3xl font-black font-heading text-[var(--text-primary)]">
              TAKE THE PLEDGE. TAKE THE STEP.
            </h2>

            <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
              Let us rise above addiction, run towards awareness and resist the influence of drugs.
              Join the movement. Inspire change. Be the voice of a drug-free generation.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-lg bg-slate-900 text-white text-[11px] font-black uppercase tracking-wider">
                WE RISE. WE RUN. WE RESIST.
              </span>
              <span className="px-3 py-1 rounded-lg bg-[var(--orange)] text-white text-[11px] font-black uppercase tracking-wider">
                RUN FOR LIFE. STAND AGAINST DRUGS.
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
            <button
              onClick={handleRegisterClick}
              className="btn-primary w-full sm:w-auto py-3.5 px-7 text-xs sm:text-sm font-extrabold shadow-lg hover:shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-105 whitespace-nowrap"
            >
              <Award className="w-4 h-4 shrink-0" />
              <span>REGISTER FOR MARATHON</span>
            </button>
            <Link
              to="/route-map"
              className="btn-secondary w-full sm:w-auto py-3.5 px-6 text-xs sm:text-sm font-bold text-decoration-none bg-white border border-[var(--border-color)] hover:border-[var(--orange)] flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <span>Explore Route</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AboutPage;

