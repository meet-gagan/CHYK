import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Scale,
  Printer,
  Search,
  Building,
  Calendar,
  CheckCircle,
  HelpCircle,
  Mail,
  MapPin,
} from 'lucide-react';
import { legalService } from '../services/api';

const DEFAULT_CHINMAYA_TERMS = {
  title: 'Terms & Conditions',
  subtitle:
    'Please review the official terms and conditions governing the use of the Chinmaya Mission, Adoni digital platform, sacred temple seva bookings, 80G donations, and spiritual community activities.',
  lastUpdated: 'January 2027',
  sections: [
    {
      number: 1,
      title: 'Acceptance of Terms',
      content:
        'Welcome to Chinmaya Mission, Adoni. By accessing, browsing, or utilizing this website and its affiliated digital services, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions and our Privacy Policy. If you do not agree with any part of these terms, please discontinue use of this website.',
    },
    {
      number: 2,
      title: 'About Chinmaya Mission, Adoni',
      content:
        'Chinmaya Mission, Adoni is a charitable, spiritual, and socio-cultural trust registered in India, functioning under the worldwide vision of Pujya Gurudev Swami Chinmayananda. The mission serves humanity by providing Vedanta education, spiritual discourses, youth leadership initiatives, and sacred temple services.',
    },
    {
      number: 3,
      title: 'Spiritual Classes, CHYK & Cultural Programs',
      content:
        'Information provided regarding Vedanta Study Groups, Devi Group, Balavihar children classes, Chinmaya Yuva Kendra (CHYK) youth activities, and cultural festivals is intended for community enrichment. Participation in all mission programs requires respectful adherence to spiritual conduct, guru-shishya traditions, and community harmony.',
    },
    {
      number: 4,
      title: 'Temple Darshan & Online Seva Bookings',
      content:
        'Sri Chinmaya Sanjeevaraya Swami Temple and Sri Shanthamalleshwara Swami Temple conduct daily nitya pujas, abhishekam, archana, and special festive rituals. Devotees submitting online seva bookings must provide authentic devotee names, family gotra, and contact information for the sacred sankalpam. The Mission makes every effort to perform the seva on the requested date or nearest auspicious occasion.',
    },
    {
      number: 5,
      title: 'Voluntary Donations & 80G Tax Exemption',
      content:
        'All donations, seva contributions, and mission project offerings made through this website are strictly voluntary religious and charitable contributions. Eligible donations qualify for income tax exemption under Section 80G of the Indian Income Tax Act. Donors seeking 80G exemption must provide their valid Permanent Account Number (PAN) and postal address during donation submission.',
    },
    {
      number: 6,
      title: 'Cancellation and Refund Policy',
      content:
        'All offerings, seva bookings, and voluntary donations are non-refundable and non-transferable once submitted, as religious sankalpam and charitable fund disbursements commence upon receipt. In the exceptional circumstance of a duplicate technical debit on a payment gateway, the excess transaction will be refunded upon verification.',
    },
    {
      number: 7,
      title: 'Premises Etiquette & Code of Conduct',
      content:
        'Visitors and devotees visiting the Chinmaya Cultural Complex, ashram premises, and sanctum sanctorum are requested to observe traditional decorum, dress modestly, switch mobile phones to silent mode, and respect temple sanctities. Unauthorized commercial filming, commercial solicitation, or disruptive activities are strictly prohibited.',
    },
    {
      number: 8,
      title: 'Intellectual Property Rights',
      content:
        'All spiritual articles, publications, commentaries, chants, audio-video recordings, event photos, and the Chinmaya Mission logo are protected by copyright and intellectual property laws of India. No content may be reproduced, broadcast, or distributed commercially without prior written authorization from Chinmaya Mission authorities.',
    },
    {
      number: 9,
      title: 'Payment Security & Third-Party Processors',
      content:
        'Online payment transactions are processed securely through RBI-authorized payment aggregators (supporting UPI, Net Banking, Debit/Credit Cards). Chinmaya Mission does not store sensitive banking passwords, ATM PINs, or card CVVs on its servers.',
    },
    {
      number: 10,
      title: 'Limitation of Liability',
      content:
        'To the fullest extent permitted by applicable law, Chinmaya Mission, Adoni, its trustees, acharyas, sevaks, and volunteers shall not be liable for any indirect, incidental, or consequential damages resulting from website downtime, technical interruptions, or external links.',
    },
    {
      number: 11,
      title: 'Governing Law and Jurisdiction',
      content:
        'These Terms and Conditions shall be governed by and construed in accordance with the laws of the Republic of India. Any legal dispute or claim arising hereunder shall fall within the exclusive jurisdiction of the competent civil courts at Adoni, Kurnool District, Andhra Pradesh.',
    },
    {
      number: 12,
      title: 'Contact & Grievance Redressal',
      content:
        'For questions regarding these terms, temple services, or donation acknowledgments, please contact Chinmaya Mission, Near Arts College Road, Adoni - 518301, Andhra Pradesh, India, or email chinmayamissionadoni@gmail.com.',
    },
  ],
};

