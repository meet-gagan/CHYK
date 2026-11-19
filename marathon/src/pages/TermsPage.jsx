import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Scale,
  Printer,
  Search,
  Flame,
  Calendar,
  CheckCircle,
  HelpCircle,
  ShieldAlert,
} from 'lucide-react';
import { legalService } from '../services/api';

const DEFAULT_MARATHON_TERMS = {
  title: 'Terms & Conditions',
  subtitle:
    'Official terms, rules, liability waiver, participant declarations, and safety regulations governing participation in the Anti-Drug Movement Mini-Marathon in Adoni.',
  lastUpdated: 'January 2027',
  sections: [
    {
      number: 1,
      title: 'Registration & Participant Acceptance',
      content:
        'By registering for the Anti-Drug Movement Mini-Marathon Run 2027 (organized by Chinmaya Mission, Adoni & Chinmaya Yuva Kendra), whether as an individual runner, with a friend, or via institutional bulk batch registration, the participant (or their parent/legal guardian, if the participant is a minor) unequivocally agrees to comply with all event terms, guidelines, and safety directives.',
    },
    {
      number: 2,
      title: 'Free Community Initiative & Non-Transferability',
      content:
        'Registration for this community awareness mini-marathon is completely free of cost. Each registration generates an official digital Entry Pass with a unique Registration ID and secure QR code. Entry passes and runner bibs are strictly personal, non-transferable, and cannot be reassigned or sold to any other person.',
    },
    {
      number: 3,
      title: 'Physical Fitness & Medical Clearance',
      content:
        'The participant confirms that they are physically fit, in good cardiovascular health, and sufficiently conditioned to complete the certified 3.5 KM mini-marathon distance. Participants with pre-existing heart ailments, respiratory disorders, severe hypertension, or other medical contraindications must consult a qualified physician and obtain medical clearance before running.',
    },
    {
      number: 4,
      title: 'Voluntary Participation & Assumption of Risk',
      content:
        'Running on public roadways involves inherent risks, including but not limited to physical exertion, muscle strain, sprains, falls, collision with other runners or obstacles, dehydration, vehicular movement, and changing weather conditions. Participation is entirely voluntary, and participants freely assume all associated physical risks.',
    },
    {
      number: 5,
      title: 'Comprehensive Waiver & Release of Liability',
      content:
        'The participant hereby waives, releases, and discharges Chinmaya Mission, Adoni, Chinmaya Yuva Kendra, event sponsors, civic authorities, route marshals, medical staff, volunteers, and venue owners from any liability, claim, loss, expense, injury, illness, or fatality arising out of or in connection with participation in the Mini-Marathon.',
    },
    {
      number: 6,
      title: 'Event Schedule & Assembly Instructions',
      content:
        'The Anti-Drug Movement Mini-Marathon Run will take place on Sunday, 24 January 2027, flagging off at 6:00 AM sharp from Municipal High School, Adoni, and concluding at Chinmaya Mission, Adoni. All participants must report to the assembly holding zone by 5:30 AM with their digital or printed Entry Pass.',
    },
    {
      number: 7,
      title: 'Anti-Drug Movement Code of Conduct',
      content:
        'This event stands firmly against all forms of substance abuse and addiction. All participants pledge to champion healthy, drug-free living. Possession, consumption, or influence of drugs, tobacco, alcohol, or prohibited stimulants is strictly forbidden and will result in immediate disqualification, confiscation of event pass, and notification to local law enforcement authorities.',
    },
    {
      number: 8,
      title: 'Institutional & Student Bulk Registrations',
      content:
        'Educational institutions (schools and colleges) submitting bulk student batches confirm that all listed students are bona fide students with parental approval. Institutional coordinators are responsible for assembling and guiding their student contingents throughout the route.',
    },
    {
      number: 9,
      title: 'On-Route Medical & First Aid Support',
      content:
        'Organizers provide hydration stations, emergency ambulances, and mobile medical volunteer squads along the 3.5 KM route. In the event of injury, dehydration, or medical distress, event personnel are authorized to provide first aid and arrange transport to the nearest government or private hospital.',
    },
    {
      number: 10,
      title: 'Media Release & Photography Consent',
      content:
        'Participants grant the organizing committee irrevocable permission to photograph, video record, broadcast, and livestream their participation across television, newspapers, social media, and official websites for youth drug-awareness campaigns without financial compensation.',
    },
    {
      number: 11,
      title: 'Route Modifications & Force Majeure',
      content:
        'The organizers reserve the right to alter the race route, modify flag-off timings, or adjust event arrangements in response to weather emergencies, police directives, or civic safety requirements.',
    },
    {
      number: 12,
      title: 'Committee Decision Finality',
      content:
        'In all matters concerning event rules, disqualification, pass verification, and distribution of official finisher certificates, the decision of the Chinmaya Mission & CHYK Organizing Committee shall be final and binding.',
    },
  ],
};

