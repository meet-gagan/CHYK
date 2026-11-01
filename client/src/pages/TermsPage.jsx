import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Award,
} from 'lucide-react';

export const TERMS_AND_CONDITIONS = [
  {
    number: 1,
    text: 'As part of the registration process, we collect essential information such as Name, Address, Email Address, Phone Number, Occupation, ID Card Details, Recent Photograph, and Blood Group. This information is used for event administration and communication purposes.',
  },
  {
    number: 2,
    text: 'Please choose the event carefully. Confirmed registrations are non-refundable, non-transferable, and cannot be modified. Please provide a valid and accessible email address, as it will be our primary mode of communication.',
  },
  {
    number: 3,
    text: 'Users of email services that filter or block messages from unknown senders should add contact@chinmayamissionadoni.org to their safe sender list.',
  },
  {
    number: 4,
    text: 'Any notice sent to the registered email address shall be deemed received by the participant.',
  },
  {
    number: 5,
    text: 'By registering, you acknowledge that running  events involve inherent risks. Participation is voluntary and at your own risk. The organizers shall not be held responsible for any injury, illness, accident, loss, or damage arising from participation.',
  },
  {
    number: 6,
    text: 'Chinmaya Mission, Adoni associated organizers shall not be liable for any loss, damage, illness, or injury resulting from participation in the Event.',
  },
  {
    number: 7,
    text: 'You confirm that all medical information provided by you is accurate and complete.',
  },
  {
    number: 8,
    text: 'You agree that your personal information may be stored and used by Chinmaya Mission, Adoni and associated organizers for event management, promotion, administration, and statistical purposes.',
  },
  {
    number: 9,
    text: "The maximum liability of Chinmaya Mission, Adoni, or Event Organizers shall be limited to the registration Done By participant’s.",
  },
  {
    number: 10,
    text: 'No cancellation, refund, or transfer of registration shall be permitted after a successful transaction.',
  },
  {
    number: 11,
    text: 'I/my ward confirm(s) that I/we are physically fit and adequately trained to participate in the Event and have obtained medical clearance where necessary.',
  },
  {
    number: 12,
    text: 'The organizers and venue owners shall not be responsible for any health issues, injuries, or medical complications occurring during or after the Event.',
  },
  {
    number: 13,
    text: 'I/we waive all claims against the Organizers Event sponsors, officials, volunteers and all associated persons or entities for any illness, injury, loss, damage, or death arising from participation in the Event.',
  },
  {
    number: 14,
    text: 'I agree to provide any medical information requested by Event officials. The organizers shall not be obligated to provide medical treatment or incur related expenses.',
  },
  {
    number: 15,
    text: 'In the event of illness, injury, medical complications, or death during or after the Event, neither the sponsors, organizers,  nor any associated persons or entities shall be held liable.',
  },
  {
    number: 16,
    text: 'In the event of illness, communicable disease, injury, death, or force majeure events including fire, riots, natural disasters, pandemics, or terrorist acts, the organizers and associated entities shall not be held liable.',
  },
  {
    number: 17,
    text: 'I/my ward understand, agree, and irrevocably permit Chinmaya Mission, Adoni to share the information provided in this application with entities associated with the Event for its organization, administration, promotion, and conduct, in accordance with applicable laws.',
  },
  {
    number: 18,
    text: 'I/my ward agree(s) to the use of photographs and videos taken during the Event by Chinmaya Mission, Adoni for promotional purposes.',
  },
  {
    number: 19,
    text: 'I/my ward agree(s) to receive information, offers, and promotional communications from the Event promoters and their authorized partners.',
  },
  {
    number: 20,
    text: 'I/my ward understand(s) and agree(s) to receive Event-related updates on the registered mobile number through WhatsApp.',
  },
  {
    number: 21,
    text: 'I/my ward agree(s) to comply with all Event rules, regulations, and instructions issued by the organizers. Failure to comply may result in disqualification.',
  },
];

export const TermsPage = () => {
  return (
    <div className="min-h-screen bg-[var(--bg-primary,#FFFDF9)] py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation & Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <Link
              to="/chinmaya-mission-adoni"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[var(--text-muted)] hover:text-[var(--orange)] transition-colors text-decoration-none group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Home</span>
            </Link>

            <a
              href="http://localhost:5175/register"
              className="btn-primary py-2 px-4 text-xs font-extrabold flex items-center gap-1.5 shadow-md hover:scale-[1.02] transition-transform text-decoration-none"
            >
              <Award className="w-3.5 h-3.5" />
              <span>REGISTER FOR MARATHON</span>
            </a>
          </div>

          <div className="text-center space-y-3 pt-2">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading text-[var(--text-primary)] tracking-tight">
              Terms & Conditions
            </h1>

            <p className="text-sm sm:text-base font-extrabold text-[var(--orange)] uppercase tracking-wide">
              Chinmaya Mission, Adoni Terms and Conditions
            </p>

            <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-2xl mx-auto leading-relaxed">
              Please review all terms, liability waivers, participant declarations, and conditions governing registration and participation in the Anti-Drug Movement Marathon Run 2026 Organized By Chinmaya Mission, Adoni
            </p>
          </div>
        </div>

        {/* 21 Terms & Conditions List */}
        <div className="bg-white rounded-3xl border border-[rgba(11,35,64,0.08)] shadow-[0_1px_3px_rgba(11,35,64,0.04),0_8px_24px_rgba(11,35,64,0.06)] divide-y divide-[var(--border-color)] overflow-hidden">
          {TERMS_AND_CONDITIONS.map((item) => (
            <div
              key={item.number}
              className="p-5 sm:p-6 hover:bg-slate-50/70 transition-colors flex items-start gap-4 sm:gap-5 group"
            >
              {/* Number Badge */}
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[var(--bg-secondary,#FFFBF5)] border border-[var(--orange)]/30 text-[var(--orange)] font-black text-xs sm:text-sm flex items-center justify-center shrink-0 shadow-xs group-hover:bg-[var(--orange)] group-hover:text-white transition-all">
                <span>{item.number}</span>
              </div>

              {/* Term Text */}
              <div className="flex-1 min-w-0 pt-0.5">
                <p className="text-xs sm:text-sm text-[var(--text-primary)]/90 font-semibold leading-relaxed m-0">
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default TermsPage;