export const TermsPage = () => {
  const [doc, setDoc] = useState(() => {
    try {
      const cached = localStorage.getItem('cached_legal_chinmaya_terms');
      return cached ? JSON.parse(cached) : DEFAULT_CHINMAYA_TERMS;
    } catch (_) {
      return DEFAULT_CHINMAYA_TERMS;
    }
  });

  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Terms & Conditions • Chinmaya Mission, Adoni';

    const loadDoc = async () => {
      try {
        setLoading(true);
        const res = await legalService.getLegalDoc('chinmaya', 'terms');
        if (res.data?.success && res.data?.data) {
          const fresh = {
            title: res.data.data.title || DEFAULT_CHINMAYA_TERMS.title,
            subtitle: res.data.data.subtitle || DEFAULT_CHINMAYA_TERMS.subtitle,
            lastUpdated: res.data.data.lastUpdated || DEFAULT_CHINMAYA_TERMS.lastUpdated,
            sections: Array.isArray(res.data.data.sections) && res.data.data.sections.length > 0
              ? res.data.data.sections
              : DEFAULT_CHINMAYA_TERMS.sections,
          };
          setDoc(fresh);
          try {
            localStorage.setItem('cached_legal_chinmaya_terms', JSON.stringify(fresh));
          } catch (_) {}
        }
      } catch (err) {
        console.warn('Using cached / default Chinmaya terms:', err.message);
      } finally {
        setLoading(false);
      }
    };

    loadDoc();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const filteredSections = (doc.sections || []).filter((sec) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      sec.title?.toLowerCase().includes(q) ||
      sec.content?.toLowerCase().includes(q) ||
      String(sec.number || '').includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-[var(--bg-primary,#FFFDF9)] py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[var(--text-muted)] hover:text-[var(--orange)] transition-colors text-decoration-none group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Home Page</span>
            </Link>

            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-white border border-[var(--border-color,#E2E8F0)] hover:border-[var(--orange)] text-xs font-bold text-[var(--text-primary)] hover:text-[var(--orange)] shadow-xs transition-colors inline-flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5 text-[var(--orange)]" />
              <span>Print Terms</span>
            </button>
          </div>

          <div className="text-center space-y-3 pt-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[var(--orange)]/10 text-[var(--orange)] font-extrabold text-xs uppercase tracking-wider border border-[var(--orange)]/20 shadow-xs">
              <Scale className="w-3.5 h-3.5" />
              <span>Chinmaya Mission, Adoni</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading text-[var(--text-primary)] tracking-tight">
              {doc.title || 'Terms & Conditions'}
            </h1>

            <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-2xl mx-auto leading-relaxed">
              {doc.subtitle}
            </p>

            <div className="flex items-center justify-center gap-2 text-xs font-bold text-[var(--text-muted)]">
              <Calendar className="w-3.5 h-3.5 text-[var(--cyan)]" />
              <span>Last Updated: {doc.lastUpdated || 'January 2027'}</span>
            </div>
          </div>
        </div>

        <div className="relative max-w-md mx-auto">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search terms (e.g. seva, donation, refund, gotra)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-[var(--border-color,#E2E8F0)] text-xs sm:text-sm font-semibold text-[var(--text-primary)] shadow-xs focus:outline-none focus:border-[var(--orange)] transition-colors"
          />
        </div>

        <div className="bg-white rounded-3xl border border-[rgba(11,35,64,0.08)] shadow-[0_1px_3px_rgba(11,35,64,0.04),0_8px_24px_rgba(11,35,64,0.06)] divide-y divide-[var(--border-color,#E2E8F0)] overflow-hidden">
          {filteredSections.length > 0 ? (
            filteredSections.map((item, idx) => (
              <div
                key={item.id || idx}
                className="p-5 sm:p-6 hover:bg-slate-50/70 transition-colors flex items-start gap-4 sm:gap-5 group"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[var(--bg-secondary,#FFFBF5)] border border-[var(--orange)]/30 text-[var(--orange)] font-black text-xs sm:text-sm flex items-center justify-center shrink-0 shadow-xs group-hover:bg-[var(--orange)] group-hover:text-white transition-all">
                  <span>{item.number || idx + 1}</span>
                </div>

                <div className="flex-1 min-w-0 space-y-1.5 pt-0.5">
                  {item.title && (
                    <h3 className="text-sm sm:text-base font-extrabold text-[var(--text-primary)] font-heading">
                      {item.title}
                    </h3>
                  )}
                  <p className="text-xs sm:text-sm text-[var(--text-primary)]/85 font-medium leading-relaxed m-0 whitespace-pre-line">
                    {item.content}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-10 text-center text-slate-400 space-y-2">
              <HelpCircle className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs sm:text-sm font-bold">No matching terms found for "{searchTerm}".</p>
            </div>
          )}
        </div>

        <div className="p-6 rounded-3xl bg-[var(--bg-secondary,#FFFBF5)] border border-[var(--border-color,#E2E8F0)] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-1">
            <h4 className="text-sm font-black text-[var(--text-primary)] font-heading">
              Have Questions About Temple Sevas or Policies?
            </h4>
            <p className="text-xs text-[var(--text-muted)] font-medium">
              Reach out to our Chinmaya Mission administration desk in Adoni anytime.
            </p>
          </div>
          <Link
            to="/lets-connect"
            className="btn-primary text-xs py-2.5 px-5 font-black uppercase tracking-wider text-decoration-none shadow-sm whitespace-nowrap"
          >
            Contact Mission Desk
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