export const TermsPage = () => {
  const [doc, setDoc] = useState(() => {
    try {
      const cached = localStorage.getItem('cached_legal_marathon_terms');
      return cached ? JSON.parse(cached) : DEFAULT_MARATHON_TERMS;
    } catch (_) {
      return DEFAULT_MARATHON_TERMS;
    }
  });

  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Terms & Conditions • Anti-Drug Mini-Marathon 2027';

    const loadDoc = async () => {
      try {
        setLoading(true);
        const res = await legalService.getLegalDoc('marathon', 'terms');
        if (res.data?.success && res.data?.data) {
          const fresh = {
            title: res.data.data.title || DEFAULT_MARATHON_TERMS.title,
            subtitle: res.data.data.subtitle || DEFAULT_MARATHON_TERMS.subtitle,
            lastUpdated: res.data.data.lastUpdated || DEFAULT_MARATHON_TERMS.lastUpdated,
            sections: Array.isArray(res.data.data.sections) && res.data.data.sections.length > 0
              ? res.data.data.sections
              : DEFAULT_MARATHON_TERMS.sections,
          };
          setDoc(fresh);
          try {
            localStorage.setItem('cached_legal_marathon_terms', JSON.stringify(fresh));
          } catch (_) {}
        }
      } catch (err) {
        console.warn('Using cached / default Marathon terms:', err.message);
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
              <span>Back to <span className="whitespace-nowrap inline-block">Mini&#8209;Marathon</span> Home</span>
            </Link>

            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-white border border-[var(--border-color,#E2E8F0)] hover:border-[var(--orange)] text-xs font-bold text-[var(--text-primary)] hover:text-[var(--orange)] shadow-xs transition-colors inline-flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5 text-[var(--orange)]" />
              <span>Print Waiver & Terms</span>
            </button>
          </div>

          <div className="text-center space-y-3 pt-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[var(--orange)]/10 text-[var(--orange)] font-extrabold text-xs uppercase tracking-wider border border-[var(--orange)]/20 shadow-xs">
              <Flame className="w-3.5 h-3.5" />
              <span>Anti-Drug Movement <span className="whitespace-nowrap inline-block">Mini&#8209;Marathon</span> 2027</span>
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

        {/* Search Filter */}
        <div className="relative max-w-md mx-auto">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search rules (e.g. waiver, medical, pass, bib, route)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-[var(--border-color,#E2E8F0)] text-xs sm:text-sm font-semibold text-[var(--text-primary)] shadow-xs focus:outline-none focus:border-[var(--orange)] transition-colors"
          />
        </div>

        {/* Clauses List */}
        <div className="bg-white rounded-3xl border border-[rgba(11,35,64,0.08)] shadow-[0_1px_3px_rgba(11,35,64,0.04),0_8px_24px_rgba(11,35,64,0.06)] divide-y divide-[var(--border-color,#E2E8F0)] overflow-hidden">
          {filteredSections.length > 0 ? (
            filteredSections.map((item, idx) => (
              <div
                key={item.id || idx}
                className="p-5 sm:p-6 hover:bg-slate-50/70 transition-colors flex items-start gap-4 sm:gap-5 group"
              >
                {/* Number Badge */}
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[var(--bg-secondary,#FFFBF5)] border border-[var(--orange)]/30 text-[var(--orange)] font-black text-xs sm:text-sm flex items-center justify-center shrink-0 shadow-xs group-hover:bg-[var(--orange)] group-hover:text-white transition-all">
                  <span>{item.number || idx + 1}</span>
                </div>

                {/* Term Text */}
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
              <p className="text-xs sm:text-sm font-bold">No matching rules found for "{searchTerm}".</p>
            </div>
          )}
        </div>

        {/* Registration CTA Card */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-yellow-500/10 border border-[var(--orange)]/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left shadow-sm">
          <div className="space-y-1">
            <h4 className="text-sm font-black text-[var(--text-primary)] font-heading">
              Ready to Join the Movement on 24 January 2027?
            </h4>
            <p className="text-xs text-[var(--text-muted)] font-medium">
              Free individual and school/college bulk registrations are currently open.
            </p>
          </div>
          <Link
            to="/register"
            className="btn-primary text-xs py-2.5 px-6 font-black uppercase tracking-wider text-decoration-none shadow-md whitespace-nowrap"
          >
            Register for <span className="whitespace-nowrap inline-block">Mini&#8209;Marathon</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
