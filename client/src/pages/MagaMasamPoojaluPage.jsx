import React, { useState, useEffect } from 'react';
import {
  Flame,
  BookOpen,
  Heart,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Sun,
  Globe,
  CheckCircle2,
  Shield,
  Award,
} from 'lucide-react';
import { UnifiedBookingModal, POOJA_SERVICES } from '../components/TempleSevaSection';

export const MagaMasamPoojaluPage = () => {
  const [activeBookingService, setActiveBookingService] = useState(null);

  useEffect(() => {
    document.title = 'Magha Masa Shiva Puja – 30 Days of Sri Rudra Parayanam | Chinmaya Mission';
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

  const handleOpenBooking = (optionName = null) => {
    if (optionName) {
      setActiveBookingService({
        ...maghaMasamService,
        selectedOptionName: optionName,
      });
    } else {
      setActiveBookingService(maghaMasamService);
    }
  };

  const prayers = [
    {
      title: 'Arogya',
      telugu: 'ఆరోగ్యం',
      desc: 'Health and well-being.',
      icon: <Sun className="w-5 h-5 text-amber-500" />,
      bg: 'bg-amber-50/70 border-amber-200/80',
    },
    {
      title: 'Shanti',
      telugu: 'శాంతి',
      desc: 'Peace and harmony in families and society.',
      icon: <Heart className="w-5 h-5 text-rose-500" />,
      bg: 'bg-rose-50/70 border-rose-200/80',
    },
    {
      title: 'Aishwarya',
      telugu: 'ఐశ్వర్యం',
      desc: 'Prosperity and auspiciousness.',
      icon: <Sparkles className="w-5 h-5 text-yellow-600" />,
      bg: 'bg-yellow-50/70 border-yellow-200/80',
    },
    {
      title: 'Jnana',
      telugu: 'జ్ఞానం',
      desc: 'Wisdom and spiritual enlightenment.',
      icon: <BookOpen className="w-5 h-5 text-sky-500" />,
      bg: 'bg-sky-50/70 border-sky-200/80',
    },
    {
      title: 'Kshema',
      telugu: 'క్షేమం',
      desc: 'Protection and overall well-being.',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-500" />,
      bg: 'bg-emerald-50/70 border-emerald-200/80',
    },
    {
      title: 'Lokakshema',
      telugu: 'లోకక్షేమం',
      desc: 'Peace and welfare of all beings.',
      icon: <Globe className="w-5 h-5 text-purple-500" />,
      bg: 'bg-purple-50/70 border-purple-200/80',
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-800">
      {/* 1. HERO / TITLE SECTION */}
      <section className="pt-12 sm:pt-16 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-amber-50/60 via-orange-50/20 to-white">
        <div className="max-w-4xl mx-auto space-y-6 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100/80 border border-orange-200 text-[var(--orange)] text-xs font-bold uppercase tracking-wider">
            <span>ॐ</span>
            <span>Chinmaya Mission, Adoni</span>
            <span>ॐ</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-heading text-slate-900 tracking-tight">
              MAGHA MASA SHIVA PUJA
            </h1>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold font-heading text-[var(--orange)] tracking-tight">
              30 Days of Sri Rudra Parayanam – Namakam &amp; Chamakam
            </h2>
            <h3 className="text-base sm:text-lg md:text-xl text-slate-600 font-medium font-serif italic pt-1">
              A Sacred Vedic Seva for the Well-being of All
            </h3>
            <div className="w-20 h-1 bg-[var(--orange)] rounded-full mx-auto mt-4" />
          </div>

          {/* Sacred Mantra Header Callout */}
          <div className="mt-6 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 border border-orange-200 text-center space-y-2 shadow-sm">
            <span className="text-2xl sm:text-3xl font-serif text-[var(--orange)] font-bold block tracking-wider">
              ॥ ॐ नमः शिवाय ॥
            </span>
            <p className="text-base sm:text-lg font-bold text-slate-900 font-serif">
              Om Namah Shivaya!
            </p>
          </div>
        </div>
      </section>

      {/* 2. SACRED TRADITION & SRI RUDRAM DISCOURSE */}
      <section className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-6 text-sm sm:text-base text-slate-700 leading-relaxed font-normal bg-[#FAFAFA] p-6 sm:p-10 rounded-3xl border border-slate-200/90 shadow-sm">
            <p className="first-letter:text-4xl first-letter:font-bold first-letter:text-[var(--orange)] first-letter:mr-2 first-letter:float-left">
              Magha Masam holds a special place in our Sanatana Dharma as an auspicious period for spiritual practices, worship, prayer, and devotion. It is an opportunity to turn our minds towards the Divine through sacred rituals, Vedic chanting, and selfless service.
            </p>

            <p className="bg-amber-50/60 p-4 sm:p-5 rounded-xl border-l-4 border-[var(--orange)] text-slate-900 font-medium">
              Continuing this sacred tradition, <strong>Chinmaya Mission, Adoni, conducts 30 days of special Shiva Pujas during Magha Masam, accompanied by the chanting of Sri Rudram – Namakam and Chamakam.</strong>
            </p>

            <p>
              Sri Rudram, an ancient and revered hymn from the Krishna Yajurveda, is dedicated to Lord Rudra, the Supreme Divine. Its profound Vedic mantras express our salutations, devotion, and surrender to the Divine, who pervades all creation.
            </p>

            {/* Namakam & Chamakam Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="bg-white p-5 rounded-2xl border border-orange-200/80 shadow-sm space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-orange-100/70 text-[var(--orange)] flex items-center justify-center font-bold font-serif">
                    नम
                  </div>
                  <h4 className="text-base font-bold text-slate-900">Namakam</h4>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Consists of sacred salutations to Lord Rudra in His infinite manifestations.
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-amber-200/80 shadow-sm space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-100/70 text-amber-700 flex items-center justify-center font-bold font-serif">
                    चम
                  </div>
                  <h4 className="text-base font-bold text-slate-900">Chamakam</h4>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  A prayer seeking divine blessings for the various aspects of a complete and harmonious life.
                </p>
              </div>
            </div>

            <p className="text-slate-800 font-medium pt-2">
              The chanting of these sacred Vedic mantras, together with the prescribed Shiva Puja, forms the spiritual heart of this 30 day observance.
            </p>
          </div>
        </div>
      </section>

      {/* 3. SANKALPAM FOR DEVOTEES AND THEIR FAMILIES */}
      <section className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 bg-[#FAFAFA] border-t border-slate-100">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900">
              Sankalpam for Devotees and Their Families
            </h2>
            <div className="w-16 h-1 bg-[var(--orange)] rounded-full mx-auto mt-1" />
          </div>

          <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/90 shadow-sm space-y-5 text-sm sm:text-base text-slate-700 leading-relaxed">
            <p>
              As part of this sacred observance, devotees are invited to participate by making an offering towards the Magha Masa Pujas.
            </p>

            <div className="p-5 rounded-2xl bg-gradient-to-r from-orange-50/80 via-amber-50/50 to-orange-50/80 border border-orange-200/90 space-y-2">
              <p className="text-slate-900 font-semibold leading-relaxed">
                The <em>names and Gotras of participating devotees</em> are included in the Sankalpam performed during the daily pujas.
              </p>
              <p className="text-xs sm:text-sm text-slate-700">
                Through these prayers and offerings, we seek the divine grace of Lord Shiva for the health, happiness, peace, prosperity, and spiritual well-being of the devotees and their families.
              </p>
            </div>

            <p className="text-slate-800">
              Devotees residing anywhere in India or abroad can participate in this sacred Seva by submitting their names and Gotras along with their contributions through this website.
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-700 bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Daily Sankalpa with Devotee Names &amp; Gotras</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-700 bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl">
                <Globe className="w-4 h-4 text-sky-600 shrink-0" />
                <span>Open for Devotees in India &amp; Worldwide</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-700 bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl">
                <ShieldCheck className="w-4 h-4 text-[var(--orange)] shrink-0" />
                <span>Vedic Rituals Conducted by Qualified Purohits</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PRAYERS FOR INDIVIDUAL AND UNIVERSAL WELL-BEING */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white border-t border-slate-100">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900">
              Prayers for Individual and Universal Well-being
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto">
              Through these 30 days of Sri Rudra Parayanam and Shiva Puja, we collectively pray for:
            </p>
            <div className="w-16 h-1 bg-[var(--orange)] rounded-full mx-auto mt-1" />
          </div>

          {/* 6 Blessing Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {prayers.map((prayer, idx) => (
              <div
                key={idx}
                className={`p-5 rounded-2xl border ${prayer.bg} shadow-sm space-y-2 transition-all hover:-translate-y-0.5 hover:shadow-md`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-xs">
                    {prayer.icon}
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500 font-serif">
                    {prayer.telugu}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">
                    <em>{prayer.title}:</em>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-700 mt-0.5 leading-relaxed">
                    {prayer.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/50 border border-amber-200/80 text-center">
            <p className="text-xs sm:text-sm font-medium text-slate-800 italic">
              Our prayers extend beyond individual aspirations, embracing the well-being of society and the entire universe.
            </p>
          </div>
        </div>
      </section>

      {/* 5. PARTICIPATE IN THIS SACRED VEDIC SEVA */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-[#FAFAFA] border-t border-slate-100">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900">
              Participate in This Sacred Vedic Seva
            </h2>
            <div className="w-16 h-1 bg-[var(--orange)] rounded-full mx-auto mt-1" />
          </div>

          <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/90 shadow-sm space-y-5 text-sm sm:text-base text-slate-700 leading-relaxed text-center sm:text-left">
            <p>
              Every offering made with Shraddha and Bhakti is a meaningful expression of devotion and gratitude to the Divine.
            </p>

            <p className="bg-orange-50/70 p-4 sm:p-5 rounded-2xl border-l-4 border-[var(--orange)] text-slate-900 font-medium">
              Your contribution is not merely a donation; <em>it is your participation in 30 days of sacred Vedic worship</em>, joining fellow devotees in a collective prayer at the divine feet of Lord Shiva.
            </p>

            <p>
              We warmly invite devotees, families, and well-wishers to be part of this annual Magha Masa Shiva Aradhana.
            </p>

            <p className="text-center font-bold text-slate-900 italic font-serif text-base sm:text-lg pt-1">
              Offer your Sankalpam. Participate in the Seva. Seek the blessings of Lord Shiva.
            </p>
          </div>

          {/* ========================================================= */}
          {/* 6. THE PAYMENT BOX (Here is the PAYMENT Box)              */}
          {/* ========================================================= */}
          <div
            id="payment-box"
            className="rounded-3xl bg-gradient-to-b from-amber-500/10 via-white to-amber-500/5 border-2 border-orange-300 p-6 sm:p-10 shadow-lg space-y-8 scroll-mt-20"
          >
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold uppercase tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-[var(--orange)]" />
                <span>Devotee Offering &amp; Sankalpam Portal</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black font-heading text-slate-900">
                Magha Masa Seva Offerings
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
                Choose a seva offering below. Devotee names and Gotras will be included in the daily Sankalpam performed during the 30-day worship.
              </p>
            </div>

            {/* Seva Options Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {maghaMasamService.options.map((opt, idx) => {
                const isSpecial = idx > 0;
                return (
                  <div
                    key={idx}
                    className={`bg-white rounded-2xl p-6 border flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative ${
                      idx === 0
                        ? 'border-orange-200 shadow-sm'
                        : idx === 1
                        ? 'border-amber-300 shadow-md ring-2 ring-amber-400/30'
                        : 'border-orange-300 shadow-md ring-2 ring-orange-500/20'
                    }`}
                  >
                    {isSpecial && (
                      <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-[var(--orange)] to-amber-600 text-white shadow-xs">
                        {idx === 1 ? 'Most Revered' : 'Maha Seva'}
                      </div>
                    )}

                    <div className="space-y-4">
                      <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-[var(--orange)] font-bold">
                        {idx === 0 ? 'ॐ' : idx === 1 ? '🔱' : '✶'}
                      </div>

                      <div className="space-y-1.5">
                        <h4 className="font-bold text-sm sm:text-base text-slate-900 leading-snug">
                          {opt.name}
                        </h4>
                        <p className="text-xs text-slate-500">
                          {idx === 0
                            ? 'Daily Sankalpam with your Name and Gotram for 30 consecutive days.'
                            : idx === 1
                            ? 'Special Shiva Parvati Kalyana Seva along with daily 30-day Sankalpam.'
                            : 'Complete Maha Seva with Kalyana Seva, Maha Anna Prasada Seva & 30-day Sankalpam.'}
                        </p>
                      </div>

                      <div className="pt-2">
                        <span className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
                          ₹{opt.price.toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs text-slate-500 block">per family offering</span>
                      </div>
                    </div>

                    <div className="pt-6">
                      <button
                        type="button"
                        onClick={() => handleOpenBooking(opt.name)}
                        className={`w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                          idx === 1
                            ? 'bg-gradient-to-r from-[var(--orange)] to-amber-600 hover:from-amber-600 hover:to-[var(--orange)] text-white shadow-md shadow-orange-500/25'
                            : 'bg-slate-900 hover:bg-slate-800 text-white'
                        }`}
                      >
                        <span>Participate • ₹{opt.price.toLocaleString('en-IN')}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Summary Banner inside Payment Box */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-left">
                <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="font-bold text-xs sm:text-sm text-slate-900">
                    Sankalpam Details &amp; Payment Verification
                  </h5>
                  <p className="text-[11px] sm:text-xs text-slate-600">
                    Submit Devotee Name, Gotram, Nakshatram and UPI reference via our secure booking portal.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleOpenBooking()}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-[var(--orange)] to-amber-600 hover:from-amber-600 hover:to-[var(--orange)] text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all cursor-pointer whitespace-nowrap"
              >
                Open Seva Booking Form
              </button>
            </div>
          </div>

          {/* 7. CLOSING BENEDICTION & UNIVERSAL PEACE */}
          <div className="space-y-6 pt-6">
            <p className="text-center text-sm sm:text-base text-slate-700 leading-relaxed max-w-2xl mx-auto italic font-medium">
              May the sacred vibrations of Sri Rudram bring peace to our minds, harmony to our families, strength to our communities, and welfare to the entire world.
            </p>

            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border border-orange-200 text-center space-y-3 shadow-xs">
              <p className="text-xl sm:text-2xl font-serif text-[var(--orange)] font-bold tracking-wider">
                ॥ लोकाः समस्ताः सुखिनो भवन्तु ॥
              </p>
              <p className="text-sm sm:text-base font-bold text-slate-800 tracking-wide">
                *LOKAH SAMASTAH SUKHINO BHAVANTU*
              </p>
              <div className="pt-2 border-t border-orange-200/60 max-w-xs mx-auto">
                <span className="text-2xl sm:text-3xl font-serif text-slate-900 font-black block tracking-wider">
                  ॥ ॐ नमः शिवाय ॥
                </span>
                <span className="text-base sm:text-lg font-bold text-[var(--orange)] font-serif block mt-1">
                  *OM NAMAH SHIVAYA!*
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. UNIFIED SEVA BOOKING MODAL */}
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
