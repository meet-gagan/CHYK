import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { formatPhoneInput, getCleanPhoneNumber } from '../../utils/phoneUtils';
import { calculateAgeFromDob } from '../../utils/dateUtils';
import {
  X,
  LogIn,
  UserPlus,
  Phone,
  Lock,
  User,
  Calendar,
  Briefcase,
  Eye,
  EyeOff,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';

export const RegistrationAuthModal = ({
  isOpen,
  onClose,
  initialMode = 'signup',
  prefill = {},
  onAuthSuccess,
  pendingAction = 'REGISTER_NOW', // 'REGISTER_NOW' | 'INDIVIDUAL' | 'BULK'
  redirectUrl = '/register',
}) => {
  const navigate = useNavigate();
  const { login, signup } = useAuth();
  const [mode, setMode] = useState(initialMode); // 'signup' | 'login'

  // Signup form state
  const [signupForm, setSignupForm] = useState({
    fullName: '',
    phone: '',
    dob: '',
    profession: '',
    password: '',
    confirmPassword: '',
  });

  // Login form state
  const [loginForm, setLoginForm] = useState({
    phone: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  // Sync mode and prefilled data whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setError('');
      setValidationErrors({});
      setShowPassword(false);
      setShowConfirmPassword(false);

      const formattedPhone = prefill.phone ? formatPhoneInput(prefill.phone) : '';
      setSignupForm({
        fullName: prefill.fullName || '',
        phone: formattedPhone,
        dob: prefill.dob || '',
        profession: prefill.profession || '',
        password: '',
        confirmPassword: '',
      });
      setLoginForm({
        phone: formattedPhone,
        password: '',
      });
    }
  }, [isOpen, initialMode, prefill]);

  if (!isOpen) return null;

  // Handle Signup field changes
  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      setSignupForm((prev) => ({ ...prev, phone: formatPhoneInput(value) }));
    } else {
      setSignupForm((prev) => ({ ...prev, [name]: value }));
    }
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (error) setError('');
  };

  // Handle Login field changes
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      setLoginForm((prev) => ({ ...prev, phone: formatPhoneInput(value) }));
    } else {
      setLoginForm((prev) => ({ ...prev, [name]: value }));
    }
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (error) setError('');
  };

  // Validate Signup
  const validateSignup = () => {
    const errs = {};
    if (!signupForm.fullName.trim()) {
      errs.fullName = 'Full Name is required';
    }

    const cleanPhone = getCleanPhoneNumber(signupForm.phone);
    if (!cleanPhone || cleanPhone.length !== 10 || !/^[6-9]/.test(cleanPhone)) {
      errs.phone = 'Valid 10-digit Indian phone number required (starting with 6-9)';
    }

    if (!signupForm.password || signupForm.password.length < 6) {
      errs.password = 'Password must be at least 6 characters long';
    }

    if (signupForm.password !== signupForm.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }

    setValidationErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Validate Login
  const validateLogin = () => {
    const errs = {};
    const cleanPhone = getCleanPhoneNumber(loginForm.phone);
    if (!cleanPhone || cleanPhone.length !== 10 || !/^[6-9]/.test(cleanPhone)) {
      errs.phone = 'Valid 10-digit Indian phone number required (starting with 6-9)';
    }

    if (!loginForm.password) {
      errs.password = 'Please enter your password';
    }

    setValidationErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Handle Signup Submit
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateSignup()) return;

    setSubmitting(true);
    try {
      const cleanPhone = getCleanPhoneNumber(signupForm.phone);
      const calcAge = signupForm.dob ? calculateAgeFromDob(signupForm.dob) : undefined;

      const res = await signup({
        fullName: signupForm.fullName.trim(),
        phone: cleanPhone,
        dob: signupForm.dob || undefined,
        dateOfBirth: signupForm.dob || undefined,
        age: calcAge !== null ? calcAge : undefined,
        profession: signupForm.profession ? signupForm.profession.trim() : undefined,
        password: signupForm.password,
        confirmPassword: signupForm.confirmPassword,
      });

      if (res.success) {
        if (onAuthSuccess) {
          await onAuthSuccess(res.user);
        } else if (redirectUrl) {
          navigate(redirectUrl);
        }
        onClose();
      } else {
        setError(res.message || 'Failed to create account. Please try again.');
      }
    } catch (err) {
      setError(err?.message || 'An unexpected error occurred during signup.');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Login Submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateLogin()) return;

    setSubmitting(true);
    try {
      const cleanPhone = getCleanPhoneNumber(loginForm.phone);
      const res = await login({
        phone: cleanPhone,
        password: loginForm.password,
      });

      if (res.success) {
        if (onAuthSuccess) {
          await onAuthSuccess(res.user);
        } else if (redirectUrl) {
          navigate(redirectUrl);
        }
        onClose();
      } else {
        setError(res.message || 'Invalid credentials. Please verify your phone and password.');
      }
    } catch (err) {
      setError(err?.message || 'An unexpected error occurred during login.');
    } finally {
      setSubmitting(false);
    }
  };

  // Check if error suggests switching to login
  const isPhoneAlreadyRegistered =
    error &&
    (error.toLowerCase().includes('already exists') ||
      error.toLowerCase().includes('already registered'));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-md my-8 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[28px] sm:rounded-[32px] p-5 sm:p-7 shadow-2xl overflow-hidden">
        {/* Glow accent */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-[var(--orange)]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[var(--cyan)]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={submitting}
          aria-label="Close authentication modal"
          className="absolute top-4 right-4 p-2 rounded-full bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--border-color)] transition-colors disabled:opacity-50"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1.5 mb-5 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-[var(--orange)]/15 text-[var(--orange)] border border-[var(--orange)]/30">
            <Sparkles className="w-3 h-3" />
            <span>Anti-Drug Movement Marathon 2026</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black font-heading text-[var(--text-primary)] tracking-tight">
            {mode === 'signup' ? 'Create Account & Register' : 'Sign In & Register'}
          </h3>

          <p className="text-xs text-[var(--text-muted)] font-medium max-w-xs mx-auto">
            {pendingAction === 'BULK'
              ? 'Sign in or create an account to finalize your School/College batch registration'
              : mode === 'signup'
              ? 'New participant? Create your account in 30 seconds to proceed with marathon registration.'
              : 'Already have an account? Sign in with your phone and password to register.'}
          </p>
        </div>

        {/* Tabs: Create Account vs Sign In */}
        <div className="flex items-center p-1 rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] mb-5">
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setError('');
              setValidationErrors({});
            }}
            className={`w-1/2 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              mode === 'signup'
                ? 'bg-[var(--orange)] text-white shadow-md'
                : 'text-[var(--text-primary)] hover:text-[var(--orange)]'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>New User (Sign Up)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError('');
              setValidationErrors({});
            }}
            className={`w-1/2 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              mode === 'login'
                ? 'bg-[var(--orange)] text-white shadow-md'
                : 'text-[var(--text-primary)] hover:text-[var(--orange)]'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Existing User (Login)</span>
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-2xl bg-red-500/10 border border-red-500/30 text-xs text-red-500 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span>{error}</span>
              {isPhoneAlreadyRegistered && (
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setLoginForm((prev) => ({
                      ...prev,
                      phone: signupForm.phone || prev.phone,
                    }));
                    setError('');
                  }}
                  className="mt-1 block font-bold underline hover:text-red-400"
                >
                  Click here to Switch to Sign In →
                </button>
              )}
            </div>
          </div>
        )}

        {/* MODE: SIGN UP (CREATE ACCOUNT) */}
        {mode === 'signup' && (
          <form onSubmit={handleSignupSubmit} className="space-y-3.5">
            {/* Full Name */}
            <div>
              <label className="block text-[11px] font-bold text-[var(--text-primary)] uppercase tracking-wider mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-muted)]">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  name="fullName"
                  value={signupForm.fullName}
                  onChange={handleSignupChange}
                  placeholder="e.g. Rahul Sharma"
                  className={`w-full pl-9 pr-3 py-2 rounded-xl bg-[var(--bg-tertiary)] border text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--orange)] transition-colors ${
                    validationErrors.fullName ? 'border-red-500' : 'border-[var(--border-color)]'
                  }`}
                />
              </div>
              {validationErrors.fullName && (
                <p className="text-[10px] text-red-500 font-bold mt-1">
                  {validationErrors.fullName}
                </p>
              )}
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-[11px] font-bold text-[var(--text-primary)] uppercase tracking-wider mb-1">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-muted)] font-bold text-xs">
                  +91
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={signupForm.phone}
                  onChange={handleSignupChange}
                  placeholder="98765 43210"
                  maxLength={11}
                  className={`w-full pl-11 pr-3 py-2 rounded-xl bg-[var(--bg-tertiary)] border text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--orange)] transition-colors ${
                    validationErrors.phone ? 'border-red-500' : 'border-[var(--border-color)]'
                  }`}
                />
              </div>
              {validationErrors.phone && (
                <p className="text-[10px] text-red-500 font-bold mt-1">
                  {validationErrors.phone}
                </p>
              )}
            </div>

            {/* Password & Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-[var(--text-primary)] uppercase tracking-wider mb-1">
                  Set Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-muted)]">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={signupForm.password}
                    onChange={handleSignupChange}
                    placeholder="Min 6 chars"
                    className={`w-full pl-8 pr-8 py-2 rounded-xl bg-[var(--bg-tertiary)] border text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--orange)] transition-colors ${
                      validationErrors.password ? 'border-red-500' : 'border-[var(--border-color)]'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
                {validationErrors.password && (
                  <p className="text-[10px] text-red-500 font-bold mt-1">
                    {validationErrors.password}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[var(--text-primary)] uppercase tracking-wider mb-1">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-muted)]">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={signupForm.confirmPassword}
                    onChange={handleSignupChange}
                    placeholder="Re-enter password"
                    className={`w-full pl-8 pr-8 py-2 rounded-xl bg-[var(--bg-tertiary)] border text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--orange)] transition-colors ${
                      validationErrors.confirmPassword ? 'border-red-500' : 'border-[var(--border-color)]'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  >
                    {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
                {validationErrors.confirmPassword && (
                  <p className="text-[10px] text-red-500 font-bold mt-1">
                    {validationErrors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full justify-center py-3 text-xs sm:text-sm font-extrabold shadow-lg flex items-center gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Creating Account & Submitting...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Create Account & Finalize Registration</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>

            <div className="text-center pt-1">
              <span className="text-[11px] text-[var(--text-muted)]">
                Already registered previously?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setError('');
                  }}
                  className="font-bold text-[var(--orange)] hover:underline"
                >
                  Sign In instead
                </button>
              </span>
            </div>
          </form>
        )}

        {/* MODE: SIGN IN (LOGIN) */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-3.5">
            {/* Mobile Number */}
            <div>
              <label className="block text-[11px] font-bold text-[var(--text-primary)] uppercase tracking-wider mb-1">
                Registered Mobile Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-muted)] font-bold text-xs">
                  +91
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={loginForm.phone}
                  onChange={handleLoginChange}
                  placeholder="98765 43210"
                  maxLength={11}
                  className={`w-full pl-11 pr-3 py-2 rounded-xl bg-[var(--bg-tertiary)] border text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--orange)] transition-colors ${
                    validationErrors.phone ? 'border-red-500' : 'border-[var(--border-color)]'
                  }`}
                />
              </div>
              {validationErrors.phone && (
                <p className="text-[10px] text-red-500 font-bold mt-1">
                  {validationErrors.phone}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-[11px] font-bold text-[var(--text-primary)] uppercase tracking-wider mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-muted)]">
                  <Lock className="w-3.5 h-3.5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={loginForm.password}
                  onChange={handleLoginChange}
                  placeholder="Enter your account password"
                  className={`w-full pl-8 pr-8 py-2 rounded-xl bg-[var(--bg-tertiary)] border text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--orange)] transition-colors ${
                    validationErrors.password ? 'border-red-500' : 'border-[var(--border-color)]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
              {validationErrors.password && (
                <p className="text-[10px] text-red-500 font-bold mt-1">
                  {validationErrors.password}
                </p>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full justify-center py-3 text-xs sm:text-sm font-extrabold shadow-lg flex items-center gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Signing In & Submitting...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Sign In & Finalize Registration</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>

            <div className="text-center pt-1">
              <span className="text-[11px] text-[var(--text-muted)]">
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setError('');
                  }}
                  className="font-bold text-[var(--orange)] hover:underline"
                >
                  Create one now
                </button>
              </span>
            </div>
          </form>
        )}

        {/* Security badge note */}
        <div className="mt-4 pt-3 border-t border-[var(--border-color)] flex items-center justify-center gap-2 text-[10px] text-[var(--text-muted)]">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          <span>Your data is stored securely for Chinmaya Yuva Kendra events.</span>
        </div>
      </div>
    </div>
  );
};

export default RegistrationAuthModal;

