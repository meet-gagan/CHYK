import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import { registrationService, eventService, webContentService } from '../services/api';
import { SearchableSelect } from '../components/SearchableSelect';
import { EntryPassModal } from '../components/EntryPassModal';
import { RegistrationAuthModal } from '../components/auth/RegistrationAuthModal';
import { MarathonRouteMap } from '../components/MarathonRouteMap';
import { adoniInstitutionsList } from '../utils/constants';
import { formatPhoneInput, getCleanPhoneNumber } from '../utils/phoneUtils';
import { calculateAgeFromDob, getMaxDobDate } from '../utils/dateUtils';
import {
  Award,
  CheckCircle,
  FileSpreadsheet,
  Download,
  Upload,
  User,
  Users,
  Building,
  AlertCircle,
  Phone,
  Calendar,
  Briefcase,
  GraduationCap,
  Shirt,
  Sparkles,
  ShieldCheck,
  LogIn,
  UserPlus,
  Trash2,
  HelpCircle,
  MapPin,
} from 'lucide-react';

export const RegistrationPage = () => {
  const { user, isAuthenticated, isUserAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [tab, setTab] = useState('INDIVIDUAL'); // 'INDIVIDUAL' | 'BULK'

  const [institutions, setInstitutions] = useState(adoniInstitutionsList);
  const [eventConfig, setEventConfig] = useState(null);

  // Participant 1 (Primary User) Form State
  const [indForm, setIndForm] = useState({
    fullName: '',
    dob: '',
    age: '',
    standard: '',
    profession: '',
    isStudent: false,
    institutionName: '',
    otherInstitution: '',
    contactNumber: '',
    tShirtSize: 'M',
    agreeTerms: false,
  });
  const [indErrors, setIndErrors] = useState({});

  // Add Friends Feature State (Supports 1 to 5 participants)
  const createBlankFriend = () => ({
    fullName: '',
    dob: '',
    age: '',
    standard: '',
    profession: '',
    isStudent: false,
    institutionName: '',
    otherInstitution: '',
    contactNumber: '',
    tShirtSize: 'M',
    agreeTerms: false,
  });

  const [hasFriends, setHasFriends] = useState(false);
  const [friendsCount, setFriendsCount] = useState(1);
  const [friendsList, setFriendsList] = useState([createBlankFriend()]);
  const [friendsErrors, setFriendsErrors] = useState([{}]);

  const [indSubmitting, setIndSubmitting] = useState(false);

  // Bulk Form State (School & College Coordinators)
  const [bulkForm, setBulkForm] = useState({
    contactPersonName: '',
    phone: '',
    institutionType: 'SCHOOL',
    institutionName: '',
    otherInstitution: '',
  });
  const [bulkFile, setBulkFile] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [bulkParsing, setBulkParsing] = useState(false);
  const [bulkSubmitting, setBulkSubmitting] = useState(false);
  const [bulkStatus, setBulkStatus] = useState({ success: false, message: null, error: null });

  // Receipt / Entry Pass Modal State
  const [receiptData, setReceiptData] = useState(null);

  // Auth Modal State (Triggered upon submitting if unauthenticated)
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('signup'); // 'signup' | 'login'
  const [pendingSubmitType, setPendingSubmitType] = useState(null); // 'INDIVIDUAL' | 'BULK'

  // Helper to persist in-progress form inputs to sessionStorage
  const saveFormToSession = () => {
    try {
      sessionStorage.setItem(
        'chyk_marathon_pending_reg',
        JSON.stringify({
          tab,
          indForm,
          hasFriends,
          friendsCount,
          friendsList,
          bulkForm,
        })
      );
    } catch (_) {}
  };

  // Dynamic CMS Content for Registration Guidelines
  const [regContent, setRegContent] = useState(() => {
    try {
      const cached = localStorage.getItem('cached_cms_marathon_registration');
      if (cached) return JSON.parse(cached)?.fieldsMap?.reg_guidelines || null;
    } catch (_) {}
    return null;
  });

  useEffect(() => {
    if (location.hash === '#marathon-map') {
      const scrollToMap = () => {
        const el = document.getElementById('marathon-map');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      };
      scrollToMap();
      const t1 = setTimeout(scrollToMap, 150);
      const t2 = setTimeout(scrollToMap, 450);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    } else {
      window.scrollTo(0, 0);
    }

    // Fetch Event Config & Institutions list
    eventService.getConfig().then((res) => {
      if (res.data?.success) setEventConfig(res.data.data);
    }).catch(() => {});

    registrationService.getInstitutions().then((res) => {
      if (res.data?.success && res.data.data.length > 0) {
        setInstitutions(res.data.data);
      }
    }).catch(() => {});

    // Fetch Dynamic Content for Registration
    webContentService.getPublicPage('marathon', 'registration').then((res) => {
      if (res.data?.success && res.data?.data) {
        try { localStorage.setItem('cached_cms_marathon_registration', JSON.stringify(res.data.data)); } catch (_) {}
        setRegContent(res.data.data.fieldsMap?.reg_guidelines || null);
      }
    }).catch(() => {});
  }, [location.hash]);

  // Restore any saved form data from previous session (e.g. if user opened standalone login/signup)
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('chyk_marathon_pending_reg');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.tab) setTab(parsed.tab);
        if (parsed.indForm && typeof parsed.indForm === 'object') {
          setIndForm((prev) => ({ ...prev, ...parsed.indForm }));
        }
        if (parsed.hasFriends !== undefined) setHasFriends(Boolean(parsed.hasFriends));
        if (parsed.friendsCount) setFriendsCount(Number(parsed.friendsCount) || 1);
        if (Array.isArray(parsed.friendsList) && parsed.friendsList.length > 0) {
          setFriendsList(parsed.friendsList);
          setFriendsErrors(parsed.friendsList.map(() => ({})));
        }
        if (parsed.bulkForm && typeof parsed.bulkForm === 'object') {
          setBulkForm((prev) => ({ ...prev, ...parsed.bulkForm }));
        }
      }
    } catch (_) {}
  }, []);

  // Pre-fill Participant 1 fields from authenticated user session
  useEffect(() => {
    if (user && typeof user === 'object') {
      let userDob = '';
      if (user.dob && typeof user.dob === 'string') {
        userDob = user.dob.split('T')[0];
      } else if (user.dateOfBirth) {
        try {
          const d = new Date(user.dateOfBirth);
          if (!isNaN(d.getTime())) {
            userDob = d.toISOString().split('T')[0];
          }
        } catch (_) {}
      }

      const userAge = userDob ? calculateAgeFromDob(userDob) : (user.age ? String(user.age) : '');
      setIndForm((prev) => ({
        ...prev,
        fullName: prev.fullName || user.fullName || '',
        dob: prev.dob || userDob || '',
        age: prev.age || (userAge ? String(userAge) : ''),
        profession: prev.profession || user.profession || '',
        contactNumber: prev.contactNumber || (user.phone ? formatPhoneInput(user.phone) : ''),
      }));
      setBulkForm((prev) => ({
        ...prev,
        contactPersonName: prev.contactPersonName || user.fullName || '',
        phone: prev.phone || (user.phone ? formatPhoneInput(user.phone) : ''),
      }));
    }
  }, [user]);

  const isPastDeadline = eventConfig?.registrationEndDate
    ? new Date() > new Date(eventConfig.registrationEndDate)
    : false;
  const isRegistrationOpen = eventConfig
    ? eventConfig.registrationOpen && !isPastDeadline
    : true;

  // Validate Participant 1 Form
  const validateParticipant1 = () => {
    const errs = {};
    if (!indForm.fullName.trim()) errs.fullName = 'Full Name is required for certificate';

    const cleanPhone = getCleanPhoneNumber(indForm.contactNumber);
    if (cleanPhone.length !== 10 || !/^[6-9]/.test(cleanPhone)) {
      errs.contactNumber = 'Valid 10-digit Indian mobile number required (starting with 6-9)';
    }

    if (indForm.isStudent) {
      if (!indForm.institutionName) {
        errs.institutionName = 'Please select your School/College';
      } else if (indForm.institutionName === 'OTHER' && !indForm.otherInstitution.trim()) {
        errs.otherInstitution = 'Please enter your institution name';
      }
    }

    if (!indForm.agreeTerms) errs.agreeTerms = 'Please click on the Terms And Conditions to accept before submitting.';

    setIndErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Handle participant count change via dropdown (1 to 5)
  const handleFriendsCountChange = (newCount) => {
    const count = parseInt(newCount, 10);
    if (isNaN(count) || count < 1 || count > 5) return;

    if (count < friendsList.length) {
      const removedFriendsHaveData = friendsList.slice(count).some((f) =>
        f.fullName.trim() || f.contactNumber.trim() || f.profession.trim() || f.dob?.trim() || f.age?.trim()
      );
      if (removedFriendsHaveData) {
        const confirmDecrease = window.confirm(
          `Reducing to ${count} ${count === 1 ? 'participant' : 'participants'} will clear details entered for additional members. Do you want to proceed?`
        );
        if (!confirmDecrease) return;
      }
    }

    setFriendsCount(count);
    setFriendsList((prev) => {
      if (count > prev.length) {
        const added = Array.from({ length: count - prev.length }, () => createBlankFriend());
        return [...prev, ...added];
      } else {
        return prev.slice(0, count);
      }
    });
    setFriendsErrors((prev) => {
      if (count > prev.length) {
        const addedErrors = Array.from({ length: count - prev.length }, () => ({}));
        return [...prev, ...addedErrors];
      } else {
        return prev.slice(0, count);
      }
    });
  };

  // Update specific participant's field
  const updateFriendField = (index, field, value) => {
    setFriendsList((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
    if (friendsErrors[index]?.[field]) {
      setFriendsErrors((prev) => {
        const updated = [...prev];
        updated[index] = { ...updated[index], [field]: undefined };
        return updated;
      });
    }
  };

  // Remove all participants with confirmation
  const handleRemoveAllFriends = () => {
    const hasData = friendsList.some((f) =>
      f.fullName.trim() || f.contactNumber.trim() || f.profession.trim() || f.dob?.trim() || f.age?.trim()
    );

    if (hasData) {
      const confirmRemove = window.confirm(
        'Are you sure you want to remove all additional participants? Any entered details will be cleared.'
      );
      if (!confirmRemove) return;
    }

    setHasFriends(false);
    setFriendsCount(1);
    setFriendsList([createBlankFriend()]);
    setFriendsErrors([{}]);
  };

  // Remove a single participant at specific index
  const handleRemoveFriendAtIndex = (idx) => {
    if (friendsList.length <= 1) {
      handleRemoveAllFriends();
      return;
    }

    const f = friendsList[idx];
    if (f.fullName.trim() || f.contactNumber.trim() || f.dob?.trim() || f.age?.trim() || f.profession.trim()) {
      const confirmRemove = window.confirm(
        `Are you sure you want to remove Participant ${idx + 2} (${f.fullName.trim() || 'Participant'})?`
      );
      if (!confirmRemove) return;
    }

    const updated = friendsList.filter((_, i) => i !== idx);
    setFriendsList(updated);
    setFriendsCount(updated.length);
    setFriendsErrors((prev) => prev.filter((_, i) => i !== idx));
  };

  // Validate All Participants Form
  const validateFriends = () => {
    let isValid = true;
    const newErrors = [];

    friendsList.forEach((f, idx) => {
      const errs = {};
      const participantLabel = `Participant ${idx + 2}`;
      if (!f.fullName.trim()) errs.fullName = `${participantLabel}'s Full Name is required for certificate`;

      const cleanPhone = getCleanPhoneNumber(f.contactNumber);
      if (cleanPhone.length !== 10 || !/^[6-9]/.test(cleanPhone)) {
        errs.contactNumber = 'Valid 10-digit Indian mobile number required (starting with 6-9)';
      }

      if (f.isStudent) {
        if (!f.institutionName) {
          errs.institutionName = `Please select ${participantLabel}'s School/College`;
        } else if (f.institutionName === 'OTHER' && !f.otherInstitution.trim()) {
          errs.otherInstitution = `Please enter ${participantLabel}'s institution name`;
        }
      }

      if (!f.agreeTerms) errs.agreeTerms = `Please click on the Terms And Conditions on behalf of ${participantLabel} before submitting.`;

      if (Object.keys(errs).length > 0) {
        isValid = false;
      }
      newErrors.push(errs);
    });

    setFriendsErrors(newErrors);
    return isValid;
  };

  // Core Individual or Group Registration Submission Logic
  const executeIndividualSubmit = async () => {
    setIndSubmitting(true);
    try {
      const finalPrimaryInstitution =
        indForm.isStudent
          ? indForm.institutionName === 'OTHER'
            ? indForm.otherInstitution
            : indForm.institutionName
          : 'N/A';

      const primaryAge = indForm.dob
        ? calculateAgeFromDob(indForm.dob)
        : (indForm.age ? parseInt(indForm.age, 10) : undefined);

      if (hasFriends && friendsList.length > 0) {
        // Group registration submission (Primary + 1 to 5 friends)
        const formattedFriends = friendsList.map((f) => {
          const friendAge = f.dob
            ? calculateAgeFromDob(f.dob)
            : (f.age ? parseInt(f.age, 10) : undefined);
          return {
            fullName: f.fullName.trim(),
            dob: f.dob || undefined,
            dateOfBirth: f.dob || undefined,
            age: friendAge,
            standard: f.standard || undefined,
            profession: f.profession ? f.profession.trim() : undefined,
            isStudent: f.isStudent,
            institutionName: f.isStudent
              ? f.institutionName === 'OTHER'
                ? f.otherInstitution
                : f.institutionName
              : 'N/A',
            contactNumber: f.contactNumber,
            tShirtSize: f.tShirtSize,
          };
        });

        const payload = {
          primary: {
            fullName: indForm.fullName.trim(),
            dob: indForm.dob || undefined,
            dateOfBirth: indForm.dob || undefined,
            age: primaryAge,
            standard: indForm.standard || undefined,
            profession: indForm.profession ? indForm.profession.trim() : undefined,
            isStudent: indForm.isStudent,
            institutionName: finalPrimaryInstitution,
            contactNumber: indForm.contactNumber,
            tShirtSize: indForm.tShirtSize,
          },
          friends: formattedFriends,
          // Single friend fallback for backward compatibility
          friend: formattedFriends[0],
        };

        const res = await registrationService.submitIndividual(payload);
        if (res.data?.success) {
          confetti({
            particleCount: 160,
            spread: 90,
            origin: { y: 0.6 },
          });

          setReceiptData(res.data.data);
          try { sessionStorage.removeItem('chyk_marathon_pending_reg'); } catch (_) {}

          // Reset friends form
          setHasFriends(false);
          setFriendsCount(1);
          setFriendsList([createBlankFriend()]);
          setIndErrors({});
          setFriendsErrors([{}]);
        }
      } else {
        // Single participant submission
        const payload = {
          fullName: indForm.fullName.trim(),
          dob: indForm.dob || undefined,
          dateOfBirth: indForm.dob || undefined,
          age: primaryAge,
          standard: indForm.standard || undefined,
          profession: indForm.profession ? indForm.profession.trim() : undefined,
          isStudent: indForm.isStudent,
          institutionName: finalPrimaryInstitution,
          contactNumber: indForm.contactNumber,
          tShirtSize: indForm.tShirtSize,
        };

        const res = await registrationService.submitForm(payload);
        if (res.data?.success) {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });

          setReceiptData(res.data.data);
          try { sessionStorage.removeItem('chyk_marathon_pending_reg'); } catch (_) {}
          setIndErrors({});
        }
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Registration submission failed. Please try again.');
    } finally {
      setIndSubmitting(false);
      setPendingSubmitType(null);
    }
  };

  // Submit Registration Entry Point (Individual or Group)
  const handleIndividualSubmit = async (e) => {
    if (e) e.preventDefault();

    const p1Valid = validateParticipant1();
    let pFriendsValid = true;

    if (hasFriends) {
      pFriendsValid = validateFriends();
    }

    if (!p1Valid || !pFriendsValid) {
      if (!indForm.agreeTerms) {
        showNotice('error', 'Please click on the Terms And Conditions before you can submit.');
        const termsEl = document.getElementById('terms-checkbox-section');
        if (termsEl) {
          termsEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      } else {
        showNotice('error', 'Please complete all required fields correctly before submitting.');
      }
      return;
    }

    // If user is not signed in / logged in, prompt Auth Modal first!
    if (!isUserAuthenticated && !user) {
      saveFormToSession();
      setPendingSubmitType('INDIVIDUAL');
      setAuthModalMode('signup');
      setAuthModalOpen(true);
      return;
    }

    await executeIndividualSubmit();
  };

  // Bulk File Upload & Client Parse
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setBulkFile(file);
    setBulkParsing(true);
    setBulkStatus({ success: false, message: null, error: null });

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await registrationService.parseFile(formData);
      if (res.data?.success) {
        setParsedData(res.data.data);
      }
    } catch (err) {
      setBulkStatus({
        success: false,
        message: null,
        error: err.response?.data?.message || 'Failed to parse file preview',
      });
    } finally {
      setBulkParsing(false);
    }
  };

  // Download Sample Excel/CSV Template
  const downloadSampleTemplate = () => {
    const csvContent =
      'Student Name,Age,Standard / Class,Parent\'s Phone Number,School / College\n' +
      'Dummy Name 1,13,8th,9999999999,XYZ High School\n' +
      'Dummy Name 2,14,9th,9999999999,ABC Public School\n' +
      'Dummy Name 3,15,10th,9999999999,PQR High School\n' +
      'Dummy Name 4,13,8th,9999999999,Sunrise High School\n' +
      'Dummy Name 5,14,9th,9999999999,Green Valley School\n';

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Anti_Drug_Marathon_Student_Bulk_Template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Core Bulk Batch Registration Submission Logic
  const executeBulkSubmit = async () => {
    setBulkSubmitting(true);
    setBulkStatus({ success: false, message: null, error: null });

    try {
      const cleanPhone = getCleanPhoneNumber(bulkForm.phone);
      const finalBulkInstitution =
        bulkForm.institutionName === 'OTHER'
          ? (bulkForm.otherInstitution || '').trim()
          : (bulkForm.institutionName || '').trim();

      const formData = new FormData();
      formData.append('contactPersonName', bulkForm.contactPersonName.trim());
      formData.append('phone', cleanPhone);
      formData.append('institutionType', bulkForm.institutionType);
      formData.append('institutionName', finalBulkInstitution);
      formData.append('file', bulkFile);
      if (parsedData?.preview) {
        formData.append(
          'studentsData',
          JSON.stringify(parsedData.preview.filter((row) => row.isValid))
        );
      }

      const res = await registrationService.submitBulk(formData);
      if (res.data?.success) {
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
        setBulkStatus({
          success: true,
          message:
            res.data.message ||
            `Successfully submitted ${parsedData?.validRows || ''} student registrations!`,
          error: null,
        });

        try { sessionStorage.removeItem('chyk_marathon_pending_reg'); } catch (_) {}
        // Reset
        setBulkFile(null);
        setParsedData(null);
      }
    } catch (err) {
      setBulkStatus({
        success: false,
        message: null,
        error: err.response?.data?.message || 'Bulk registration submission failed.',
      });
    } finally {
      setBulkSubmitting(false);
      setPendingSubmitType(null);
    }
  };

  // Submit Bulk Batch Entry Point
  const handleBulkSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!isRegistrationOpen) {
      alert('Marathon registration is currently closed by the organizers.');
      return;
    }
    if (!bulkForm.contactPersonName.trim()) {
      alert('Please enter Contact Person Name');
      return;
    }
    const cleanPhone = getCleanPhoneNumber(bulkForm.phone);
    if (cleanPhone.length !== 10 || !/^[6-9]/.test(cleanPhone)) {
      alert('Please enter a valid 10-digit Indian phone number starting with 6-9');
      return;
    }
    const finalBulkInstitution =
      bulkForm.institutionName === 'OTHER'
        ? (bulkForm.otherInstitution || '').trim()
        : (bulkForm.institutionName || '').trim();

    if (!finalBulkInstitution) {
      alert(
        bulkForm.institutionName === 'OTHER'
          ? 'Please specify your School or College Name'
          : 'Please select or enter School or College Name'
      );
      return;
    }
    if (!bulkFile) {
      alert('Please upload a spreadsheet file (.xlsx, .xls, .csv) with student records');
      return;
    }
    if (parsedData && parsedData.validRows === 0) {
      alert('The uploaded spreadsheet does not contain any valid student rows. Please check the file.');
      return;
    }

    // If user is not signed in / logged in, prompt Auth Modal first!
    if (!isUserAuthenticated && !user) {
      saveFormToSession();
      setPendingSubmitType('BULK');
      setAuthModalMode('signup');
      setAuthModalOpen(true);
      return;
    }

    await executeBulkSubmit();
  };

  // Callback after the user successfully signs up or logs in via the Auth Modal
  const handleAuthSuccess = async () => {
    // Small delay so auth context state fully propagates
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Auto-submit the pending registration now that the user is authenticated
    if (pendingSubmitType === 'INDIVIDUAL') {
      await executeIndividualSubmit();
    } else if (pendingSubmitType === 'BULK') {
      await executeBulkSubmit();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pt-2 sm:pt-4 pb-14 space-y-6 sm:space-y-8">
      
      {/* Page Header */}
      <div className="text-center space-y-3">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full font-extrabold text-xs tracking-widest uppercase bg-[var(--orange)]/15 text-[var(--orange)] border border-[var(--orange)]/30">
            <Sparkles className="w-3.5 h-3.5" />
            {regContent?.subtitle || 'CHINMAYA YUVA KENDRA, ADONI'}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-heading text-[var(--text-primary)]">
          {regContent?.title ? (
            regContent.title
          ) : (
            <>MARATHON <span className="text-[var(--orange)]">REGISTRATION</span></>
          )}
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-muted)] font-medium max-w-xl mx-auto">
          {regContent?.guidelines || (
            <>Last date of registration is <strong className="text-[var(--text-primary)] font-bold">30 November 2026 (30/11/2026)</strong>. Details will be used to generate your official marathon pass and certificate.</>
          )}
        </p>

        {/* User Session Banner (Logged in vs Open guest) */}
        {isUserAuthenticated && user ? (
          <div className="p-4 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center font-black text-sm">
                {user?.fullName?.charAt(0) || '✓'}
              </div>
              <div className="text-left">
                <span className="font-bold text-[var(--text-primary)]">Logged in as {user?.fullName}</span>
                <span className="text-[var(--text-muted)] block text-[11px]">+91 {user?.phone} • Your pass will be saved to My Passes</span>
              </div>
            </div>
            <Link
              to="/my-activity"
              className="px-3.5 py-1.5 rounded-xl bg-emerald-500 text-white font-bold text-[11px] hover:bg-emerald-600 transition-colors text-decoration-none whitespace-nowrap"
            >
              My Passes & Activity →
            </Link>
          </div>
        ) : (
          <div className="p-4 sm:p-5 rounded-3xl bg-[var(--bg-secondary)] border-2 border-[var(--orange)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs shadow-lg">
            <div className="flex items-center gap-3.5 text-left">
              <div className="w-10 h-10 rounded-2xl bg-[var(--orange)]/15 border border-[var(--orange)]/30 text-[var(--orange)] flex items-center justify-center font-black text-sm shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-[var(--text-primary)] text-sm block">
                  Sign In or Sign Up Required to Register
                </span>
                <span className="text-[var(--text-muted)] text-xs block mt-0.5">
                  Please create an account or sign in to complete your marathon registration and link your entry pass.
                </span>
                <Link
                  to="/route-map"
                  className="inline-flex items-center gap-1.5 text-[var(--cyan)] font-extrabold text-[11px] hover:underline mt-1.5 text-decoration-none"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Looking for the Route Map? View Course Map without signing in →</span>
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => {
                  setAuthModalMode('signup');
                  setPendingSubmitType(null);
                  setAuthModalOpen(true);
                }}
                className="btn-primary py-2.5 px-4 text-xs font-black shadow-md flex-1 sm:flex-initial justify-center cursor-pointer flex items-center"
              >
                <UserPlus className="w-3.5 h-3.5 mr-1" />
                <span>Sign Up</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthModalMode('login');
                  setPendingSubmitType(null);
                  setAuthModalOpen(true);
                }}
                className="btn-secondary py-2.5 px-4 text-xs font-black bg-[var(--bg-tertiary)] border border-[var(--border-color)] flex-1 sm:flex-initial justify-center cursor-pointer flex items-center"
              >
                <LogIn className="w-3.5 h-3.5 mr-1" />
                <span>Log In</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Registration Mode Tab Toggle */}
      <div className="flex items-center justify-center p-1.5 rounded-full bg-[var(--bg-tertiary)] border border-[var(--border-color)] max-w-md mx-auto">
        <button
          onClick={() => setTab('INDIVIDUAL')}
          className={`w-1/2 py-3 rounded-full text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
            tab === 'INDIVIDUAL'
              ? 'bg-[var(--orange)] text-white shadow-lg shadow-[var(--orange)]/30'
              : 'text-[var(--text-primary)] hover:text-[var(--orange)]'
          }`}
        >
          <User className="w-4 h-4" />
          <span>INDIVIDUAL / FRIEND FORM</span>
        </button>

        <button
          onClick={() => setTab('BULK')}
          className={`w-1/2 py-3 rounded-full text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
            tab === 'BULK'
              ? 'bg-[var(--cyan)] text-white shadow-lg shadow-[var(--cyan)]/30'
              : 'text-[var(--text-primary)] hover:text-[var(--cyan)]'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>SCHOOL / COLLEGE BULK</span>
        </button>
      </div>

      {/* TAB 1: INDIVIDUAL REGISTRATION FORM */}
      {tab === 'INDIVIDUAL' && (
        <div className="glass-card p-6 sm:p-10 rounded-3xl border border-[var(--border-color)] shadow-2xl relative overflow-hidden space-y-8">
          
          {!isRegistrationOpen && (
            <div className="p-4 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-500 font-extrabold text-xs flex items-center gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>
                {isPastDeadline
                  ? 'Marathon registration is now closed. The last date to register was 30 November 2026 (30/11/2026).'
                  : 'Marathon registration is currently closed by the organizers. Please check back later.'}
              </span>
            </div>
          )}

          <form onSubmit={handleIndividualSubmit} className="space-y-8">
            
            {/* ======================================================== */}
            {/* SECTION: PARTICIPANT 1 (YOUR REGISTRATION) */}
            {/* ======================================================== */}
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)]">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-full bg-[var(--orange)] text-white flex items-center justify-center font-black text-xs">
                    1
                  </span>
                  <h3 className="text-base sm:text-lg font-black font-heading text-[var(--text-primary)]">
                    Participant 1 - Registration
                  </h3>
                </div>
                {hasFriends && (
                  <span className="px-2.5 py-0.5 rounded-full bg-[var(--orange)]/15 text-[var(--orange)] font-extrabold text-[10px] uppercase tracking-wider">
                    Primary Registrant
                  </span>
                )}
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-[var(--text-primary)] mb-1 uppercase tracking-wider">
                  Participant 1's Full Name (For Certificate) *
                </label>
                <div className="relative">
                  <User className="w-5 h-5 text-[var(--orange)] absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    disabled={!isRegistrationOpen}
                    value={indForm.fullName}
                    onChange={(e) => setIndForm({ ...indForm, fullName: e.target.value })}
                    placeholder="Enter Participant 1's full name as it should appear on certificate"
                    className={`w-full pl-11 pr-4 py-3.5 rounded-2xl bg-[var(--bg-primary)] border text-sm text-[var(--text-primary)] focus:outline-none ${
                      indErrors.fullName ? 'border-red-500' : 'border-[var(--border-color)] focus:border-[var(--orange)]'
                    }`}
                  />
                </div>
                {indErrors.fullName && <p className="text-xs text-red-500 font-bold mt-1">{indErrors.fullName}</p>}
              </div>

              {/* Date of Birth & Profession / Occupation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">
                      Participant 1's Date of Birth (DOB)
                    </label>
                    {indForm.dob && calculateAgeFromDob(indForm.dob) !== null && (
                      <span className="text-[11px] font-bold text-[var(--orange)] bg-[var(--orange)]/10 px-2 py-0.5 rounded-full">
                        Age: {calculateAgeFromDob(indForm.dob)} yrs
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <Calendar className="w-5 h-5 text-[var(--orange)] absolute left-3.5 top-3.5 pointer-events-none" />
                    <input
                      type="date"
                      disabled={!isRegistrationOpen}
                      max={getMaxDobDate()}
                      value={indForm.dob || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        const calcAge = calculateAgeFromDob(val);
                        setIndForm({
                          ...indForm,
                          dob: val,
                          age: calcAge !== null ? String(calcAge) : indForm.age,
                        });
                      }}
                      className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--orange)]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--text-primary)] mb-1 uppercase tracking-wider">
                    Profession / Occupation
                  </label>
                  <div className="relative">
                    <Briefcase className="w-5 h-5 text-[var(--cyan)] absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      disabled={!isRegistrationOpen}
                      value={indForm.profession}
                      onChange={(e) => setIndForm({ ...indForm, profession: e.target.value })}
                      placeholder="Student, Teacher, Engineer, Business, etc."
                      className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--orange)]"
                    />
                  </div>
                </div>
              </div>

              {/* Student Toggle */}
              <div>
                <label className="block text-xs font-bold text-[var(--text-primary)] mb-1 uppercase tracking-wider">
                  Are you a Student? *
                </label>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button
                    type="button"
                    disabled={!isRegistrationOpen}
                    onClick={() => setIndForm({ ...indForm, isStudent: true })}
                    className={`py-3 px-4 rounded-2xl text-xs font-extrabold border transition-all ${
                      indForm.isStudent
                        ? 'bg-[var(--orange)]/15 border-[var(--orange)] text-[var(--orange)] shadow-sm'
                        : 'bg-[var(--bg-primary)] border-[var(--border-color)] text-[var(--text-primary)]'
                    }`}
                  >
                    YES, I AM A STUDENT
                  </button>

                  <button
                    type="button"
                    disabled={!isRegistrationOpen}
                    onClick={() => setIndForm({ ...indForm, isStudent: false, standard: '', institutionName: '', otherInstitution: '' })}
                    className={`py-3 px-4 rounded-2xl text-xs font-extrabold border transition-all ${
                      !indForm.isStudent
                        ? 'bg-[var(--cyan)]/15 border-[var(--cyan)] text-[var(--cyan)] shadow-sm'
                        : 'bg-[var(--bg-primary)] border-[var(--border-color)] text-[var(--text-primary)]'
                    }`}
                  >
                    NO, INDIVIDUAL
                  </button>
                </div>
              </div>

              {/* Student Specific Fields */}
              {indForm.isStudent && (
                <div className="space-y-4 p-4 rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] animate-in fade-in">
                  <div>
                    <label className="block text-xs font-bold text-[var(--text-primary)] mb-1 uppercase tracking-wider">
                      Standard / Class
                    </label>
                    <div className="relative">
                      <GraduationCap className="w-5 h-5 text-[var(--orange)] absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        disabled={!isRegistrationOpen}
                        value={indForm.standard}
                        onChange={(e) => setIndForm({ ...indForm, standard: e.target.value })}
                        placeholder="e.g. 8th, 9th, 10th, Inter, Degree..."
                        className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--orange)]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[var(--text-primary)] mb-1 uppercase tracking-wider">
                      School / College Name in Adoni *
                    </label>
                    <SearchableSelect
                      options={[...institutions, 'OTHER']}
                      value={indForm.institutionName}
                      onChange={(val) => setIndForm({ ...indForm, institutionName: val })}
                      error={indErrors.institutionName}
                    />
                  </div>

                  {indForm.institutionName === 'OTHER' && (
                    <div>
                      <label className="block text-xs font-bold text-[var(--text-primary)] mb-1 uppercase tracking-wider">
                        Specify School / College Name *
                      </label>
                      <input
                        type="text"
                        value={indForm.otherInstitution}
                        onChange={(e) => setIndForm({ ...indForm, otherInstitution: e.target.value })}
                        placeholder="Type your institution name..."
                        className="w-full py-3.5 px-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--orange)]"
                      />
                      {indErrors.otherInstitution && (
                        <p className="text-xs text-red-500 font-bold mt-1">{indErrors.otherInstitution}</p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Contact Number */}
              <div>
                <label className="block text-xs font-bold text-[var(--text-primary)] mb-1 uppercase tracking-wider">
                  Contact Mobile Number *
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 flex items-center gap-1.5 pointer-events-none text-[var(--text-muted)] border-r border-[var(--border-color)] pr-2.5">
                    <Phone className="w-4 h-4 text-[var(--orange)]" />
                    <span className="text-xs font-bold text-[var(--text-primary)]">+91</span>
                  </div>
                  <input
                    type="tel"
                    required
                    disabled={!isRegistrationOpen}
                    value={indForm.contactNumber}
                    onChange={(e) => setIndForm({ ...indForm, contactNumber: formatPhoneInput(e.target.value) })}
                    placeholder="98765 43210"
                    maxLength={12}
                    className={`w-full pl-20 pr-4 py-3.5 rounded-2xl bg-[var(--bg-primary)] border text-sm text-[var(--text-primary)] focus:outline-none ${
                      indErrors.contactNumber ? 'border-red-500' : 'border-[var(--border-color)] focus:border-[var(--orange)]'
                    }`}
                  />
                </div>
                {indErrors.contactNumber && <p className="text-xs text-red-500 font-bold mt-1">{indErrors.contactNumber}</p>}
              </div>

              {/* Participant 1 Terms Checkbox */}
              <div
                id="terms-checkbox-section"
                className={`pt-2 p-3 rounded-2xl transition-all duration-300 ${
                  indErrors.agreeTerms
                    ? 'bg-red-500/10 border-2 border-red-500/50 shadow-sm'
                    : 'bg-transparent border border-transparent'
                }`}
              >
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    disabled={!isRegistrationOpen}
                    checked={indForm.agreeTerms}
                    onChange={(e) => {
                      setIndForm({ ...indForm, agreeTerms: e.target.checked });
                      if (e.target.checked && indErrors.agreeTerms) {
                        setIndErrors((prev) => {
                          const updated = { ...prev };
                          delete updated.agreeTerms;
                          return updated;
                        });
                      }
                    }}
                    className="w-5 h-5 mt-0.5 text-[var(--orange)] rounded accent-[var(--orange)] cursor-pointer"
                  />
                  <span className="text-xs text-[var(--text-muted)] font-semibold leading-relaxed">
                    I hereby declare that I am physically fit to participate in the Anti-Drug Movement Marathon Run 2026. I agree to the event rules,{' '}
                    <Link
                      to="/terms"
                      className="text-[var(--orange)] underline font-bold hover:text-[var(--orange)]/80"
                      title="View Event Terms And Conditions"
                    >
                      Terms And Conditions
                    </Link>.
                  </span>
                </label>
                {indErrors.agreeTerms && (
                  <p className="text-xs text-red-500 font-bold mt-1.5 flex items-center gap-1.5">
                    <span>⚠️</span>
                    <span>{indErrors.agreeTerms}</span>
                  </p>
                )}
              </div>
            </div>

            {/* ======================================================== */}
            {/* ADD A FRIEND BUTTON OR PARTICIPANT 2 FORM */}
            {/* ======================================================== */}
            {/* ======================================================== */}
            {/* ADD PARTICIPANT BUTTON OR MULTI-PARTICIPANT FORMS */}
            {/* ======================================================== */}
            {!hasFriends ? (
              <div className="pt-2 pb-2">
                <button
                  type="button"
                  disabled={!isRegistrationOpen}
                  onClick={() => {
                    setHasFriends(true);
                    if (friendsList.length === 0) {
                      setFriendsList([createBlankFriend()]);
                      setFriendsCount(1);
                      setFriendsErrors([{}]);
                    }
                  }}
                  className="w-full py-4 px-5 rounded-2xl border-2 border-dashed border-[var(--orange)] bg-[var(--orange)]/10 hover:bg-[var(--orange)]/20 text-[var(--orange)] transition-all font-black text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-sm"
                >
                  <UserPlus className="w-5 h-5" />
                  <span>+ ADD PARTICIPANT TO THIS REGISTRATION</span>
                </button>
                <p className="text-[11px] text-[var(--text-muted)] text-center mt-2 font-medium">
                  Add 1 to 5 additional participants along with you in a single step! You can select the number of participants and everyone will receive a unique entry pass.
                </p>
              </div>
            ) : (
              <div className="space-y-6 animate-in slide-in-from-top-3">
                {/* Control Bar: Select number of participants & Remove All */}
                <div className="p-5 sm:p-6 rounded-3xl bg-[var(--bg-tertiary)] border-2 border-[var(--orange)]/40 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[var(--orange)]/20 flex items-center justify-center text-[var(--orange)]">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-black font-heading text-[var(--text-primary)]">
                        Add Participant To Registration
                      </h4>
                      <p className="text-xs text-[var(--text-muted)] font-medium">
                        Choose how many participants to register (1 to 5 members)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <label htmlFor="friends-count-select" className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider whitespace-nowrap">
                        Number of Participants:
                      </label>
                      <select
                        id="friends-count-select"
                        value={friendsCount}
                        disabled={!isRegistrationOpen}
                        onChange={(e) => handleFriendsCountChange(e.target.value)}
                        className="py-2.5 px-4 rounded-xl bg-[var(--bg-primary)] border-2 border-[var(--orange)] text-sm font-extrabold text-[var(--orange)] focus:outline-none shadow-sm cursor-pointer"
                      >
                        {[1, 2, 3, 4, 5].map((num) => (
                          <option key={num} value={num} className="bg-[var(--bg-primary)] text-[var(--text-primary)] font-bold">
                            {num} {num === 1 ? 'Participant' : 'Participants'}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      type="button"
                      onClick={handleRemoveAllFriends}
                      className="text-xs font-bold text-red-500 hover:text-red-600 flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-red-500/10 transition-colors whitespace-nowrap"
                      title="Remove All Participants"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Remove All</span>
                    </button>
                  </div>
                </div>

                {/* Dynamic list of participant cards */}
                {friendsList.map((friendItem, idx) => (
                  <div
                    key={idx}
                    className="p-6 sm:p-8 rounded-3xl bg-[var(--bg-tertiary)]/60 border-2 border-[var(--cyan)]/40 shadow-inner space-y-6"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)]">
                      <div className="flex items-center gap-2.5">
                        <span className="w-7 h-7 rounded-full bg-[var(--cyan)] text-white flex items-center justify-center font-black text-xs">
                          {idx + 2}
                        </span>
                        <div>
                          <h3 className="text-base sm:text-lg font-black font-heading text-[var(--text-primary)]">
                            Participant {idx + 2} - Registration
                          </h3>
                        </div>
                      </div>

                      {friendsList.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveFriendAtIndex(idx)}
                          className="text-xs font-bold text-red-500 hover:text-red-600 flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-red-500/10 transition-colors"
                          title={`Remove Participant ${idx + 2}`}
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Remove</span>
                        </button>
                      )}
                    </div>

                    {/* Participant Full Name */}
                    <div>
                      <label className="block text-xs font-bold text-[var(--text-primary)] mb-1 uppercase tracking-wider">
                        Participant {idx + 2}'s Full Name (For Certificate) *
                      </label>
                      <div className="relative">
                        <User className="w-5 h-5 text-[var(--cyan)] absolute left-3.5 top-3.5" />
                        <input
                          type="text"
                          required
                          disabled={!isRegistrationOpen}
                          value={friendItem.fullName}
                          onChange={(e) => updateFriendField(idx, 'fullName', e.target.value)}
                          placeholder={`Enter participant ${idx + 2}'s full name as it should appear on certificate`}
                          className={`w-full pl-11 pr-4 py-3.5 rounded-2xl bg-[var(--bg-primary)] border text-sm text-[var(--text-primary)] focus:outline-none ${
                            friendsErrors[idx]?.fullName
                              ? 'border-red-500'
                              : 'border-[var(--border-color)] focus:border-[var(--cyan)]'
                          }`}
                        />
                      </div>
                      {friendsErrors[idx]?.fullName && (
                        <p className="text-xs text-red-500 font-bold mt-1">{friendsErrors[idx].fullName}</p>
                      )}
                    </div>

                    {/* Participant DOB & Profession */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">
                            Participant {idx + 2}'s Date of Birth (DOB)
                          </label>
                          {friendItem.dob && calculateAgeFromDob(friendItem.dob) !== null && (
                            <span className="text-[11px] font-bold text-[var(--cyan)] bg-[var(--cyan)]/10 px-2 py-0.5 rounded-full">
                              Age: {calculateAgeFromDob(friendItem.dob)} yrs
                            </span>
                          )}
                        </div>
                        <div className="relative">
                          <Calendar className="w-5 h-5 text-[var(--cyan)] absolute left-3.5 top-3.5 pointer-events-none" />
                          <input
                            type="date"
                            disabled={!isRegistrationOpen}
                            max={getMaxDobDate()}
                            value={friendItem.dob || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              const calcAge = calculateAgeFromDob(val);
                              updateFriendField(idx, 'dob', val);
                              if (calcAge !== null) {
                                updateFriendField(idx, 'age', String(calcAge));
                              }
                            }}
                            className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--cyan)]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[var(--text-primary)] mb-1 uppercase tracking-wider">
                          Participant {idx + 2}'s Profession / Occupation
                        </label>
                        <div className="relative">
                          <Briefcase className="w-5 h-5 text-[var(--cyan)] absolute left-3.5 top-3.5" />
                          <input
                            type="text"
                            disabled={!isRegistrationOpen}
                            value={friendItem.profession}
                            onChange={(e) => updateFriendField(idx, 'profession', e.target.value)}
                            placeholder="Student, Teacher, Engineer, etc."
                            className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--cyan)]"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Participant Student Toggle */}
                    <div>
                      <label className="block text-xs font-bold text-[var(--text-primary)] mb-1 uppercase tracking-wider">
                        Is Participant {idx + 2} a Student? *
                      </label>
                      <div className="grid grid-cols-2 gap-3 pt-1">
                        <button
                          type="button"
                          disabled={!isRegistrationOpen}
                          onClick={() => updateFriendField(idx, 'isStudent', true)}
                          className={`py-3 px-4 rounded-2xl text-xs font-extrabold border transition-all ${
                            friendItem.isStudent
                              ? 'bg-[var(--orange)]/15 border-[var(--orange)] text-[var(--orange)] shadow-sm'
                              : 'bg-[var(--bg-primary)] border-[var(--border-color)] text-[var(--text-primary)]'
                          }`}
                        >
                          YES, PARTICIPANT IS A STUDENT
                        </button>

                        <button
                          type="button"
                          disabled={!isRegistrationOpen}
                          onClick={() => {
                            setFriendsList((prev) => {
                              const updated = [...prev];
                              updated[idx] = {
                                ...updated[idx],
                                isStudent: false,
                                standard: '',
                                institutionName: '',
                                otherInstitution: '',
                              };
                              return updated;
                            });
                          }}
                          className={`py-3 px-4 rounded-2xl text-xs font-extrabold border transition-all ${
                            !friendItem.isStudent
                              ? 'bg-[var(--cyan)]/15 border-[var(--cyan)] text-[var(--cyan)] shadow-sm'
                              : 'bg-[var(--bg-primary)] border-[var(--border-color)] text-[var(--text-primary)]'
                          }`}
                        >
                          NO, INDIVIDUAL
                        </button>
                      </div>
                    </div>

                    {/* Participant Student Specific Fields */}
                    {friendItem.isStudent && (
                      <div className="space-y-4 p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] animate-in fade-in">
                        <div>
                          <label className="block text-xs font-bold text-[var(--text-primary)] mb-1 uppercase tracking-wider">
                            Standard / Class
                          </label>
                          <div className="relative">
                            <GraduationCap className="w-5 h-5 text-[var(--orange)] absolute left-3.5 top-3.5" />
                            <input
                              type="text"
                              disabled={!isRegistrationOpen}
                              value={friendItem.standard}
                              onChange={(e) => updateFriendField(idx, 'standard', e.target.value)}
                              placeholder="e.g. 8th, 9th, 10th, Inter, Degree..."
                              className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--orange)]"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[var(--text-primary)] mb-1 uppercase tracking-wider">
                            School / College Name in Adoni *
                          </label>
                          <SearchableSelect
                            options={[...institutions, 'OTHER']}
                            value={friendItem.institutionName}
                            onChange={(val) => updateFriendField(idx, 'institutionName', val)}
                            error={friendsErrors[idx]?.institutionName}
                          />
                        </div>

                        {friendItem.institutionName === 'OTHER' && (
                          <div>
                            <label className="block text-xs font-bold text-[var(--text-primary)] mb-1 uppercase tracking-wider">
                              Specify School / College Name *
                            </label>
                            <input
                              type="text"
                              value={friendItem.otherInstitution}
                              onChange={(e) => updateFriendField(idx, 'otherInstitution', e.target.value)}
                              placeholder="Type participant's institution name..."
                              className="w-full py-3.5 px-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--orange)]"
                            />
                            {friendsErrors[idx]?.otherInstitution && (
                              <p className="text-xs text-red-500 font-bold mt-1">
                                {friendsErrors[idx].otherInstitution}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Participant Contact Number */}
                    <div>
                      <label className="block text-xs font-bold text-[var(--text-primary)] mb-1 uppercase tracking-wider">
                        Participant {idx + 2}'s Contact Mobile Number *
                      </label>
                      <div className="relative flex items-center">
                        <div className="absolute left-3.5 flex items-center gap-1.5 pointer-events-none text-[var(--text-muted)] border-r border-[var(--border-color)] pr-2.5">
                          <Phone className="w-4 h-4 text-[var(--cyan)]" />
                          <span className="text-xs font-bold text-[var(--text-primary)]">+91</span>
                        </div>
                        <input
                          type="tel"
                          required
                          disabled={!isRegistrationOpen}
                          value={friendItem.contactNumber}
                          onChange={(e) =>
                            updateFriendField(idx, 'contactNumber', formatPhoneInput(e.target.value))
                          }
                          placeholder="98765 43210"
                          maxLength={12}
                          className={`w-full pl-20 pr-4 py-3.5 rounded-2xl bg-[var(--bg-primary)] border text-sm text-[var(--text-primary)] focus:outline-none ${
                            friendsErrors[idx]?.contactNumber
                              ? 'border-red-500'
                              : 'border-[var(--border-color)] focus:border-[var(--cyan)]'
                          }`}
                        />
                      </div>
                      {friendsErrors[idx]?.contactNumber && (
                        <p className="text-xs text-red-500 font-bold mt-1">{friendsErrors[idx].contactNumber}</p>
                      )}
                    </div>

                    {/* Participant Terms Checkbox */}
                    <div
                      className={`pt-2 p-3 rounded-2xl transition-all duration-300 ${
                        friendsErrors[idx]?.agreeTerms
                          ? 'bg-red-500/10 border-2 border-red-500/50 shadow-sm'
                          : 'bg-transparent border border-transparent'
                      }`}
                    >
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          disabled={!isRegistrationOpen}
                          checked={friendItem.agreeTerms}
                          onChange={(e) => updateFriendField(idx, 'agreeTerms', e.target.checked)}
                          className="w-5 h-5 mt-0.5 text-[var(--cyan)] rounded accent-[var(--cyan)] cursor-pointer"
                        />
                        <span className="text-xs text-[var(--text-muted)] font-semibold leading-relaxed">
                          I declare on behalf of Participant {idx + 2} ({friendItem.fullName.trim() || `Participant ${idx + 2}`}) that they are physically fit to participate in the Anti-Drug Movement Marathon Run 2026 and agree to the event rules,{' '}
                          <Link
                            to="/terms"
                            className="text-[var(--cyan)] underline font-bold hover:text-[var(--cyan)]/80"
                            title="View Event Terms And Conditions"
                          >
                            Terms And Conditions
                          </Link>.
                        </span>
                      </label>
                      {friendsErrors[idx]?.agreeTerms && (
                        <p className="text-xs text-red-500 font-bold mt-1.5 flex items-center gap-1.5">
                          <span>⚠️</span>
                          <span>{friendsErrors[idx].agreeTerms}</span>
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={!isRegistrationOpen || indSubmitting}
                className="btn-primary w-full justify-center py-4 text-base shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-black"
              >
                <Award className="w-5 h-5" />
                <span>
                  {indSubmitting
                    ? 'SUBMITTING REGISTRATION...'
                    : hasFriends
                    ? `SUBMIT REGISTRATION (YOU + ${friendsList.length} ${
                        friendsList.length === 1 ? 'PARTICIPANT' : 'PARTICIPANTS'
                      })`
                    : 'SUBMIT MARATHON REGISTRATION'}
                </span>
              </button>
            </div>

          </form>
        </div>
      )}

      {/* TAB 2: SCHOOL & COLLEGE BULK REGISTRATION */}
      {tab === 'BULK' && (
        <div className="glass-card p-6 sm:p-10 rounded-3xl border border-[var(--border-color)] shadow-2xl space-y-8">
          <div className="border-b border-[var(--border-color)] pb-4 space-y-1">
            <h3 className="text-xl font-black font-heading text-[var(--text-primary)]">
              School & College Bulk Student Upload
            </h3>
            <p className="text-xs text-[var(--text-muted)] font-medium">
              Institutions can download the template, add student records, and upload to register all participants in one single batch.
            </p>
          </div>

          {bulkStatus.success && (
            <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 font-bold text-xs flex items-center gap-3">
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              <span>{bulkStatus.message}</span>
            </div>
          )}

          {bulkStatus.error && (
            <div className="p-4 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-500 font-bold text-xs flex items-center gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{bulkStatus.error}</span>
            </div>
          )}

          <form onSubmit={handleBulkSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-[var(--text-primary)] mb-1 uppercase tracking-wider">
                  Contact Person / Coordinator Name *
                </label>
                <input
                  type="text"
                  required
                  value={bulkForm.contactPersonName}
                  onChange={(e) => setBulkForm({ ...bulkForm, contactPersonName: e.target.value })}
                  placeholder="Principal, Sports Director, Teacher..."
                  className="w-full px-4 py-3.5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--cyan)]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--text-primary)] mb-1 uppercase tracking-wider">
                  Coordinator Mobile Number *
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 flex items-center gap-1.5 pointer-events-none text-[var(--text-muted)] border-r border-[var(--border-color)] pr-2.5">
                    <Phone className="w-4 h-4 text-[var(--cyan)]" />
                    <span className="text-xs font-bold text-[var(--text-primary)]">+91</span>
                  </div>
                  <input
                    type="tel"
                    required
                    value={bulkForm.phone}
                    onChange={(e) => setBulkForm({ ...bulkForm, phone: formatPhoneInput(e.target.value) })}
                    placeholder="98765 43210"
                    maxLength={12}
                    className="w-full pl-20 pr-4 py-3.5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--cyan)]"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-[var(--text-primary)] mb-1 uppercase tracking-wider">
                  Institution Type *
                </label>
                <select
                  value={bulkForm.institutionType}
                  onChange={(e) => setBulkForm({ ...bulkForm, institutionType: e.target.value })}
                  className="w-full px-4 py-3.5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--cyan)]"
                >
                  <option value="SCHOOL">School</option>
                  <option value="COLLEGE">Junior / Degree College</option>
                  <option value="OTHER">Other Institution</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--text-primary)] mb-1 uppercase tracking-wider">
                  School / College Name in Adoni *
                </label>
                <SearchableSelect
                  options={[...institutions, 'OTHER']}
                  value={bulkForm.institutionName}
                  onChange={(val) => setBulkForm({ ...bulkForm, institutionName: val })}
                  placeholder="Search and select School / College..."
                  accentColor="cyan"
                />
              </div>
            </div>

            {bulkForm.institutionName === 'OTHER' && (
              <div>
                <label className="block text-xs font-bold text-[var(--text-primary)] mb-1 uppercase tracking-wider">
                  Specify School / College Name *
                </label>
                <input
                  type="text"
                  required
                  value={bulkForm.otherInstitution || ''}
                  onChange={(e) => setBulkForm({ ...bulkForm, otherInstitution: e.target.value })}
                  placeholder="Type your school or college name here..."
                  className="w-full py-3.5 px-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--cyan)]"
                />
              </div>
            )}

            {/* Template Download & Upload Area */}
            <div className="p-6 rounded-2xl border-2 border-dashed border-[var(--border-color)] bg-[var(--bg-primary)]/50 space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-black text-[var(--text-primary)]">Spreadsheet File (.xlsx, .xls, .csv)</h4>
                  <p className="text-xs text-[var(--text-muted)] font-medium">
                    Upload your filled student list with columns: Student Name, Age, Standard / Class, Parent's Phone Number, School / College
                  </p>
                </div>
                <button
                  type="button"
                  onClick={downloadSampleTemplate}
                  className="px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-[var(--cyan)] text-xs font-bold text-[var(--text-primary)] flex items-center gap-2 whitespace-nowrap transition-colors"
                >
                  <Download className="w-4 h-4 text-[var(--cyan)]" />
                  <span>Download Sample Template</span>
                </button>
              </div>

              <input
                type="file"
                accept=".xlsx, .xls, .csv"
                onChange={handleFileUpload}
                className="w-full text-xs text-[var(--text-muted)] file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[var(--cyan)] file:text-white hover:file:bg-[var(--cyan)]/90 cursor-pointer"
              />

              {bulkParsing && (
                <div className="text-xs font-bold text-[var(--cyan)] flex items-center gap-2">
                  <div className="w-3.5 h-3.5 border-2 border-[var(--cyan)] border-t-transparent rounded-full animate-spin" />
                  <span>Parsing and validating student records...</span>
                </div>
              )}

              {parsedData && (
                <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs space-y-1">
                  <span className="font-extrabold text-[var(--text-primary)] block">File Validation Summary:</span>
                  <div className="flex items-center gap-4 text-[11px] font-bold">
                    <span className="text-emerald-500">✓ Valid Rows: {parsedData.validRows}</span>
                    <span className="text-red-500">✗ Invalid Rows: {parsedData.invalidRows}</span>
                    <span className="text-[var(--text-muted)]">Total Rows: {parsedData.totalRows}</span>
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={!isRegistrationOpen || bulkSubmitting || !bulkFile}
              className="btn-primary w-full justify-center py-4 text-base shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-[var(--cyan)] to-blue-600 text-white"
            >
              <Upload className="w-5 h-5" />
              <span>{bulkSubmitting ? 'UPLOADING AND REGISTERING BATCH...' : 'SUBMIT BULK BATCH REGISTRATION'}</span>
            </button>
          </form>
        </div>
      )}

      {/* 3.5KM Marathon Interactive Route Map */}
      <div className="pt-10 border-t border-[var(--border-color)]">
        <MarathonRouteMap />
      </div>

      {/* Entry Pass Modal upon Successful Registration */}
      {receiptData && (
        <EntryPassModal
          data={receiptData}
          eventConfig={eventConfig}
          onClose={() => setReceiptData(null)}
        />
      )}

      {/* Auth Modal - Triggered when unauthenticated user tries to submit */}
      <RegistrationAuthModal
        isOpen={authModalOpen}
        onClose={() => {
          setAuthModalOpen(false);
          setPendingSubmitType(null);
        }}
        initialMode={authModalMode}
        prefill={{
          fullName: indForm.fullName || '',
          phone: indForm.contactNumber || bulkForm.phone || '',
          dob: indForm.dob || '',
          profession: indForm.profession || '',
        }}
        onAuthSuccess={handleAuthSuccess}
        pendingAction={pendingSubmitType || 'INDIVIDUAL'}
      />

    </div>
  );
};

export default RegistrationPage;
