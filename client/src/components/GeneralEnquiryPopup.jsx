import React, { useState, useEffect, useRef } from 'react';
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
  Clock,
} from 'lucide-react';

export const GeneralEnquiryPopup = ({ onClose, onUserInteracted, isAutoOpened }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobileNumber: '',
    learningGoal: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [timerSeconds, setTimerSeconds] = useState(isAutoOpened ? 10 : null);
  const popupRef = useRef(null);

  // 10s countdown timer on the left side of the X mark for auto-opened popup
  useEffect(() => {
    if (!isAutoOpened) {
      setTimerSeconds(null);
      return;
    }

    setTimerSeconds(10);
    const interval = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev === null) return null;
        if (prev <= 1) {
          clearInterval(interval);
          if (onClose) onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isAutoOpened, onClose]);

  const handleInteraction = () => {
    // Cancel the countdown timer when the user focuses or interacts with the form
    setTimerSeconds(null);
    if (onUserInteracted) onUserInteracted();
  };

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

  // Close on outside click while keeping the rest of the website visible and interactive
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        if (onClose) onClose();
      }
    };

    const timer = setTimeout(() => {
      document.addEventListener('pointerdown', handleOutsideClick);
    }, 150);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('pointerdown', handleOutsideClick);
    };
  }, [onClose]);

  const handleChange = (e) => {
    handleInteraction();
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
    if (onUserInteracted) onUserInteracted();

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
      setErrorMsg('Please tell us what you would like to know more about.');
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
        // Persist submitted flag so it won't auto pop-up on future visits
        try {
          localStorage.setItem('chinmaya_general_enquiry_submitted', 'true');
        } catch (_) {}
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
      ref={popupRef}
      onFocus={handleInteraction}
      onClick={handleInteraction}
      className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 w-[calc(100vw-32px)] sm:w-[410px] max-h-[85vh] bg-[var(--bg-secondary,#FFF7ED)] border-2 border-orange-500 rounded-2xl sm:rounded-3xl shadow-[0_20px_50px_-10px_rgba(240,68,29,0.35),0_10px_25px_rgba(0,0,0,0.25)] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 slide-in-from-bottom-5 duration-200"
      role="dialog"
      aria-modal="false"
      aria-labelledby="general-enquiry-title"
    >
      {/* Top Header Bar */}
      <div className="relative px-5 py-3.5 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 text-white flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <span className="text-lg">🕉️</span>
          <div>
            <h3
              id="general-enquiry-title"
              className="text-sm sm:text-base font-black tracking-wide font-heading uppercase"
            >
              General Enquiry
            </h3>
            <p className="text-[10.5px] text-orange-100 font-medium leading-tight">
              Chinmaya Mission, Adoni • Connect with us
            </p>
          </div>
        </div>

        {/* Right side controls: 10s timer on the left side of the X mark */}
        <div className="flex items-center gap-2">
          {timerSeconds !== null && timerSeconds > 0 && (
            <div
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/30 border border-white/25 text-white font-mono font-bold text-xs shadow-inner select-none"
              title={`This popup will auto-close in ${timerSeconds} seconds`}
              aria-label={`Popup will auto-close in ${timerSeconds} seconds`}
            >
              <Clock className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>{timerSeconds}s</span>
            </div>
          )}

          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Close enquiry form"
            aria-label="Close enquiry form"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 sm:p-5 overflow-y-auto space-y-4 max-h-[calc(85vh-56px)]">
        {submitted ? (
          <div className="py-6 text-center space-y-3.5 animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/20 text-emerald-600 flex items-center justify-center shadow-inner">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h4 className="text-lg font-black text-[var(--text-primary,#07162D)] font-heading">
              Thank You, {formData.name}!
            </h4>
            <p className="text-xs text-[var(--text-muted,#4B5563)] max-w-sm mx-auto leading-relaxed">
              Your general enquiry has been stored successfully. Our sevaks will get in touch with you shortly.
            </p>
            <div className="flex items-center justify-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={handleReset}
                className="px-3.5 py-2 rounded-xl bg-orange-100 hover:bg-orange-200 text-orange-800 font-bold text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Submit Another</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold text-xs transition-all cursor-pointer shadow-md"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <p className="text-xs text-[var(--text-secondary,#374151)] font-medium leading-relaxed">
              Connect with Chinmaya Mission, Adoni. Share your details and what you wish to learn, and our team will guide you:
            </p>

            {errorMsg && (
              <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 text-xs font-semibold flex items-center gap-2">
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
                onFocus={onUserInteracted}
                placeholder="Enter your full name"
                required
                className="w-full px-3.5 py-2 rounded-xl bg-white border border-orange-200 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all shadow-xs"
              />
            </div>

            {/* Email & Mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                  onFocus={onUserInteracted}
                  placeholder="name@example.com"
                  required
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-orange-200 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all shadow-xs"
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
                  onFocus={onUserInteracted}
                  placeholder="10-digit mobile number"
                  required
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-orange-200 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all shadow-xs"
                />
              </div>
            </div>

            {/* Question Textarea */}
            <div>
              <label className="text-xs font-bold text-[var(--text-primary,#07162D)] block mb-1 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-orange-600" />
                <span>
                  What would you like to know more about? <strong className="text-red-500">*</strong>
                </span>
              </label>
              <textarea
                name="learningGoal"
                rows={2.5}
                value={formData.learningGoal}
                onChange={handleChange}
                onFocus={onUserInteracted}
                placeholder="e.g. Vedanta philosophy, Bhagavad Gita chanting, Bala Vihar, Yuva Kendra activities, meditation..."
                required
                className="w-full p-2.5 rounded-xl bg-white border border-orange-200 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all shadow-xs resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-xl border border-gray-300 hover:bg-gray-100 text-xs font-bold text-gray-700 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white text-xs font-black inline-flex items-center gap-2 shadow-md shadow-orange-500/25 transition-all cursor-pointer disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
  );
};

export default GeneralEnquiryPopup;
