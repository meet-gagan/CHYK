import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ShieldCheck,
  Lock,
  Flame,
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

const DEFAULT_MARATHON_PRIVACY = {
  title: 'Privacy Policy',
  subtitle:
    'How participant information, emergency contacts, entry passes, and certificate credentials are protected for the Anti-Drug Movement Mini-Marathon in Adoni.',
  lastUpdated: 'January 2027',
  sections: [
    {
      number: 1,
      title: 'Scope of this Policy',
      content:
        'This Privacy Policy describes how the Anti-Drug Movement Mini-Marathon Organizing Committee (under Chinmaya Mission, Adoni & Chinmaya Yuva Kendra) collects, uses, and safeguards information submitted by runners and educational institutions through the marathon web portal.',
    },
    {
      number: 2,
      title: 'Information Collected from Participants',
      content:
        'When registering online, we collect:\n• Identity Information: Full name, age/date of birth, gender, and recent photo (optional);\n• Contact Data: Mobile phone number, WhatsApp number, email, and residential city;\n• Institutional Background: School or college name, academic standard/year, or profession;\n• Safety Essentials: Emergency contact person name and telephone number, blood group;\n• Logistics: T-Shirt size (S, M, L, XL, XXL) for official runner gear allocation.',
    },
    {
      number: 3,
      title: 'How Participant Data is Used',
      content:
        'Participant information is used strictly for event administration:\n1. Generating official QR-code Entry Passes;\n2. Race day security, runner check-in, and T-shirt distribution;\n3. Immediate coordination with family members and medical staff in case of an on-route health emergency;\n4. Sending vital pre-race updates, assembly reminders, and route advisories via WhatsApp;\n5. Generating and validating official finisher certificates.',
    },
    {
      number: 4,
      title: 'Handling of Sensitive Medical & Emergency Data',
      content:
        'Emergency contact details and blood group records are designated as sensitive operational data. They are accessible strictly to accredited medical staff, race marshals, and senior coordinators on race day, and are never shared for commercial advertising.',
    },
    {
      number: 5,
      title: 'Institutional Batch Data Safeguards',
      content:
        'Spreadsheets uploaded by schools and colleges for bulk batch registrations are processed through secure parsers. Institution coordinators retain administrative access to verify and update their batch lists until registration closing.',
    },
    {
      number: 6,
      title: 'Community Story Board & Public Displays',
      content:
        'If you submit an inspiring quote, personal story, or anti-drug pledge to the Community Story Board ("Your Thoughts"), your submitted quote, first name, and runner badge may be displayed publicly to encourage other youth in the community.',
    },
    {
      number: 7,
      title: 'No Commercial Exploitation or Third-Party Sale',
      content:
        'The organizing committee never sells, leases, or trades participant databases to commercial marketing firms. Information is shared only with verified civic authorities (police and health services) as required for public road race safety.',
    },
    {
      number: 8,
      title: 'Data Retention and Certificate Verification',
      content:
        'Participant registration IDs and certificate verification records are stored securely in cloud infrastructure to enable runners to verify and reprint their completion certificates post-event.',
    },
    {
      number: 9,
      title: 'Participant Rights and Inquiries',
      content:
        'Participants can review and retrieve their active entry pass via the "My Activity" section of the portal. For corrections or data queries, contact the organizing desk at Chinmaya Mission Cultural Complex, Adoni - 518301, Andhra Pradesh.',
    },
  ],
};

export const PrivacyPolicyPage = () => {
  const [doc, setDoc] = useState(() => {
    try {
      const cached = localStorage.getItem('cached_legal_marathon_privacy');
      return cached ? JSON.parse(cached) : DEFAULT_MARATHON_PRIVACY;
    } catch (_) {
      return DEFAULT_MARATHON_PRIVACY;
    }
  });

  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Privacy Policy • Anti-Drug Mini-Marathon 2027';

    const loadDoc = async () => {
      try {
        setLoading(true);
        const res = await legalService.getLegalDoc('marathon', 'privacy');
        if (res.data?.success && res.data?.data) {
          const fresh = {
            title: res.data.data.title || DEFAULT_MARATHON_PRIVACY.title,
            subtitle: res.data.data.subtitle || DEFAULT_MARATHON_PRIVACY.subtitle,
            lastUpdated: res.data.data.lastUpdated || DEFAULT_MARATHON_PRIVACY.lastUpdated,
            sections: Array.isArray(res.data.data.sections) && res.data.data.sections.length > 0
              ? res.data.data.sections
              : DEFAULT_MARATHON_PRIVACY.sections,
          };
          setDoc(fresh);
          try {
            localStorage.setItem('cached_legal_marathon_privacy', JSON.stringify(fresh));
          } catch (_) {}
        }
      } catch (err) {
        console.warn('Using cached / default Marathon privacy:', err.message);
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
        {/* Navigation & Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[var(--text-muted)] hover:text-[var(--orange)] transition-colors text-decoration-none group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Mini-Marathon Home</span>
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
              <span>Participant Data Privacy • Anti-Drug <span className="whitespace-nowrap inline-block">Mini&#8209;Marathon</span> 2027</span>
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

        {/* Search Filter */}
        <div className="relative max-w-md mx-auto">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search participant privacy (e.g. medical, whatsapp, pass)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-[var(--border-color,#E2E8F0)] text-xs sm:text-sm font-semibold text-[var(--text-primary)] shadow-xs focus:outline-none focus:border-[var(--orange)] transition-colors"
          />
        </div>

        {/* Policy Sections List */}
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

        {/* Runner Data Protection Notice */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-500/5 via-cyan-500/5 to-blue-500/5 border border-emerald-500/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2 text-emerald-600 font-extrabold text-xs">
              <Lock className="w-4 h-4" />
              <span>Runner Privacy & Emergency Safety Guarantee</span>
            </div>
            <p className="text-xs text-[var(--text-muted)] font-medium">
              Your emergency contacts and blood group details are handled exclusively for race day safety by our medical teams.
            </p>
          </div>
          <Link
            to="/my-activity"
            className="btn-secondary text-xs py-2.5 px-5 font-black uppercase tracking-wider text-decoration-none shadow-sm whitespace-nowrap bg-white"
          >
            Manage My Entry Pass
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
