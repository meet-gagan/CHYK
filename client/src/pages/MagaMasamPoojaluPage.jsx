import React, { useState, useEffect } from 'react';
import {
  Flame,
  BookOpen,
  Heart,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { UnifiedBookingModal, POOJA_SERVICES } from '../components/TempleSevaSection';

export const MagaMasamPoojaluPage = () => {
  const [activeBookingService, setActiveBookingService] = useState(null);

  useEffect(() => {
    document.title = 'Maga Masam Poojalu – Sri Rudram | Chinmaya Mission';
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  // Retrieve Magha Masam Poojalu service definition from POOJA_SERVICES or fallback
  const maghaMasamService =
    POOJA_SERVICES.find((p) => p.id === 'maha-shivaratri') || {
      id: 'maha-shivaratri',
      name: 'Magha Masam Poojalu',
      desc: 'Auspicious Magha Masam Poojalu & Abhishekams (30 Days)',
      icon: '✶',
      pujaType: 'maha_shivaratri',
      isSpecial: true,
      options: [
        { name: 'Daily Sankalpa Rudrabhisheka Puja (30 Days)', price: 1221 },
        {
          name: 'Shiva Parvati Kalyana Seva + Daily Sankalpa Rudrabhisheka Puja (30 Days)',
          price: 10008,
        },
        {
          name: 'Shiva Parvati Kalyana Seva + Anna Prasada Seva + Daily Sankalpa Rudrabhisheka Puja (30 Days)',
          price: 15116,
        },
      ],
    };

  return (
    <div className="min-h-screen bg-white text-slate-800">
      {/* 1. SRI RUDRAM DISCOURSE & EXPERIENCE CONTENT */}
      <section className="pt-10 sm:pt-14 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 bg-[#FAFAFA]">
        <div className="max-w-4xl mx-auto space-y-10">
          {/* Main Title & Subtitle */}
          <div className="text-center space-y-3">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-heading text-slate-900 tracking-tight">
              Sri Rudram – The Divine Glory of Lord Shiva
            </h1>
            <p className="text-base sm:text-lg text-slate-600 font-medium font-serif italic">
              Experience the Divine Power of Vedic Chanting
            </p>
            <div className="w-16 h-1 bg-[var(--orange)] rounded-full mx-auto mt-2" />
          </div>

          {/* Core Content Body */}
          <div className="space-y-6 text-sm sm:text-base text-slate-700 leading-relaxed font-normal bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/90 shadow-sm">
            <p className="first-letter:text-4xl first-letter:font-bold first-letter:text-[var(--orange)] first-letter:mr-1.5 first-letter:float-left">
              Sri Rudram is one of the most sacred and powerful Vedic prayers dedicated to Lord Shiva. It is found in the Krishna Yajurveda and consists of two important parts: Namakam and Chamakam. Together, they contain 11 Anuvakams and 169 mantras.
            </p>

            <p>
              Sri Rudram glorifies the divine forms and qualities of Lord Shiva. It is also known as Shatarudriyam and includes the sacred Panchakshari Mantra, <strong className="text-slate-900 font-semibold font-serif">"Om Namah Shivaya."</strong>
            </p>

            <p>
              Chanting Sri Rudram with devotion is believed to bring peace, good health, prosperity, happiness, and spiritual growth. It is traditionally recited during poojas, Japa, and Homams. It is also chanted during Rudrabhishekam to seek the divine blessings of Lord Shiva.
            </p>

            <p>
              The chanting of Sri Rudram is considered highly auspicious and is believed to remove negative influences, bring positive energy, and promote the well-being of individuals and the community.
            </p>

            {/* Sacred Devotional Callout */}
            <div className="mt-8 p-6 sm:p-7 rounded-2xl bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 border border-orange-200 text-center space-y-2.5 shadow-sm">
              <span className="text-2xl sm:text-3xl font-serif text-[var(--orange)] font-bold block">
                ॥ ॐ नमः शिवाय ॥
              </span>
              <p className="text-sm sm:text-base font-bold text-slate-900 leading-relaxed font-serif">
                "Let us chant Sri Rudram with devotion and seek the divine blessings of Lord Shiva for peace, prosperity, and well-being."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SPIRITUAL HIGHLIGHTS PILLARS */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-100 bg-[#FAFAFA]">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-900">
              Significance of Magha Masam Worship
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              The cosmic vibrations of Sri Rudram bless all beings with lasting tranquility and spiritual grace
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm text-left space-y-2.5 hover:shadow-md hover:border-orange-200 transition-all">
              <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-[var(--orange)]">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">Namakam &amp; Chamakam</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Contains 11 Anuvakams and 169 sacred mantras from Krishna Yajurveda.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm text-left space-y-2.5 hover:shadow-md hover:border-orange-200 transition-all">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                <Flame className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">Panchakshari Mantra</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Houses the primordial sound "Om Namah Shivaya" for profound inner peace.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm text-left space-y-2.5 hover:shadow-md hover:border-orange-200 transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">Negative Removal</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Removes negative influences, dispels karmic obstacles, and ushers in positive vibrations.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm text-left space-y-2.5 hover:shadow-md hover:border-orange-200 transition-all">
              <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">Health &amp; Prosperity</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Brings good health, familial harmony, prosperity, and spiritual evolution.
              </p>
            </div>
          </div>

          {/* Bottom CTA to Book */}
          <div className="pt-6 text-center">
            <button
              type="button"
              onClick={() => setActiveBookingService(maghaMasamService)}
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[var(--orange)] to-amber-600 hover:from-amber-600 hover:to-[var(--orange)] text-white text-sm font-bold uppercase tracking-wider shadow-lg shadow-orange-600/25 transition-all duration-300 inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Book Magha Masam Seva</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 3. BOOKING MODAL */}
      {activeBookingService && (
        <UnifiedBookingModal
          service={activeBookingService}
          onClose={() => setActiveBookingService(null)}
          onBookingSuccess={() => {
            // Optional callback
          }}
        />
      )}
    </div>
  );
};

export default MagaMasamPoojaluPage;
