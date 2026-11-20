import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ShieldCheck,
  Lock,
  Building,
  Scale,
  Database,
  FileCheck2,
  Share2,
  Clock,
  Printer,
  Search,
  CheckCircle2,
  MapPin,
  Mail,
  HelpCircle,
} from 'lucide-react';
import { legalService } from '../services/api';

const DEFAULT_CHINMAYA_PRIVACY = {
  title: 'Privacy Policy',
  subtitle:
    'How Chinmaya Mission, Adoni collects, safeguards, and respects the personal information of devotees, donors, students, and website visitors.',
  lastUpdated: 'January 2027',
  sections: [
    {
      number: 1,
      title: 'Commitment to Devotee Privacy',
      content:
        'Chinmaya Mission, Adoni holds the trust of its devotees and patrons with utmost reverence. This Privacy Policy details our practices concerning the collection, storage, use, and protection of personal data in compliance with the Digital Personal Data Protection Act, 2023 (DPDP Act) and the Information Technology Act, 2000 of India.',
    },
    {
      number: 2,
      title: 'Information We Collect',
      content:
        'We collect information directly from you when you interact with our website:\n• Devotee Identity: Full Name, mobile number, email address, and home city.\n• Sacred Ritual Details: Gotra, nakshatra, and family member names for temple puja sankalpam.\n• Donation Information: Transaction amount, date, bank reference ID, and PAN number (strictly for 80G tax compliance).\n• Enquiries & Volunteering: Details submitted via "Let\'s Connect" or volunteer registration forms.',
    },
    {
      number: 3,
      title: 'Purpose of Information Collection',
      content:
        'Devotee information is collected and processed solely for:\n1. Conducting temple rituals and performing devotee sankalpam accurately;\n2. Generating and dispatching official donation receipts and 80G certificates;\n3. Sending spiritual event circulars, festival invitations, and mission updates via WhatsApp or SMS;\n4. Coordinating volunteer seva and responding to devotee queries.',
    },
    {
      number: 4,
      title: 'Data Storage and Security',
      content:
        'We implement robust security measures including encrypted data transmission (HTTPS/TLS), restricted role-based administrative access, and secure database backups. Personal records are retained only for as long as necessary to fulfill religious, administrative, and legal accounting requirements.',
    },
    {
      number: 5,
      title: 'No Commercial Data Sharing or Sale',
      content:
        'Chinmaya Mission, Adoni maintains a strict policy: we NEVER sell, rent, trade, or commercially monetize devotee personal information. Data is disclosed only to trusted infrastructure providers (e.g., payment gateways, transactional SMS/WhatsApp gateways) strictly necessary for delivering mission services.',
    },
    {
      number: 6,
      title: 'Payment & Financial Security',
      content:
        'All online donations and seva payments are handled by certified, PCI-DSS compliant payment gateways. The mission platform does not view, collect, or store credit/debit card numbers, CVVs, or online banking credentials.',
    },
    {
      number: 7,
      title: 'Cookies & Analytics',
      content:
        'Our platform uses minimal essential technical cookies to ensure site responsiveness, session security, and aggregate traffic diagnostics. We do not employ third-party advertising cookies or cross-site tracking technologies.',
    },
    {
      number: 8,
      title: 'Devotee Rights & Contact',
      content:
        'Devotees have the right to request a review of their stored information, update contact details, or request discontinuation of promotional messaging. For any privacy queries or grievance redressal, please contact: Chinmaya Mission Cultural Complex, Adoni - 518301, Andhra Pradesh, India.',
    },
  ],
};

