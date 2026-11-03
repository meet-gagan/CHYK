import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ShieldCheck,
  Lock,
  Building,
  Scale,
  Database,
  FileCheck2,
  CreditCard,
  Share2,
  Clock,
  Cookie,
  Users,
  AlertCircle,
  Mail,
  MapPin,
  CheckCircle2,
} from 'lucide-react';

export const PRIVACY_SECTIONS = [
  {
    number: 1,
    title: 'Who We Are',
    icon: Building,
    content: (
      <div className="space-y-3 text-xs sm:text-sm text-[var(--text-primary)]/90 leading-relaxed font-medium">
        <p>
          This Privacy Policy describes how <strong className="font-bold text-[var(--text-primary)]">Chinmaya Mission, Adoni</strong> collects, uses, stores, and protects personal information when you use the Chinmaya Mission, Adoni platform (the "Website").
        </p>
        <p>
          Chinmaya Mission, Adoni is a charitable trust registered in India with its principal office at:
        </p>
        <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-[var(--bg-secondary,#FFFBF5)] border border-[var(--border-color,#E2E8F0)] text-xs sm:text-sm font-semibold text-[var(--text-primary)]">
          <MapPin className="w-4 h-4 text-[var(--orange)] shrink-0 mt-0.5" />
          <span>Chinmaya Mission, AAS College Road, Adoni 518302, Andhra Pradesh, India.</span>
        </div>
        <p>
          We are committed to protecting your privacy and handling your personal data transparently and in accordance with applicable law.
        </p>
      </div>
    ),
  },
  {
    number: 2,
    title: 'Legal Basis',
    icon: Scale,
    content: (
      <div className="space-y-3 text-xs sm:text-sm text-[var(--text-primary)]/90 leading-relaxed font-medium">
        <p>We process personal data in strict accordance with:</p>
        <ul className="space-y-2 list-none p-0 m-0">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>The Digital Personal Data Protection Act, 2023 (DPDP Act)</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>The Information Technology Act, 2000 and the rules made thereunder</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>Other applicable Indian data protection and privacy laws</span>
          </li>
        </ul>
      </div>
    ),
  },
  {
    number: 3,
    title: 'What Information We Collect',
    icon: Database,
    content: (
      <div className="space-y-4 text-xs sm:text-sm text-[var(--text-primary)]/90 leading-relaxed font-medium">
        <p>We collect only the information necessary for the specific purposes described below:</p>
        
        {/* 3a. Event registrations */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50/80 border border-[var(--border-color,#E2E8F0)] space-y-2">
          <h4 className="text-xs sm:text-sm font-black text-[var(--text-primary)]">
            3a. Event Registrations
          </h4>
          <p className="text-xs text-[var(--text-muted)]">
            When you register for an event or programme, we collect:
          </p>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {['Full name', 'Email address', 'Phone number', 'City and country', 'Payment transaction reference (not card details — see Section 5)', 'Any additional information required for the specific programme'].map((item) => (
              <span key={item} className="inline-flex items-center px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[11px] sm:text-xs font-semibold text-[var(--text-primary)]">
                • {item}
              </span>
            ))}
          </div>
        </div>

        {/* 3b. Donations */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50/80 border border-[var(--border-color,#E2E8F0)] space-y-2">
          <h4 className="text-xs sm:text-sm font-black text-[var(--text-primary)]">
            3b. Donations
          </h4>
          <p className="text-xs text-[var(--text-muted)]">
            When you make a donation, we collect:
          </p>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {['Full name', 'Email address', 'Phone number', 'Mailing address', 'PAN number'].map((item) => (
              <span key={item} className="inline-flex items-center px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[11px] sm:text-xs font-semibold text-[var(--text-primary)]">
                • {item}
              </span>
            ))}
          </div>
        </div>

        {/* 3c. Website usage */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50/80 border border-[var(--border-color,#E2E8F0)] space-y-2">
          <h4 className="text-xs sm:text-sm font-black text-[var(--text-primary)]">
            3c. Website Usage
          </h4>
          <p className="text-xs text-[var(--text-muted)]">
            When you visit the Website, we may automatically collect:
          </p>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {['IP address', 'Browser type and version', 'Pages visited and time spent', 'Referring URL'].map((item) => (
              <span key={item} className="inline-flex items-center px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[11px] sm:text-xs font-semibold text-[var(--text-primary)]">
                • {item}
              </span>
            ))}
          </div>
          <p className="text-xs text-[var(--text-muted)] pt-1 italic">
            This information is collected through cookies and similar technologies and is used to improve Website performance and user experience. See Section 8 for our cookie policy.
          </p>
        </div>

        {/* 3d. Communications */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50/80 border border-[var(--border-color,#E2E8F0)] space-y-1.5">
          <h4 className="text-xs sm:text-sm font-black text-[var(--text-primary)]">
            3d. Communications
          </h4>
          <p className="text-xs text-[var(--text-muted)]">
            If you contact us by email or through the Website, we retain the content of your communication and your contact details for the purpose of responding to you.
          </p>
        </div>
      </div>
    ),
  },
  {
    number: 4,
    title: 'How We Use Your Information',
    icon: FileCheck2,
    content: (
      <div className="space-y-3 text-xs sm:text-sm text-[var(--text-primary)]/90 leading-relaxed font-medium">
        <p>We use personal information only for the purposes for which it was collected:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="p-3 rounded-2xl bg-orange-50/50 border border-orange-200/60">
            <strong className="block text-xs sm:text-sm font-extrabold text-[var(--orange)] mb-1">
              Event Registrations
            </strong>
            <p className="text-xs text-[var(--text-muted)] m-0">
              To process your registration, send confirmation and event details, and manage participation.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-emerald-50/50 border border-emerald-200/60">
            <strong className="block text-xs sm:text-sm font-extrabold text-emerald-700 mb-1">
              Donations
            </strong>
            <p className="text-xs text-[var(--text-muted)] m-0">
              PAN data will not be used for any other purpose and will not be shared with any third party except as required by law.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-blue-50/50 border border-blue-200/60">
            <strong className="block text-xs sm:text-sm font-extrabold text-blue-700 mb-1">
              Website Analytics
            </strong>
            <p className="text-xs text-[var(--text-muted)] m-0">
              To understand how the Website is used and to improve its performance.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-purple-50/50 border border-purple-200/60">
            <strong className="block text-xs sm:text-sm font-extrabold text-purple-700 mb-1">
              Communications
            </strong>
            <p className="text-xs text-[var(--text-muted)] m-0">
              To respond to your enquiries and, where you have consented, to send you information about Chinmaya Mission, Adoni's programmes and activities.
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    number: 5,
    title: 'Payment Data',
    icon: CreditCard,
    content: (
      <div className="space-y-3 text-xs sm:text-sm text-[var(--text-primary)]/90 leading-relaxed font-medium">
        <p>
          Chinmaya Mission, Adoni does not collect, store, or process full card numbers, CVV codes, net banking credentials, or other sensitive payment authentication data.
        </p>
        <p>
          All payment processing is handled by authorised, RBI-regulated payment aggregators that are PCI-DSS compliant. Chinmaya Mission, Adoni receives only a transaction reference and status confirmation.
        </p>
      </div>
    ),
  },
  {
    number: 6,
    title: 'Sharing of Your Information',
    icon: Share2,
    content: (
      <div className="space-y-3 text-xs sm:text-sm text-[var(--text-primary)]/90 leading-relaxed font-medium">
        <p>
          Chinmaya Mission, Adoni does not sell, rent, or trade your personal information. We share personal data only in the following limited circumstances:
        </p>
        <ul className="space-y-2 list-none p-0 m-0">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>With payment aggregators and processors, to the extent necessary to complete a transaction</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>With Chinmaya Mission, Adoni's internal teams and trusted volunteers who need access to perform their functions, subject to confidentiality obligations</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>Where required by applicable law, court order, or regulatory authority</span>
          </li>
        </ul>
      </div>
    ),
  },
  {
    number: 7,
    title: 'How Long We Keep Your Data',
    icon: Clock,
    content: (
      <div className="space-y-3 text-xs sm:text-sm text-[var(--text-primary)]/90 leading-relaxed font-medium">
        <p>
          We retain personal data for as long as necessary for the purpose it was collected, or as required by applicable law:
        </p>
        <div className="space-y-2">
          <div className="p-2.5 sm:p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
            <span className="font-bold text-[var(--text-primary)]">Event registration records:</span>
            <span className="text-[var(--text-muted)]">Up to 3 years after the event, or as required for organisational records</span>
          </div>
          <div className="p-2.5 sm:p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
            <span className="font-bold text-[var(--text-primary)]">Donation records and PAN data:</span>
            <span className="text-[var(--text-muted)]">Required under Income Tax Act for statutory reporting & audit (typically 7 years)</span>
          </div>
          <div className="p-2.5 sm:p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
            <span className="font-bold text-[var(--text-primary)]">General website analytics:</span>
            <span className="text-[var(--text-muted)]">Up to 12 months on a rolling basis</span>
          </div>
          <div className="p-2.5 sm:p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
            <span className="font-bold text-[var(--text-primary)]">Communications:</span>
            <span className="text-[var(--text-muted)]">Up to 2 years after the last communication</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    number: 8,
    title: 'Cookies',
    icon: Cookie,
    content: (
      <div className="space-y-3 text-xs sm:text-sm text-[var(--text-primary)]/90 leading-relaxed font-medium">
        <p>
          The Website uses cookies — small text files placed on your device — to improve your experience and analyse Website usage. We use:
        </p>
        <ul className="space-y-2 list-none p-0 m-0">
          <li className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <strong className="block text-[var(--text-primary)] font-bold mb-0.5">• Essential cookies:</strong>
            <span className="text-[var(--text-muted)]">Necessary for the Website to function. These cannot be disabled.</span>
          </li>
          <li className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <strong className="block text-[var(--text-primary)] font-bold mb-0.5">• Analytics cookies:</strong>
            <span className="text-[var(--text-muted)]">To understand how visitors use the Website (for example, which pages are most visited). These are anonymised and do not identify individual users.</span>
          </li>
        </ul>
        <p className="text-xs text-[var(--text-muted)] pt-1 italic">
          You can control or disable non-essential cookies through your browser settings. Please note that disabling cookies may affect your ability to use certain features of the Website.
        </p>
      </div>
    ),
  },
  {
    number: 9,
    title: 'Your Rights',
    icon: ShieldCheck,
    content: (
      <div className="space-y-3 text-xs sm:text-sm text-[var(--text-primary)]/90 leading-relaxed font-medium">
        <p>Under the DPDP Act, 2023, you have the right to:</p>
        <ul className="space-y-2 list-none p-0 m-0">
          {[
            'Access the personal data we hold about you',
            'Correct inaccurate or incomplete personal data',
            'Request erasure of your personal data, subject to applicable legal obligations',
            'Withdraw consent, where processing is based on consent (noting that withdrawal does not affect processing already carried out)',
            'Raise a grievance with Chinmaya Mission, Adoni or with the Data Protection Board of India',
          ].map((right) => (
            <li key={right} className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{right}</span>
            </li>
          ))}
        </ul>
        <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 mt-2 flex items-start gap-2.5">
          <Mail className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-900 m-0">
            To exercise any of these rights, please contact us at{' '}
            <a
              href="mailto:adoni@chinmayamission.com"
              className="font-bold underline text-[var(--orange)] hover:text-orange-700"
            >
              adoni@chinmayamission.com
            </a>
            . We will respond within the timeframe required under applicable law.
          </p>
        </div>
      </div>
    ),
  },
  {
    number: 10,
    title: 'Data Security',
    icon: Lock,
    content: (
      <div className="space-y-3 text-xs sm:text-sm text-[var(--text-primary)]/90 leading-relaxed font-medium">
        <p>
          Chinmaya Mission, Adoni implements reasonable technical and organisational measures to protect your personal data against unauthorised access, loss, misuse, or disclosure.
        </p>
        <p>
          Payment data is handled exclusively by PCI-DSS compliant aggregators and is not stored on our systems. While we take all reasonable precautions, no data transmission over the internet can be guaranteed as completely secure. You use the Website at your own risk.
        </p>
      </div>
    ),
  },
  {
    number: 11,
    title: 'Children',
    icon: Users,
    content: (
      <div className="space-y-3 text-xs sm:text-sm text-[var(--text-primary)]/90 leading-relaxed font-medium">
        <p>
          The Website is not directed at children under 18. We do not knowingly collect personal data from anyone under 18 without parental or guardian consent.
        </p>
        <p>
          If you believe a minor has provided personal data to us, please contact us and we will take steps to delete it.
        </p>
      </div>
    ),
  },
  {
    number: 12,
    title: 'Changes to This Policy',
    icon: AlertCircle,
    content: (
      <div className="space-y-3 text-xs sm:text-sm text-[var(--text-primary)]/90 leading-relaxed font-medium">
        <p>
          We may update this Privacy Policy from time to time to reflect changes in our practices or applicable law. The revised Policy will be posted on this page with an updated "Last Updated" date. We encourage you to review this page periodically.
        </p>
      </div>
    ),
  },
];

export const PrivacyPolicyPage = () => {
  useEffect(() => {
    document.title = 'Privacy Policy | Chinmaya Mission Adoni';
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

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
              <span>Back to Home Page</span>
            </Link>
          </div>

          <div className="text-center space-y-3 pt-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-orange-500/10 text-[var(--orange)] border border-orange-500/25 mx-auto">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Data Protection & Privacy</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading text-[var(--text-primary)] tracking-tight">
              Privacy Policy
            </h1>

            <p className="text-sm sm:text-base font-extrabold text-[var(--orange)] uppercase tracking-wide">
              Chinmaya Mission, Adoni
            </p>

            <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-2xl mx-auto leading-relaxed">
              We are committed to protecting your privacy and handling your personal data transparently in accordance with the Digital Personal Data Protection Act, 2023 and applicable Indian laws.
            </p>
          </div>
        </div>

        {/* 12 Sections List */}
        <div className="bg-white rounded-3xl border border-[rgba(11,35,64,0.08)] shadow-[0_1px_3px_rgba(11,35,64,0.04),0_8px_24px_rgba(11,35,64,0.06)] divide-y divide-[var(--border-color)] overflow-hidden">
          {PRIVACY_SECTIONS.map((section) => {
            const SectionIcon = section.icon;
            return (
              <div
                key={section.number}
                className="p-5 sm:p-7 hover:bg-slate-50/50 transition-colors flex items-start gap-4 sm:gap-5 group"
              >
                {/* Number Badge */}
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[var(--bg-secondary,#FFFBF5)] border border-[var(--orange)]/30 text-[var(--orange)] font-black text-xs sm:text-sm flex items-center justify-center shrink-0 shadow-xs group-hover:bg-[var(--orange)] group-hover:text-white transition-all">
                  <span>{section.number}</span>
                </div>

                {/* Section Content */}
                <div className="flex-1 min-w-0 pt-0.5 space-y-2">
                  <div className="flex items-center gap-2">
                    <SectionIcon className="w-4 h-4 text-[var(--orange)]" />
                    <h2 className="text-base sm:text-lg font-black text-[var(--text-primary)] m-0">
                      {section.title}
                    </h2>
                  </div>
                  {section.content}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default PrivacyPolicyPage;

