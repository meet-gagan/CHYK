import React, { useState, useEffect, useRef } from 'react';
import { generalEnquiryService } from '../services/api';
import {
  X,
  Send,
  CheckCircle2,
  Clock,
  Sparkles,
  User,
  Mail,
  Phone,
  HelpCircle,
  AlertCircle,
} from 'lucide-react';

export const GeneralEnquiryPopup = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobileNumber: '',
    learningGoal: '',
  });

  const [isInteracting, setIsInteracting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10); // 10 seconds countdown
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const timerRef = useRef(null);
  const intervalRef = useRef(null);

  // Check on mount: if already submitted, close immediately
  useEffect(() => {
    try {
      if (localStorage.getItem('cm_general_enquiry_submitted') === 'true') {
        if (onClose) onClose();
      }
    } catch (_) {}
  }, [onClose]);

  // 10-Second Auto-dismiss timer:
  // Runs ONLY while user is not interacting with the form.
  useEffect(() => {
    if (isInteracting || submitted) {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    // Decrement countdown each second
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Auto-dismiss after 10s if untouched
    timerRef.current = setTimeout(() => {
      if (!isInteracting && !submitted && onClose) {
        onClose();
      }
    }, 10000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isInteracting, submitted, onClose]);

  // Pause timer immediately when user interacts (focus, click, or typing)
  const handleUserInteraction = () => {
    if (!isInteracting) {
      setIsInteracting(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
  };

  const handleChange = (e) => {
    handleUserInteraction();
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errorMsg) setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    handleUserInteraction();

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
        try {
          localStorage.setItem('cm_general_enquiry_submitted', 'true');
        } catch (_) {}
        // Automatically close after 3 seconds on successful submission
        setTimeout(() => {
          if (onClose) onClose();
        }, 3200);
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
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-24 px-4 bg-black/40 backdrop-blur-[2px] transition-all animate-in fade-in duration-300"
      onClick={(e) => {
        // If clicking the dark backdrop outside the card and not yet interacting, close
        if (e.target === e.currentTarget && !isInteracting && onClose) {
          onClose();
        }
      }}
    >
      <div
        className="w-full max-w-lg bg-[var(--bg-secondary,#FFF7ED)] border-2 border-orange-500/40 rounded-3xl shadow-[0_20px_60px_-15px_rgba(240,68,29,0.35),0_10px_30px_rgba(0,0,0,0.25)] overflow-hidden transition-all duration-300"
        onMouseEnter={handleUserInteraction}
        onClick={handleUserInteraction}
      >
        {/* Top Header Bar */}
        <div className="relative px-6 py-4 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-lg">🕉️</span>
            <div>
              <h3 className="text-base font-black tracking-wide font-heading uppercase">
                General Enquiry
              </h3>
              <p className="text-[11px] text-orange-100 font-medium">
                {isInteracting
                  ? 'We are waiting for your details...'
                  : `Closing in ${timeLeft}s • Click or type to stay`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isInteracting && !submitted && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-white/20 text-white backdrop-blur-xs">
                <Clock className="w-3 h-3 animate-spin" />
                {timeLeft}s
              </span>
            )}
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition-colors cursor-pointer"
              title="Close"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 10s Countdown Progress Bar (Pauses when user interacts) */}
          {!isInteracting && !submitted && (
            <div
              className="absolute bottom-0 left-0 h-1 bg-white/70 transition-all duration-1000 ease-linear"
              style={{ width: `${(timeLeft / 10) * 100}%` }}
            />
          )}
        </div>

        {/* Content Area */}
        <div className="p-6">
          {submitted ? (
            <div className="py-8 text-center space-y-3 animate-in zoom-in-95 duration-300">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 text-emerald-600 flex items-center justify-center shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-black text-[var(--text-primary,#07162D)] font-heading">
                Thank You, {formData.name}!
              </h4>
              <p className="text-xs text-[var(--text-muted,#4B5563)] max-w-sm mx-auto leading-relaxed">
                Your general enquiry has been stored successfully. Our sevaks will get in touch with you shortly.
              </p>
              <div className="pt-2">
                <span className="text-[11px] font-bold text-orange-600 animate-pulse">
                  Closing in 3 seconds...
                </span>
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
                  <span>Name <strong className="text-red-500">*</strong></span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={handleUserInteraction}
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
                    <span>Email ID <strong className="text-red-500">*</strong></span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={handleUserInteraction}
                    placeholder="name@example.com"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-orange-200 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all shadow-xs"
                  />
                </div>

                {/* Mobile Number Field */}
                <div>
                  <label className="text-xs font-bold text-[var(--text-primary,#07162D)] block mb-1 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-orange-600" />
                    <span>Mobile Number <strong className="text-red-500">*</strong></span>
                  </label>
                  <input
                    type="tel"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    onFocus={handleUserInteraction}
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
                  onFocus={handleUserInteraction}
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