export const PrivacyPolicyPage = () => {
  const [doc, setDoc] = useState(() => {
    try {
      const cached = localStorage.getItem('cached_legal_chinmaya_privacy');
      return cached ? JSON.parse(cached) : DEFAULT_CHINMAYA_PRIVACY;
    } catch (_) {
      return DEFAULT_CHINMAYA_PRIVACY;
    }
  });

  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Privacy Policy • Chinmaya Mission, Adoni';

    const loadDoc = async () => {
      try {
        setLoading(true);
        const res = await legalService.getLegalDoc('chinmaya', 'privacy');
        if (res.data?.success && res.data?.data) {
          const fresh = {
            title: res.data.data.title || DEFAULT_CHINMAYA_PRIVACY.title,
            subtitle: res.data.data.subtitle || DEFAULT_CHINMAYA_PRIVACY.subtitle,
            lastUpdated: res.data.data.lastUpdated || DEFAULT_CHINMAYA_PRIVACY.lastUpdated,
            sections: Array.isArray(res.data.data.sections) && res.data.data.sections.length > 0
              ? res.data.data.sections
              : DEFAULT_CHINMAYA_PRIVACY.sections,
          };
          setDoc(fresh);
          try {
            localStorage.setItem('cached_legal_chinmaya_privacy', JSON.stringify(fresh));
          } catch (_) {}
        }
      } catch (err) {
        console.warn('Using cached / default Chinmaya privacy:', err.message);
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
              <span>Print Policy</span>
            </button>
          </div>

          <div className="text-center space-y-3 pt-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 font-extrabold text-xs uppercase tracking-wider border border-emerald-500/20 shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Devotee Data Protection • DPDP Act 2023 Compliant</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading text-[var(--text-primary)] tracking-tight">
              {doc.title || 'Privacy Policy'}
            </h1>

            <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-2xl mx-auto leading-relaxed">
              {doc.subtitle}
            </p>

            <div className="flex items-center justify-center gap-2 text-xs font-bold text-[var(--text-muted)]">
              <Clock className="w-3.5 h-3.5 text-[var(--cyan)]" />
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
            placeholder="Search privacy guidelines (e.g. pan, seva, cookies)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-[var(--border-color,#E2E8F0)] text-xs sm:text-sm font-semibold text-[var(--text-primary)] shadow-xs focus:outline-none focus:border-[var(--orange)] transition-colors"
          />
        </div>

        <div className="space-y-4">
          {filteredSections.length > 0 ? (
            filteredSections.map((item, idx) => (
              <div
                key={item.id || idx}
                className="p-5 sm:p-6 rounded-3xl bg-white border border-[rgba(11,35,64,0.08)] shadow-[0_1px_3px_rgba(11,35,64,0.04),0_8px_24px_rgba(11,35,64,0.06)] space-y-2.5 transition-all hover:border-[var(--orange)]/30"
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 font-black text-xs flex items-center justify-center shrink-0">
                    {item.number || idx + 1}
                  </span>
                  <h3 className="text-sm sm:text-base font-extrabold text-[var(--text-primary)] font-heading">
                    {item.title}
                  </h3>
                </div>

                <div className="pl-10">
                  <p className="text-xs sm:text-sm text-[var(--text-primary)]/85 font-medium leading-relaxed m-0 whitespace-pre-line">
                    {item.content}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-10 text-center text-slate-400 space-y-2 bg-white rounded-3xl border border-[var(--border-color,#E2E8F0)]">
              <HelpCircle className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs sm:text-sm font-bold">No matching policy clauses found for "{searchTerm}".</p>
            </div>
          )}
        </div>

        <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-500/5 to-cyan-500/5 border border-emerald-500/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2 text-emerald-600 font-extrabold text-xs">
              <Lock className="w-4 h-4" />
              <span>Strict Privacy Standard</span>
            </div>
            <p className="text-xs text-[var(--text-muted)] font-medium">
              We never sell devotee information to third parties. All donations are 100% secure.
            </p>
          </div>
          <Link
            to="/lets-connect"
            className="btn-primary text-xs py-2.5 px-5 font-black uppercase tracking-wider text-decoration-none shadow-sm whitespace-nowrap"
          >
            Contact Privacy Officer
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
