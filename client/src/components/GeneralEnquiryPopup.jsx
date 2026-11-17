import React, { useState, useEffect } from 'react';
import { generalEnquiryService } from '../services/api';
import {
  X,
  Send,
  CheckCircle2,
  User,
  Mail,
  Phone,
  HelpCircle,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';

export const GeneralEnquiryPopup = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobileNumber: '',
    learningGoal: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errorMsg) setErrorMsg('');
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({
      name: '',
      email: '',
      mobileNumber: '',
      learningGoal: '',
    });
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!formData.email.trim()) {
      setErrorMsg('Please enter your email ID.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setErrorMsg('Please provide a valid email ID.');
      return;
    }
    const cleanPhone = formData.mobileNumber.replace(/\D/g, '');
    if (cleanPhone.length < 6 || cleanPhone.length > 15) {
      setErrorMsg('Please provide a valid 10-digit mobile number.');
      return;
    }
    if (!formData.learningGoal.trim()) {
      setErrorMsg('Please tell us what you would like to learn.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const res = await generalEnquiryService.submitEnquiry({
        name: formData.name.trim(),
        email: formData.email.trim(),
        mobileNumber: formData.mobileNumber.trim(),
        learningGoal: formData.learningGoal.trim(),
      });

      if (res.data?.success) {
        setSubmitted(true);
      } else {
        setErrorMsg(res.data?.message || 'Failed to submit enquiry. Please try again.');
      }
    } catch (err) {
      console.error('General Enquiry submit error:', err);
      setErrorMsg(
        err.response?.data?.message ||
          'Failed to submit enquiry right now. Please check your network and try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-all animate-in fade-in duration-300"
      onClick={(e) => {
        if (e.target === e.currentTarget && onClose) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="general-enquiry-title"
    >
      <div
        className="w-full max-w-lg bg-[var(--bg-secondary,#FFF7ED)] border-2 border-orange-500/40 rounded-3xl shadow-[0_20px_60px_-15px_rgba(240,68,29,0.35),0_10px_30px_rgba(0,0,0,0.25)] overflow-hidden transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="relative px-6 py-4 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🕉️</span>
            <div>
              <h3
                id="general-enquiry-title"
                className="text-base font-black tracking-wide font-heading uppercase"
              >
                General Enquiry
              </h3>
              <p className="text-[11px] text-orange-100 font-medium">
                Chinmaya Mission, Adoni • Connect with us anytime
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Close form"
            aria-label="Close form"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6">
          {submitted ? (
            <div className="py-8 text-center space-y-4 animate-in zoom-in-95 duration-300">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 text-emerald-600 flex items-center justify-center shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-black text-[var(--text-primary,#07162D)] font-heading">
                Thank You, {formData.name}!
              </h4>
              <p className="text-xs text-[var(--text-muted,#4B5563)] max-w-sm mx-auto leading-relaxed">
                Your general enquiry has been stored successfully. Our sevaks will get in touch with you shortly.
              </p>
              <div className="flex items-center justify-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2.5 rounded-xl bg-orange-100 hover:bg-orange-200 text-orange-800 font-bold text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Submit Another Enquiry</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold text-xs transition-all cursor-pointer shadow-md"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-xs text-[var(--text-secondary,#374151)] font-medium leading-relaxed">
                Connect with Chinmaya Mission Adoni. Share your details and what you wish to learn, and our team will guide you:
              </p>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Name Field */}
              <div>
                <label className="text-xs font-bold text-[var(--text-primary,#07162D)] block mb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-orange-600" />
                  <span>
                    Name <strong className="text-red-500">*</strong>
                  </span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-orange-200 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all shadow-xs"
                />
              </div>

              {/* Email & Mobile 2-column on tablet/desktop */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Email Field */}
                <div>
                  <label className="text-xs font-bold text-[var(--text-primary,#07162D)] block mb-1 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-orange-600" />
                    <span>
                      Email ID <strong className="text-red-500">*</strong>
                    </span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-orange-200 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all shadow-xs"
                  />
                </div>

                {/* Mobile Number Field */}
                <div>
                  <label className="text-xs font-bold text-[var(--text-primary,#07162D)] block mb-1 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-orange-600" />
                    <span>
                      Mobile Number <strong className="text-red-500">*</strong>
                    </span>
                  </label>
                  <input
                    type="tel"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    placeholder="10-digit mobile number"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-orange-200 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all shadow-xs"
                  />
                </div>
              </div>

              {/* Learning Goal Textarea */}
              <div>
                <label className="text-xs font-bold text-[var(--text-primary,#07162D)] block mb-1 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-orange-600" />
                  <span>
                    What do you want to learn from this ? <strong className="text-red-500">*</strong>
                  </span>
                </label>
                <textarea
                  name="learningGoal"
                  rows={3}
                  value={formData.learningGoal}
                  onChange={handleChange}
                  placeholder="e.g. Vedanta philosophy, Bhagavad Gita chanting, Bala Vihar, Yuva Kendra activities, meditation..."
                  required
                  className="w-full p-3 rounded-xl bg-white border border-orange-200 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all shadow-xs resize-none"
                />
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-gray-300 hover:bg-gray-100 text-xs font-bold text-gray-700 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white text-xs font-black inline-flex items-center gap-2 shadow-lg shadow-orange-500/25 transition-all cursor-pointer disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Enquiry</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default GeneralEnquiryPopup;
