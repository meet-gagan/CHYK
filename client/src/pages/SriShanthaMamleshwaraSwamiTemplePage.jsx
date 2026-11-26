import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { webContentService, mediaService } from '../services/api';
import { TempleSevaSection } from '../components/TempleSevaSection';
import {
  Flame,
  Heart,
  Sparkles,
  Sun,
} from 'lucide-react';

export const SriShanthaMamleshwaraSwamiTemplePage = () => {
  const [pageData, setPageData] = useState(() => {
    try {
      localStorage.removeItem('cached_cms_shantamalleshwara_temple');
      localStorage.removeItem('cached_cms_shantamalleshwara_temple_v2');
      const cached = localStorage.getItem('cached_cms_shantamalleshwara_temple_v3');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });

  const location = useLocation();

  const [nityaPoojaluData, setNityaPoojaluData] = useState({
    title: 'Nitya Poojalu',
    badge: 'Every Day',
    desc: 'Daily poojas are performed to Lord Shiva every morning and evening with devotion and traditional rituals.\n\nMorning & Evening Poojas – Every Day.',
    timing: 'Morning & Evening Poojas – Every Day.',
    image: '/assets/images/temple-seva-nitya-poojalu.jpg',
  });

  useEffect(() => {
    document.title = 'Shri Shantamalleshwara Swami Temple | Chinmaya Mission';

    const isTargeted =
      window.location.hash?.includes('maha-shivaratri') ||
      window.location.search?.includes('maha-shivaratri') ||
      window.location.hash?.includes('services');

    if (!isTargeted) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }

    // Fetch dynamic Nitya Poojalu media asset if configured or edited by Admin
    mediaService
      .getPublicMedia({ category: 'Nitya Poojalu' })
      .then((res) => {
        if (res.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
          const item = res.data.data[0];
          setNityaPoojaluData((prev) => ({
            title: item.title || prev.title,
            badge: item.caption || prev.badge,
            desc: item.description || prev.desc,
            timing: prev.timing,
            image: item.url || prev.image,
          }));
        }
      })
      .catch(() => {});

    webContentService
      .getPublicPage('chinmaya', 'shantamalleshwara_temple')
      .then((res) => {
        if (res.data?.success && res.data?.data) {
          setPageData(res.data.data);
          try {
            localStorage.setItem(
              'cached_cms_shantamalleshwara_temple_v3',
              JSON.stringify(res.data.data)
            );
          } catch {}
        }
      })
      .catch(() => {});
  }, []);

  const f = pageData?.fieldsMap || {};

  const festivals = [
    {
      name: 'Maha Shivaratri Mahotsavam',
      period: 'Magha Bahula Chaturdashi',
      desc: 'The grandest annual celebration where 3,000 to 4,000+ devotees ascend the hilltop shrine for night-long Jagaran, Laghu Rudra Abhishekam, and Rudram Homam performed by Veda Purohits.',
      icon: <Flame className="w-5 h-5 text-[var(--orange)]" />,
    },
    {
      name: 'Shiva-Parvati Kalyana Mahotsavam',
      period: 'Magha Masam (Post-Shivaratri Monday)',
      desc: 'A divine celestial wedding ceremony celebrating the cosmic union of Lord Shiva and Goddess Parvati, drawing 600 to 1,000 devotees, followed by community Annadanam and Mahaprasadam.',
      icon: <Heart className="w-5 h-5 text-rose-500" />,
    },
    {
      name: 'Karthika Deepotsavam',
      period: 'Karthika Masam (Every Monday)',
      desc: 'The hilltop sanctum is illuminated with hundreds of sacred earthen lamps (deepams), offering a magnificent radiant spectacle with special evening deeparadhana.',
      icon: <Sun className="w-5 h-5 text-amber-500" />,
    },
    {
      name: 'Magha Masam Special Daily Poojalu',
      period: 'Month of Magha Masam',
      desc: 'Month-long daily special abhishekams and sacred archanas supported by hundreds of community devotee sponsors, culminating in the joyous celebrations of Mahashivaratri.',
      icon: <Sparkles className="w-5 h-5 text-[var(--orange)]" />,
    },
  ];

  return (
    <div className="min-h-screen bg-[#FFFDF8] text-[var(--text-primary)] transition-colors duration-300">
      <section className="relative overflow-hidden bg-gradient-to-b from-[#1C160C] via-[#241B0E] to-[#120E08] text-white py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#F59E0B_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="max-w-6xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-left">
            <h1 className="text-lg min-[380px]:text-xl sm:text-2xl md:text-3xl lg:text-[1.85rem] xl:text-[2.25rem] font-black font-heading text-white tracking-tight leading-tight whitespace-nowrap">
              SHRI SHANTAMALLESHWARA SWAMI TEMPLE
            </h1>

            <p className="text-amber-200/90 text-sm sm:text-base font-serif italic">
              "{f.temple_hero?.subtitle ||
                'Shri Shantamalleshwara Swami Devasthanam — A revered hilltop sanctuary of peace, divine grace, and timeless Shaivite heritage.'}"
            </p>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              {f.temple_hero?.intro ||
                'Dedicated to Lord Shiva (Shri Shantamalleshwara Swami), this sanctified hilltop shrine stands majestically atop the hillock on Navarantanagiri, Shanta Mallappa Konda. Nurtured and maintained with profound devotion by the Chinmaya Mission Committee for over 25 years, the temple serves as an abode of profound silence, positive spiritual energy, and community harmony for all seekers and devotees.'}
            </p>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-black/80 via-slate-950 to-black border-2 border-amber-500/40 shadow-2xl shadow-amber-950/50 p-2 sm:p-3 group max-w-sm w-full">
              <div className="absolute -inset-1 bg-gradient-to-tr from-amber-500/20 via-orange-500/20 to-transparent blur-xl pointer-events-none" />

              <div className="relative rounded-2xl overflow-hidden bg-black/60 flex items-center justify-center min-h-[360px] sm:min-h-[420px]">
                <img
                  src={
                    (f.temple_hero?.imageUrl && !f.temple_hero.imageUrl.includes('media_'))
                      ? f.temple_hero.imageUrl
                      : '/assets/images/shri-shantamalleshwara-sanctum.jpg'
                  }
                  alt={
                    f.temple_hero?.deityName ||
                    'Shri Shantamalleshwara Swami Sanctum Sanctorum'
                  }
                  onError={(e) => {
                    e.currentTarget.src =
                      '/assets/images/shri-shantamalleshwara-shiva.jpg';
                  }}
                  className="w-full h-auto max-h-[460px] object-contain mx-auto my-auto block rounded-xl group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="eager"
                />
              </div>

              <div className="text-center pt-3 pb-1 space-y-0.5">
                <p className="text-xs font-extrabold uppercase tracking-widest text-amber-400">
                  {f.temple_hero?.deityName || 'Shri Shantamalleshwara Swami'}
                </p>
                <p className="text-[11px] text-slate-300 font-medium">
                  {f.temple_hero?.deitySubtitle
                    ? f.temple_hero.deitySubtitle.replace(/Chinmaya Mission,\s*Adoni/i, 'Navarantanagiri')
                    : 'Presiding Deity (Lord Shiva) • Navarantanagiri'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
        <div className="text-center max-w-4xl mx-auto space-y-2">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black font-heading text-slate-900 tracking-tight whitespace-nowrap">
            Shri Shantamalleshwara Swami Temple
          </h2>
          <p className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-[var(--orange)]">
            {f.temple_history?.location && !f.temple_history.location.includes('Ramanjaneya Nagar')
              ? f.temple_history.location
              : 'Navarantanagiri, Shanta Mallappa Konda, Adoni'}
          </p>
          <div className="w-16 h-1 bg-[var(--orange)] rounded-full mx-auto mt-2" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          <div className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-sm border border-slate-200/90 space-y-5 text-left leading-relaxed flex flex-col justify-start">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-2.5 h-2.5 rounded-full bg-[var(--orange)] shrink-0" />
              <h3 className="text-lg sm:text-xl font-bold font-heading text-slate-900">
                {f.temple_history?.historyTitle || 'History and Spiritual Legacy'}
              </h3>
            </div>

            <p className="text-sm sm:text-base text-slate-700">
              {f.temple_history?.historyP1 ||
                'The Shri Shantamalleshwara Swami Temple (also known as Shri Shantamalleshwara Swami Devasthanam) is an ancient and sanctified hilltop seat of Lord Shiva, revered for generations as an abode of profound peace, meditation, and spiritual grace.'}
            </p>

            <p className="text-sm sm:text-base text-slate-700">
              {f.temple_history?.historyOrigin ||
                'Originally constructed by the Kakatiyas in the 12th century and later restored by the Vijayanagara rulers in the 16th century.'}
            </p>

            <p className="text-sm sm:text-base text-slate-700">
              {f.temple_history?.historyP2 ||
                'The development and continuous preservation of this sacred shrine commenced in 1996 under the spiritual guidance and vision of Chinmaya Mission. For over 25 years, the Chinmaya Mission Committee has diligently nurtured, protected, and managed the temple precinct.'}
            </p>

            <p className="text-sm sm:text-base text-slate-700">
              {f.temple_history?.historyP3 ||
                'To facilitate easy, safe, and comfortable passage for thousands of pilgrims ascending the rocky hillock, Chinmaya Mission constructed vital infrastructure, including the primary temple access bridge in 2003 and the dedicated pedestrian footpath bridge in 2004.'}
            </p>

            <p className="text-sm sm:text-base text-slate-700">
              {f.temple_history?.historyP4 ||
                'In 2025, the grand Maha Kumbhabhishekam was successfully solemnized with sacred Vedic rituals and Agama Shastras. A permanent metal Omkara (ॐ) symbol installed on the summit is illuminated each night, standing as an uplifting spiritual beacon across the entire region.'}
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-sm border border-slate-200/90 space-y-5 text-left leading-relaxed flex flex-col justify-start">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-2.5 h-2.5 rounded-full bg-[var(--orange)] shrink-0" />
              <h3 className="text-lg sm:text-xl font-bold font-heading text-slate-900">
                {f.temple_history?.worshipTitle ||
                  'Daily Worship and Sacred Observances'}
              </h3>
            </div>

            <p className="text-sm sm:text-base text-slate-700">
              {f.temple_history?.worshipP1 ||
                'Daily poojas and abhishekams are performed with devotion and reverent chanting to Lord Shiva (Shri Shantamalleshwara Swami), invoking tranquility, good health, and spiritual clarity for all devotees and their families.'}
            </p>

            <p className="text-sm sm:text-base text-slate-700">
              {f.temple_history?.worshipP2 ||
                'During the holy month of Magha Masam, extended daily special pujas are conducted with active sponsorship and participation from hundreds of devotee families, culminating in the festive celebrations of Maha Shivaratri.'}
            </p>

            <p className="text-sm sm:text-base text-slate-700">
              {f.temple_history?.worshipP3 ||
                'The Devasthanam celebrates Maha Shivaratri, Lord Shiva-Parvati Kalyana Mahotsavam, Karthika Deepotsavam, and Pradosha Vratam with profound Vedic fervour, bringing the entire community together in devotional unity, Annadanam, and cultural preservation.'}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#090909] text-white py-12 sm:py-16 border-t border-[#2d2723]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black font-heading text-white tracking-tight">
              {nityaPoojaluData.title || 'Nitya Poojalu'}
            </h2>
            <div className="w-16 h-1 bg-[var(--orange)] rounded-full mx-auto mt-2" />
          </div>

          <div className="max-w-sm sm:max-w-md mx-auto">
            <div className="bg-[#141414] border border-[#2d2723] rounded-2xl overflow-hidden flex flex-col shadow-lg shadow-black/40 hover:border-[#f5c46a]/60 hover:-translate-y-1 transition-all duration-300 text-left group">
              <div className="w-full h-56 sm:h-64 overflow-hidden bg-black/40 relative">
                <img
                  src={nityaPoojaluData.image || '/assets/images/temple-seva-nitya-poojalu.jpg'}
                  alt={nityaPoojaluData.title || 'Nitya Poojalu'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5 sm:p-6 flex flex-col flex-1 space-y-2.5">
                <span className="inline-block self-start px-3 py-1 rounded-full bg-[#1f1f23] text-[#e0e0e0] text-xs font-medium border border-white/5">
                  {nityaPoojaluData.badge || 'Every Day'}
                </span>
                <h3 className="text-lg sm:text-xl font-bold font-heading text-[#f5c46a] leading-snug group-hover:text-amber-300 transition-colors">
                  {nityaPoojaluData.title || 'Nitya Poojalu'}
                </h3>
                <div className="text-slate-300 text-xs sm:text-sm leading-relaxed font-normal pt-1 space-y-2">
                  <p className="whitespace-pre-line">
                    {nityaPoojaluData.desc}
                  </p>
                  {nityaPoojaluData.timing && !nityaPoojaluData.desc?.includes(nityaPoojaluData.timing) && (
                    <p className="text-[#f5c46a]/90 font-medium">
                      {nityaPoojaluData.timing}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <TempleSevaSection />

      <section className="bg-gradient-to-b from-amber-50/50 to-white py-12 sm:py-16 border-t border-amber-900/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black font-heading text-slate-900 tracking-tight">
              Special Occasion Poojas
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Let every prayer bring peace, every ritual inspire devotion, and every celebration strengthens our spiritual connection.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {festivals.map((fest, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/90 flex flex-col justify-between hover:shadow-md hover:border-[var(--orange)]/40 transition-all text-left"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center mb-3">
                    {fest.icon}
                  </div>
                  <h3 className="text-base font-extrabold font-heading text-slate-900 mb-1">
                    {fest.name}
                  </h3>
                  <span className="inline-block text-[11px] font-bold text-[var(--orange)] mb-2 uppercase tracking-wide">
                    {fest.period}
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {fest.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default SriShanthaMamleshwaraSwamiTemplePage;
