import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { createPortal } from 'react-dom';
import {
  X,
  Heart,
  User,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  Flame,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Edit3,
  QrCode,
  Printer,
  ShieldCheck,
  UploadCloud,
  FileCheck,
  Trash2,
  Check,
  Smartphone,
  AlertTriangle,
} from 'lucide-react';
import { sevaBookingService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { AuthModal } from './auth/AuthModal';
import './TempleSevaSection.css';

// Supabase Configuration from existing temple app
const SUPABASE_URL = 'https://eybtrqwqaprfefwlgled.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5YnRycXdxYXByZmVmd2xnbGVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg3MjA2NTAsImV4cCI6MjEwNDI5NjY1MH0.MFMPHC6B7le4adURWeHujyM4-EY5p1lKtn-CEsVWseE';

// Utilities
function todayStr() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * Returns minimum allowable date for Seva/Pooja booking in YYYY-MM-DD.
 * Devotees must book at least 2 days in advance (day after tomorrow onwards).
 * Past dates, present date (today), and tomorrow are unavailable.
 * E.g., if today is 18th Nov, bookings are open from 20th Nov onwards (17th, 18th, 19th unavailable).
 */
export const getMinSevaDate = () => {
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 2);
  const y = minDate.getFullYear();
  const m = String(minDate.getMonth() + 1).padStart(2, '0');
  const day = String(minDate.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

function isFutureDate(s) {
  return Boolean(s && s >= getMinSevaDate());
}

function sanitizePhone(v) {
  return (v || '').replace(/[^0-9]/g, '').slice(0, 10);
}

function isValidEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((v || '').trim());
}

function genRefId(prefix = 'SMT') {
  const t = Date.now().toString(36).toUpperCase();
  const r = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${prefix}-${t.slice(-5)}-${r}`;
}

// Local Storage Booking Sync
function getStoredBookings() {
  try {
    const raw = localStorage.getItem('temple_seva_bookings');
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function storeBooking(booking) {
  try {
    const list = getStoredBookings();
    list.unshift(booking);
    localStorage.setItem('temple_seva_bookings', JSON.stringify(list));
  } catch (e) {
    console.warn('Could not save to localStorage', e);
  }
}

// Save to Supabase (REST API)
async function savePujaToSupabase(booking) {
  try {
    const headers = {
      apikey: SUPABASE_ANON_KEY,
      Authorization: 'Bearer ' + SUPABASE_ANON_KEY,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    };

    // Devotee upsert
    await fetch(`${SUPABASE_URL}/rest/v1/devotees?on_conflict=phone`, {
      method: 'POST',
      headers: { ...headers, Prefer: 'return=representation,resolution=merge-duplicates' },
      body: JSON.stringify({
        phone: booking.phone,
        name: booking.name,
        email: booking.email || null,
        gotra: booking.gotra || null,
        nakshetra: booking.nakshetra || null,
        address: booking.address || null,
      }),
    }).catch(() => null);

    // Puja booking insert
    const res = await fetch(`${SUPABASE_URL}/rest/v1/puja_bookings`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        phone: booking.phone,
        puja_name: booking.pujaName,
        puja_type: booking.pujaType || 'general',
        puja_date: booking.date,
        amount: booking.amount || 0,
        gotra: booking.gotra || null,
        nakshetra: booking.nakshetra || null,
        address: booking.address || null,
      }),
    });
    return await res.json();
  } catch (err) {
    console.warn('Supabase online sync skipped (saved locally)', err);
    return null;
  }
}

export const POOJA_SERVICES = [
  {
    id: 'nitya-pratah',
    name: 'Nitya Pratah|Puja',
    desc: 'The awakening of the deity with sacred chants',
    icon: '☀',
    pujaType: 'nitya_pratah',
    options: [
      { name: 'Nitya Deeparadhana Seva (1 Month)', price: 516 },
      { name: 'Visesa Dravya Abhishekam (1 Day)', price: 516 },
      { name: 'Somavara Visesha Puja (1 Month)', price: 2500 },
      { name: 'Nitya Archana Seva (1 Month)', price: 5116 },
      { name: 'Pournima Visesha Puja (1 Year)', price: 6000 },
      { name: 'Amavasya Visesha Puja (1 Year)', price: 6000 },
      { name: 'Masam Shivaratri Puja (1 Year)', price: 6000 },
      { name: 'Arudra Nakshatra Puja (1 Year)', price: 6000 },
    ],
  },
  {
    id: 'visesha-pujas',
    name: 'Visesha|Pujas',
    desc: 'Sacred bathing with special Dravyas',
    icon: '❖',
    pujaType: 'visesha_puja',
    options: [
      { name: 'Kartika Deeparadhana (1 Month)', price: 516 },
      { name: 'Pushalankara Seva', price: 999 },
      { name: 'Visesha Bhasmarchana Puja', price: 1001 },
      { name: 'Nandishwara Puja', price: 1111 },
      { name: 'Saravana Puja', price: 1111 },
      { name: 'Veerabhadra Puja', price: 1111 },
      { name: 'Kaala Bhairava Puja', price: 1111 },
      { name: 'Ganesha Puja', price: 1111 },
      { name: 'Graha Dosha Parihara Puja', price: 2116 },
      { name: 'Shani Tailabhisheka-Puja', price: 2116 },
      { name: 'Vastra Samarpana Seva (Shiva-Shakti)', price: 2499 },
      { name: 'Shiva-Shakti Aaradhana Puja', price: 5116 },
      { name: 'Birth Anniversary Seva with Rudrabhishekam', price: 5116 },
      { name: 'Vivaha Anniversary Seva with Rudrabhishekam', price: 5116 },
      { name: 'Navagrha Puja', price: 5116 },
      { name: 'Kartika Sopana Deepotsavam (Kartika Pournami)', price: 5116 },
      { name: 'Sahasra Bilvarchana Puja', price: 10008 },
      { name: 'Varuna Homam', price: 50001 },
      { name: 'Pancha Boota Shiva Puja', price: 50116 },
    ],
  },
  {
    id: 'rudrabhishekam',
    name: 'Rudrabhishekam',
    desc: 'Abhishekam with Sri Rudram Namakam Chamakam',
    icon: 'ॐ',
    pujaType: 'rudrabhishekam',
    fixedAmount: 2116,
    descriptionText:
      'Sacred Abhishekam with Sri Rudram Namakam Chamakam, performed in your name by our Vedic priests.',
  },
  {
    id: 'pradosha-puja',
    name: 'Pradosha|Puja',
    desc: 'Twilight worship to Lord Shiva',
    icon: '◇',
    pujaType: 'pradosha',
    fixedAmount: 2116,
    descriptionText:
      'Twilight worship to Lord Shiva, performed during the sacred Pradosha Kaalam. Abhishekam with Sri Rudram.',
  },
  {
    id: 'sri-chakra',
    name: 'Sri Chakra|Kumkumarchana',
    desc: 'Kumkuma puja',
    icon: '✴',
    pujaType: 'sri_chakra_kumkumarchana',
    options: [
      { name: '1 Day Sacred Kumkumarchana', price: 516 },
      { name: '1 Month Divine Kumkumarchana', price: 15116 },
    ],
  },
  {
    id: 'sacred-homas',
    name: 'Sacred Homas',
    desc: 'Vedic fire rituals',
    icon: '🔥',
    pujaType: 'sacred_homa',
    fixedPrice: 15116,
    options: [
      { name: 'Rudra Homam', price: 15116 },
      { name: 'Maha Mrutyunjaya Homam', price: 15116 },
      { name: 'Kala Bhairava Homam', price: 15116 },
      { name: 'Sri Dakshina Murthy Homam', price: 15116 },
      { name: 'Durga Homam', price: 15116 },
      { name: 'Dhanvantari Homam', price: 15116 },
      { name: 'Nakshatra Homam', price: 15116 },
      { name: 'Navagraha Homam', price: 15116 },
      { name: 'Ganapathi Homam', price: 15116 },
      { name: 'Lalitha Homam', price: 15116 },
      { name: 'Pratyangira Homam', price: 15116 },
      { name: 'Chandi Homam', price: 15116 },
      { name: 'Pavamana Homam', price: 15116 },
      { name: 'Vaarahi Homam', price: 15116 },
      { name: 'Veerabhadra Homam', price: 15116 },
    ],
  },
  {
    id: 'nitya-naivedyam',
    name: 'Nitya Naivedyam',
    desc: 'Prasadam offering (Daily 1kg)',
    icon: '◐',
    pujaType: 'nitya_naivedyam',
    fixedAmount: 10000,
    descriptionText:
      'Daily 1 kg divine naivedyam will be prepared with pure ghee and grains, and offered to the deity in your name for one full month.',
  },
  {
    id: 'maha-shivaratri',
    name: 'Magha Masam Poojalu',
    desc: 'Auspicious Magha Masam Poojalu & Abhishekams (30 Days)',
    icon: '✶',
    pujaType: 'maha_shivaratri',
    isSpecial: true,
    options: [
      { name: 'Daily Sankalpam Rudrabhishekam Pooja (30 Days)', price: 1221 },
      {
        name: 'Shiva Parvati Kalyanam Seva + Daily Sankalpam Rudrabhishekam Pooja (30 Days)',
        price: 10008,
      },
      {
        name: 'Shiva Parvati Kalyanam Seva + Anna Prasadam Seva + Daily Sankalpam Rudrabhishekam Pooja (30 Days)',
        price: 15116,
      },
    ],
  },
];

export function UnifiedBookingModal({ service, onClose, onBookingSuccess }) {
  const { normalUser, isUserAuthenticated } = useAuth();
  const [step, setStep] = useState('form'); // 'form' | 'review' | 'proof' | 'confirmed'
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [formData, setFormData] = useState({
    name: normalUser?.fullName || '',
    phoneNumber: normalUser?.phone || '',
    email: normalUser?.email || '',
    dob: '',
    gotram: '',
    nakshatra: '',
    address: '',
    // Payment proof fields
    utrId: '',
    screenshot: '',
    screenshotPreview: '',
    screenshotSize: '',
  });
  const [errors, setErrors] = useState({});
  const [bookingReceipt, setBookingReceipt] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-populate / sync with authenticated devotee profile
  useEffect(() => {
    if (normalUser) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || normalUser.fullName || '',
        phoneNumber: prev.phoneNumber || normalUser.phone || '',
        email: prev.email || normalUser.email || '',
      }));
    }
  }, [normalUser]);

  // Initialize selected option
  useEffect(() => {
    if (!service) return;
    if (service.selectedOption) {
      setSelectedOption(service.selectedOption);
      return;
    }
    if (service.options && service.options.length > 0) {
      if (service.selectedOptionName) {
        const targetClean = service.selectedOptionName.trim().toLowerCase();
        const exactMatch = service.options.find(
          (opt) => (opt.name || '').trim().toLowerCase() === targetClean
        );
        if (exactMatch) {
          setSelectedOption(exactMatch);
          return;
        }
      }

      const targetName = (service.selectedOptionName || service.name || service.title || '')
        .replace('|', ' ')
        .trim()
        .toLowerCase();
      const match =
        service.options.find((opt) => (opt.name || '').trim().toLowerCase() === targetName) ||
        service.options.find((opt) => (opt.name || '').trim().toLowerCase().includes(targetName));
      setSelectedOption(match || service.options[0]);
    } else {
      setSelectedOption({
        name: (service.name || service.title || 'Sacred Seva').replace('|', ' '),
        price: service.fixedAmount || 0,
      });
    }
  }, [service]);

  // Lock body scroll and set up escape key listener
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  if (!service) return null;

  const currentAmount = selectedOption ? selectedOption.price : service.fixedAmount || 0;
  const serviceDisplayName = (service.name || service.title || 'Sacred Seva').replace('|', ' ');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (name === 'dob' && value) {
      const minDate = getMinSevaDate();
      if (value < minDate) {
        setErrors((prev) => ({
          ...prev,
          dob: 'Bookings must be made at least 2 days in advance. Past dates, today, and tomorrow are unavailable.',
        }));
      }
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Please enter your full name';
    }
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Please enter your phone number';
    } else if (!/^[0-9+-\s()]{7,15}$/.test(formData.phoneNumber.trim())) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Please enter your email ID';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    const minDate = getMinSevaDate();
    if (!formData.dob) {
      newErrors.dob = 'Please select a Seva Date (at least 2 days in advance)';
    } else if (formData.dob < minDate) {
      newErrors.dob = 'Bookings must be made at least 2 days in advance. Past dates, today, and tomorrow are unavailable.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleReviewClick = (e) => {
    e.preventDefault();
    if (validate()) {
      if (!isUserAuthenticated) {
        setAuthModalOpen(true);
        return;
      }
      setStep('review');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // "Done / I Have Paid" → go to proof step
  const handleDonePaymentClick = () => {
    setStep('proof');
  };

  // File Upload Handler with FileReader preview
  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      setErrors((prev) => ({
        ...prev,
        screenshot: 'Please upload an image (PNG, JPG, JPEG) or PDF receipt',
      }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        screenshot: 'File size should be less than 5MB',
      }));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({
        ...prev,
        screenshot: file.name,
        screenshotPreview: reader.result,
        screenshotSize: (file.size / 1024).toFixed(1) + ' KB',
      }));
      setErrors((prev) => ({ ...prev, screenshot: '' }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveScreenshot = () => {
    setFormData((prev) => ({
      ...prev,
      screenshot: '',
      screenshotPreview: '',
      screenshotSize: '',
    }));
  };

  const validateProof = () => {
    const newErrors = {};

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Final submission with proof and MongoDB persistence
  const handleSubmitProof = async (e) => {
    e.preventDefault();
    if (!validateProof()) return;

    setIsSubmitting(true);
    setErrors((prev) => ({ ...prev, general: '' }));

    const prefix = service.refIdPrefix || 'SMT';
    const refId = genRefId(prefix);
    const bookingData = {
      refId,
      bookingType: 'SEVA_BOOKING',
      pujaName: selectedOption ? selectedOption.name : serviceDisplayName,
      sevaName: selectedOption ? selectedOption.name : serviceDisplayName,
      serviceCategory: serviceDisplayName,
      pujaType: service.pujaType || 'seva',
      templeName: service.templeName || 'Shri Shantamalleshwara Swami Temple',
      amount: currentAmount,
      name: formData.name.trim(),
      devoteeName: formData.name.trim(),
      gotra: formData.gotram.trim(),
      gotram: formData.gotram.trim(),
      nakshetra: formData.nakshatra.trim(),
      nakshatra: formData.nakshatra.trim(),
      phone: formData.phoneNumber.trim(),
      email: formData.email.trim(),
      date: formData.dob || todayStr(),
      address: formData.address.trim(),
      utrId: formData.utrId?.trim() || `WA-${Date.now().toString(36).toUpperCase()}`,
      screenshotName: formData.screenshot || 'Sent via WhatsApp/Email',
      createdAt: new Date().toISOString(),
      status: 'Payment Proof Submitted (Verification Pending)',
      userId: normalUser?._id || undefined,
    };

    try {
      const apiRes = await sevaBookingService.submitBooking(bookingData);
      const savedDoc = apiRes.data?.data || bookingData;

      storeBooking(savedDoc);
      try {
        const existing = JSON.parse(localStorage.getItem('devotee_donations_history') || '[]');
        existing.unshift({
          ...formData,
          sevaName: savedDoc.pujaName || savedDoc.sevaName,
          templeName: savedDoc.templeName,
          amount: currentAmount,
          refId: savedDoc.bookingId || refId,
          utrId: formData.utrId.trim(),
          submittedAt: new Date().toISOString(),
        });
        localStorage.setItem('devotee_donations_history', JSON.stringify(existing.slice(0, 50)));
      } catch (_) {}

      savePujaToSupabase(bookingData).catch((err) => console.warn('Supabase sync:', err));

      setBookingReceipt(savedDoc);
      setStep('confirmed');
      if (onBookingSuccess) onBookingSuccess();
    } catch (err) {
      console.error('Failed to persist seva booking:', err);
      const errMsg =
        err.response?.data?.message ||
        'Failed to save booking to the database. Please check your network and try again.';
      setErrors((prev) => ({
        ...prev,
        general: errMsg,
        utrId: errMsg.toLowerCase().includes('utr') ? errMsg : prev.utrId,
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Dynamic values for single-page print receipt
  const activeTempleName =
    bookingReceipt?.templeName ||
    service?.templeName ||
    (service?.refIdPrefix === 'CST'
      ? 'Chinmaya Sanjeevaraya Temple'
      : 'Shri Shantamalleshwara Swami Temple');

  const printRefId =
    bookingReceipt?.refId ||
    `${service?.refIdPrefix || 'SMT'}-${Date.now().toString(36).slice(-5).toUpperCase()}`;

  const printPujaName =
    bookingReceipt?.pujaName ||
    (selectedOption ? selectedOption.name : serviceDisplayName);

  const printDateStr = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const printDobStr = formData.dob
    ? new Date(formData.dob).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : 'As Scheduled by Priest';

  return (
    <>
      {typeof document !== 'undefined' &&
        createPortal(
          <div id="temple-seva-printable-receipt" aria-hidden="true">
            <style>{`
              @media screen {
                #temple-seva-printable-receipt {
                  display: none !important;
                }
              }
              @media print {
                @page {
                  size: A4 portrait;
                  margin: 6mm 10mm;
                }
                html, body {
                  background: #ffffff !important;
                  margin: 0 !important;
                  padding: 0 !important;
                  height: auto !important;
                  overflow: visible !important;
                }
                #root {
                  display: none !important;
                }
                #temple-seva-printable-receipt {
                  display: block !important;
                  position: static !important;
                  width: 100% !important;
                  max-width: 190mm !important;
                  margin: 0 auto !important;
                  padding: 2mm 0 !important;
                  box-sizing: border-box !important;
                  background: #ffffff !important;
                  color: #0f172a !important;
                  page-break-after: avoid !important;
                  page-break-before: avoid !important;
                  page-break-inside: avoid !important;
                  break-inside: avoid !important;
                  -webkit-print-color-adjust: exact !important;
                  print-color-adjust: exact !important;
                }
                #temple-seva-printable-receipt * {
                  visibility: visible !important;
                  -webkit-print-color-adjust: exact !important;
                  print-color-adjust: exact !important;
                }
              }
            `}</style>
            <div
              style={{
                border: '2px solid #b45309',
                padding: '12px 16px',
                borderRadius: '8px',
                background: '#ffffff',
                pageBreakInside: 'avoid',
                breakInside: 'avoid',
              }}
            >
              <div
                style={{
                  textAlign: 'center',
                  borderBottom: '2px solid #d97706',
                  paddingBottom: '8px',
                  marginBottom: '10px',
                }}
              >
                <div
                  style={{
                    fontSize: '11px',
                    fontWeight: 'bold',
                    letterSpacing: '0.25em',
                    color: '#b45309',
                    textTransform: 'uppercase',
                  }}
                >
                  ॥ श्री चिन्मय मिशन आधोनी ॥
                </div>
                <h1
                  style={{
                    fontSize: '19px',
                    fontWeight: '900',
                    color: '#0f172a',
                    margin: '3px 0 2px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {activeTempleName}
                </h1>
                <div style={{ fontSize: '11px', fontWeight: '700', color: '#475569' }}>
                  Chinmaya Mission, Adoni, Andhra Pradesh
                </div>
                <div
                  style={{
                    display: 'inline-block',
                    marginTop: '4px',
                    padding: '2px 10px',
                    background: '#fef3c7',
                    border: '1px solid #f59e0b',
                    borderRadius: '9999px',
                    fontSize: '10px',
                    fontWeight: '800',
                    color: '#92400e',
                    textTransform: 'uppercase',
                  }}
                >
                  Official Seva & Sankalpa Registration Receipt
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  marginBottom: '10px',
                  fontSize: '11px',
                }}
              >
                <div>
                  <span style={{ color: '#64748b', fontWeight: '600' }}>Booking Ref ID: </span>
                  <strong
                    style={{
                      fontFamily: 'monospace',
                      fontSize: '12px',
                      color: '#b45309',
                    }}
                  >
                    {printRefId}
                  </strong>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontWeight: '600' }}>Registration Date: </span>
                  <strong>{printDateStr}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontWeight: '600' }}>Status: </span>
                  <strong style={{ color: '#16a34a' }}>✓ Confirmed with Priest</strong>
                </div>
              </div>

              <div
                style={{
                  background: '#fffbeb',
                  border: '1.5px solid #fcd34d',
                  borderRadius: '6px',
                  padding: '9px 12px',
                  marginBottom: '10px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                    gap: '8px',
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: '10px',
                        fontWeight: '800',
                        textTransform: 'uppercase',
                        color: '#b45309',
                        letterSpacing: '0.08em',
                      }}
                    >
                      Sacred Seva Offering
                    </div>
                    <div
                      style={{
                        fontSize: '14px',
                        fontWeight: '800',
                        color: '#0f172a',
                        marginTop: '1px',
                      }}
                    >
                      {printPujaName}
                    </div>
                    <div style={{ fontSize: '11px', color: '#475569', marginTop: '2px' }}>
                      Temple: <strong style={{ whiteSpace: 'nowrap' }}>{activeTempleName}</strong>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div
                      style={{
                        fontSize: '10px',
                        fontWeight: '800',
                        textTransform: 'uppercase',
                        color: '#b45309',
                        letterSpacing: '0.08em',
                      }}
                    >
                      Offering Amount
                    </div>
                    <div
                      style={{
                        fontSize: '17px',
                        fontWeight: '900',
                        color: '#0f172a',
                        marginTop: '1px',
                      }}
                    >
                      ₹{Number(currentAmount).toLocaleString('en-IN')}
                    </div>
                    <div style={{ fontSize: '10px', color: '#16a34a', fontWeight: '700' }}>
                      ✓ Voluntary Religious Contribution
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '10px' }}>
                <div
                  style={{
                    fontSize: '11px',
                    fontWeight: '800',
                    textTransform: 'uppercase',
                    color: '#0f172a',
                    letterSpacing: '0.06em',
                    borderBottom: '1px solid #e2e8f0',
                    paddingBottom: '3px',
                    marginBottom: '5px',
                  }}
                >
                  Devotee & Sankalpa Information
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td
                        style={{
                          padding: '3.5px 6px',
                          width: '22%',
                          color: '#64748b',
                          fontWeight: '600',
                        }}
                      >
                        Devotee Name:
                      </td>
                      <td
                        style={{
                          padding: '3.5px 6px',
                          width: '38%',
                          fontWeight: '700',
                          color: '#0f172a',
                        }}
                      >
                        {formData.name || '—'}
                      </td>
                      <td
                        style={{
                          padding: '3.5px 6px',
                          width: '18%',
                          color: '#64748b',
                          fontWeight: '600',
                        }}
                      >
                        Gotram:
                      </td>
                      <td
                        style={{
                          padding: '3.5px 6px',
                          width: '22%',
                          fontWeight: '700',
                          color: '#0f172a',
                        }}
                      >
                        {formData.gotram || 'Not Specified'}
                      </td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '3.5px 6px', color: '#64748b', fontWeight: '600' }}>
                        Phone Number:
                      </td>
                      <td style={{ padding: '3.5px 6px', fontWeight: '700', color: '#0f172a' }}>
                        {formData.phoneNumber || '—'}
                      </td>
                      <td style={{ padding: '3.5px 6px', color: '#64748b', fontWeight: '600' }}>
                        Seva Date:
                      </td>
                      <td style={{ padding: '3.5px 6px', fontWeight: '600', color: '#0f172a' }}>
                        {printDobStr}
                      </td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '3.5px 6px', color: '#64748b', fontWeight: '600' }}>
                        Email Address:
                      </td>
                      <td colSpan="3" style={{ padding: '3.5px 6px', fontWeight: '600', color: '#0f172a' }}>
                        {formData.email || '—'}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: '3.5px 6px', color: '#64748b', fontWeight: '600' }}>
                        Residential Address:
                      </td>
                      <td colSpan="3" style={{ padding: '3.5px 6px', color: '#334155' }}>
                        {formData.address || 'Not Specified'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div
                style={{
                  background: '#f8fafc',
                  borderLeft: '3px solid #b45309',
                  padding: '6px 9px',
                  borderRadius: '4px',
                  marginBottom: '10px',
                  fontSize: '10px',
                  lineHeight: '1.4',
                  color: '#475569',
                }}
              >
                <strong style={{ color: '#0f172a' }}>Hari Om! </strong>
                Your sacred Gotram and family sankalpa have been recorded in the temple
                records. The Archana and Vedic rituals will be performed by the temple purohits
                according to Agamic traditions. May divine grace illuminate your life with health,
                happiness, and peace.
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                  borderTop: '1px solid #e2e8f0',
                  paddingTop: '8px',
                  fontSize: '10px',
                  color: '#64748b',
                }}
              >
                <div>
                  <div>
                    <strong>Chinmaya Mission, Adoni</strong>
                  </div>
                  <div>Near Arts College / Hilltop Shrine, Adoni, AP - 518301</div>
                  <div>Helpline: +91 94402 85859 | Web: chinmayamissionadoni.org</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      width: '130px',
                      borderBottom: '1px dashed #94a3b8',
                      height: '26px',
                      marginBottom: '2px',
                    }}
                  ></div>
                  <div
                    style={{
                      fontSize: '9px',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      color: '#475569',
                    }}
                  >
                    Authorized Temple Seal / Signature
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}

      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">

      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className="relative bg-white rounded-3xl shadow-2xl border border-[#ECE3D4] w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden z-10 animate-in zoom-in-95 duration-200"
        style={{ fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" }}
      >
        <div className="h-1.5 w-full bg-gradient-to-r from-[var(--orange,#FF8A3D)] via-[#FFA14A] to-[var(--yellow,#D97706)] shrink-0" />

        <div className="px-5 sm:px-6 pt-5 pb-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-b from-[#FFFDF9] to-white shrink-0">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-10 h-10 rounded-2xl bg-[var(--orange)]/10 text-[var(--orange)] flex items-center justify-center shrink-0 shadow-sm">
              <Sparkles className="w-5 h-5 text-[var(--orange)]" />
            </div>
            <div className="min-w-0 flex-1">
              {step !== 'form' && (
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--orange)] block">
                  {step === 'review'
                    ? 'REVIEW & CONFIRM'
                    : step === 'proof'
                    ? 'PAYMENT VERIFICATION'
                    : 'SANKALPA RECORDED'}
                </span>
              )}
              <h2 className="text-lg sm:text-xl font-bold font-heading text-[#0A192F] leading-tight truncate">
                {step === 'review'
                  ? 'Review Details & Contribution'
                  : step === 'proof'
                  ? 'Submit Payment Verification'
                  : step === 'confirmed'
                  ? 'Sankalpa Registered'
                  : serviceDisplayName}
              </h2>
              {step !== 'form' && (
                <p className="text-xs text-slate-500 mt-0.5 truncate">
                  {step === 'review'
                    ? 'Verify your sacred details before offering seva'
                    : step === 'proof'
                    ? 'Share your payment details to WhatsApp or Email below'
                    : 'May the presiding deity bless you and your family'}
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer shrink-0 ml-2"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {step !== 'confirmed' && (
          <div className="px-5 sm:px-6 py-2.5 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between text-xs font-semibold shrink-0">
            <span className={`flex items-center gap-1.5 ${step === 'form' ? 'text-[var(--orange)] font-bold' : 'text-slate-700'}`}>
              <span className={`w-5 h-5 rounded-full font-bold flex items-center justify-center text-[11px] ${
                step === 'review' || step === 'proof' ? 'bg-emerald-600 text-white' : 'bg-[var(--orange)] text-white'
              }`}>
                {step === 'review' || step === 'proof' ? '✓' : '1'}
              </span>
              <span>Details</span>
            </span>
            <div className="h-0.5 flex-1 mx-2 sm:mx-3 bg-slate-200">
              <div
                className={`h-full bg-[var(--orange)] transition-all duration-300 ${
                  step === 'review' || step === 'proof' ? 'w-full' : 'w-0'
                }`}
              />
            </div>
            <span
              className={`flex items-center gap-1.5 ${
                step === 'review' ? 'text-[var(--orange)] font-bold' : step === 'proof' ? 'text-slate-700' : 'text-slate-400'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full font-bold flex items-center justify-center text-[11px] ${
                  step === 'proof'
                    ? 'bg-emerald-600 text-white'
                    : step === 'review'
                    ? 'bg-[var(--orange)] text-white'
                    : 'bg-white border border-slate-200 text-slate-400'
                }`}
              >
                {step === 'proof' ? '✓' : '2'}
              </span>
              <span>Review &amp; QR</span>
            </span>
            <div className="h-0.5 flex-1 mx-2 sm:mx-3 bg-slate-200">
              <div
                className={`h-full bg-[var(--orange)] transition-all duration-300 ${
                  step === 'proof' ? 'w-full' : 'w-0'
                }`}
              />
            </div>
            <span
              className={`flex items-center gap-1.5 ${
                step === 'proof' ? 'text-[var(--orange)] font-bold' : 'text-slate-400'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full font-bold flex items-center justify-center text-[11px] ${
                  step === 'proof'
                    ? 'bg-[var(--orange)] text-white'
                    : 'bg-white border border-slate-200 text-slate-400'
                }`}
              >
                3
              </span>
              <span>Payment Proof</span>
            </span>
          </div>
        )}

        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 flex-1 bg-white">
          {step === 'form' && (
            <form onSubmit={handleReviewClick} className="space-y-5">
              <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3.5">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-slate-200/70">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold font-heading text-[#0A192F]">
                      {serviceDisplayName}
                    </h3>
                    {(service.desc || service.descriptionText) && (
                      <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                        {service.desc || service.descriptionText}
                      </p>
                    )}
                  </div>
                  <div className="shrink-0 bg-white p-3 rounded-xl border border-slate-200 text-right sm:min-w-[130px] shadow-sm">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                      Offering Dakshina
                    </span>
                    <span className="text-base sm:text-xl font-black text-[var(--orange)]">
                      ₹{Number(currentAmount).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {service.options && service.options.length > 1 ? (
                  <div className="space-y-2.5 pt-1">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[var(--orange)]" />
                        <span>Available Poojas &amp; Sevas ({service.options.length} options)</span>
                      </label>
                      <span className="text-[11px] font-semibold text-[var(--orange)]">
                        Select your preferred pooja
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                      {service.options.map((opt) => {
                        const isSelected = selectedOption?.name === opt.name;
                        return (
                          <button
                            key={opt.name}
                            type="button"
                            onClick={() => setSelectedOption(opt)}
                            className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-2 ${
                              isSelected
                                ? 'bg-orange-50/80 border-[var(--orange)] ring-2 ring-[var(--orange)]/25 shadow-sm'
                                : 'bg-white border-slate-200 hover:border-[var(--orange)]/60 hover:bg-slate-50'
                            }`}
                          >
                            <div className="min-w-0 pr-2">
                              <span className="text-xs sm:text-[13px] font-bold text-[#0A192F] block leading-snug">
                                {opt.name}
                              </span>
                            </div>
                            <span className="text-xs sm:text-sm font-black text-[var(--orange)] shrink-0">
                              ₹{Number(opt.price).toLocaleString('en-IN')}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="pt-1">
                      <select
                        value={selectedOption?.name}
                        onChange={(e) => {
                          const opt = service.options.find((o) => o.name === e.target.value);
                          if (opt) setSelectedOption(opt);
                        }}
                        className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-slate-200 text-xs text-[#0A192F] font-medium focus:outline-none focus:ring-2 focus:ring-[var(--orange)] cursor-pointer"
                      >
                        {service.options.map((opt) => (
                          <option key={opt.name} value={opt.name}>
                            {opt.name} — ₹{opt.price.toLocaleString('en-IN')}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between text-xs sm:text-sm text-slate-700 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                    <span className="font-semibold">
                      Selected Seva: <strong className="text-[#0A192F]">{selectedOption?.name || serviceDisplayName}</strong>
                    </span>
                    <span className="font-black text-[var(--orange)]">
                      ₹{Number(currentAmount).toLocaleString('en-IN')}
                    </span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className={`w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--orange)] focus:border-transparent transition-all ${
                        errors.name ? 'border-red-400 bg-red-50/20' : 'border-slate-200 text-[#0A192F]'
                      }`}
                      required
                    />
                  </div>
                  {errors.name && <p className="text-xs text-red-500 font-medium">{errors.name}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      placeholder="10-digit number"
                      className={`w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--orange)] focus:border-transparent transition-all ${
                        errors.phoneNumber ? 'border-red-400 bg-red-50/20' : 'border-slate-200 text-[#0A192F]'
                      }`}
                      required
                    />
                  </div>
                  {errors.phoneNumber && (
                    <p className="text-xs text-red-500 font-medium">{errors.phoneNumber}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@example.com"
                      className={`w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--orange)] focus:border-transparent transition-all ${
                        errors.email ? 'border-red-400 bg-red-50/20' : 'border-slate-200 text-[#0A192F]'
                      }`}
                      required
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-red-500 font-medium">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Seva Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="date"
                      name="dob"
                      min={getMinSevaDate()}
                      value={formData.dob}
                      onChange={handleChange}
                      required
                      className={`w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--orange)] focus:border-transparent transition-all cursor-pointer ${
                        errors.dob ? 'border-red-400 bg-red-50/20' : 'border-slate-200 text-[#0A192F]'
                      }`}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Bookings must be made at least 2 days in advance. Past dates, today, and tomorrow are unavailable.
                  </p>
                  {errors.dob && (
                    <p className="text-xs text-red-500 font-medium">{errors.dob}</p>
                  )}
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Gotram (గోత్రం)
                  </label>
                  <div className="relative">
                    <Flame className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      name="gotram"
                      value={formData.gotram}
                      onChange={handleChange}
                      placeholder="e.g., Bharadwaja, Kaundinya, Kashyapa"
                      className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--orange)] focus:border-transparent transition-all text-[#0A192F]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Address (నివాసం)
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows={2}
                      placeholder="Door No, Street, City, State, Pincode"
                      className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--orange)] focus:border-transparent transition-all leading-relaxed resize-none text-[#0A192F]"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-sm font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary py-3 px-6 rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01]"
                >
                  <span>Book Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {step === 'review' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-5 relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2 text-[#0A192F]">
                    <ShieldCheck className="w-5 h-5 text-[var(--orange)]" />
                    <h4 className="font-heading font-bold text-base sm:text-lg">
                      Sankalpa &amp; Seva Summary
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep('form')}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[var(--orange)] hover:text-amber-700 bg-orange-50/80 px-3 py-1.5 rounded-lg border border-orange-200/60 transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Details</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3.5 gap-x-6 text-sm">
                  <div>
                    <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Seva Offering
                    </span>
                    <span className="font-bold text-[#0A192F] text-base">
                      {selectedOption ? selectedOption.name : serviceDisplayName}
                    </span>
                  </div>

                  <div>
                    <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Seva Price / Dakshina
                    </span>
                    <span className="font-bold text-[var(--orange)] text-base">
                      ₹{currentAmount.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div>
                    <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Devotee Name
                    </span>
                    <span className="font-bold text-[#0A192F] text-base">
                      {formData.name || '—'}
                    </span>
                  </div>

                  <div>
                    <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Phone Number
                    </span>
                    <span className="font-semibold text-slate-800">
                      {formData.phoneNumber || '—'}
                    </span>
                  </div>

                  <div>
                    <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Email Address
                    </span>
                    <span className="font-semibold text-slate-800">
                      {formData.email || '—'}
                    </span>
                  </div>

                  <div>
                    <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Seva Date
                    </span>
                    <span className="font-semibold text-slate-800">
                      {formData.dob
                        ? new Date(formData.dob).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })
                        : 'As Scheduled by Priest'}
                    </span>
                  </div>

                  <div className="sm:col-span-2">
                    <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Gotram
                    </span>
                    <span className="font-semibold text-[#0A192F]">
                      {formData.gotram || 'Not Specified'}
                    </span>
                  </div>

                  <div className="sm:col-span-2 pt-1 border-t border-slate-100">
                    <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Residential Address
                    </span>
                    <span className="font-medium text-slate-700 leading-relaxed">
                      {formData.address || 'Not Specified'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50/40 via-amber-50/30 to-slate-50 rounded-2xl border-2 border-dashed border-orange-200 p-6 text-center space-y-3 shadow-inner">
                <div className="w-16 h-16 rounded-2xl bg-white border border-orange-200 flex items-center justify-center mx-auto text-[var(--orange)] shadow-sm">
                  <QrCode className="w-8 h-8 text-[var(--orange)]" />
                </div>
                <div className="space-y-1">
                  <h5 className="font-heading font-bold text-base text-[#0A192F]">
                    Payment QR Code
                  </h5>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                    The official seva payment QR code will be displayed here for direct UPI / Net Banking transfer.
                  </p>
                </div>
                <div className="inline-block px-3.5 py-1.5 rounded-full bg-white border border-orange-200 text-xs font-bold text-[var(--orange)]">
                  ✨ QR Code will be printed / activated here shortly
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('form')}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Edit</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleDonePaymentClick}
                    className="btn-primary px-6 py-2.5 text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer shadow-md transition-all hover:scale-[1.01]"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Done / I Have Paid</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 'proof' && (
            <form onSubmit={handleSubmitProof} className="space-y-5">
              {errors.general && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm font-bold flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
                  <span>{errors.general}</span>
                </div>
              )}

              <div className="bg-orange-50/60 border border-orange-200/70 p-4 rounded-2xl text-xs sm:text-sm text-slate-700 leading-relaxed shadow-sm">
                <p className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-[var(--orange)] shrink-0 mt-0.5" />
                  <span>
                    Thank you for your payment! Please share your payment details below for the WhatsApp Number / Email Id.
                  </span>
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Seva Booking Details
                  </span>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                    <Check className="w-3 h-3" /> Details Pre-filled
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs sm:text-sm">
                  <div>
                    <span className="text-slate-400 block text-[11px] font-semibold uppercase">
                      Amount
                    </span>
                    <span className="font-extrabold text-[var(--orange)] text-base sm:text-lg">
                      ₹{Number(currentAmount).toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px] font-semibold uppercase">
                      Devotee Name
                    </span>
                    <span className="font-bold text-[#0A192F] truncate block">
                      {formData.name || '—'}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px] font-semibold uppercase">
                      Phone Number
                    </span>
                    <span className="font-semibold text-slate-800">
                      {formData.phoneNumber || '—'}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px] font-semibold uppercase">
                      Seva Offering
                    </span>
                    <span className="font-semibold text-slate-800 truncate block">
                      {selectedOption ? selectedOption.name : serviceDisplayName}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3.5 shadow-sm text-left">
                <p className="text-sm font-semibold text-[#0A192F] leading-snug">
                  Share the payment details to the what number or email attached below.
                </p>

                <div className="space-y-2 pt-1 border-t border-slate-200 text-xs sm:text-sm">
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-slate-700">whats app number :</span>
                    <a
                      href="https://wa.me/917337351555"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono font-bold text-emerald-700 hover:text-emerald-800 hover:underline"
                    >
                      +91 7337351555
                    </a>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-slate-700">Email id:</span>
                    <a
                      href="mailto:Chinmayamission01@gmail.com"
                      className="font-mono font-bold text-[var(--orange)] hover:underline"
                    >
                      Chinmayamission01@gmail.com
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('review')}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to QR Code</span>
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary px-6 py-2.5 text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer shadow-md transition-all hover:scale-[1.01]"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isSubmitting ? 'Submitting...' : 'Done'}</span>
                </button>
              </div>
            </form>
          )}

          {step === 'confirmed' && (
            <div className="text-center py-6 sm:py-8 space-y-5">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto border-2 border-emerald-300">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-2 max-w-md mx-auto">
                <h4 className="text-xl sm:text-2xl font-bold font-heading text-[#0A192F]">
                  Seva Booking &amp; Payment Proof Submitted!
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Hari Om, <strong>{formData.name}</strong>. Thank you for booking{' '}
                  <strong className="text-[#0A192F]">{bookingReceipt?.pujaName}</strong> at{' '}
                  <strong>{bookingReceipt?.templeName}</strong>. Your sacred details and payment proof have been recorded.
                </p>
              </div>

              {bookingReceipt && (
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 max-w-md mx-auto text-xs text-slate-700 space-y-2.5 shadow-sm text-left">
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500 font-semibold uppercase tracking-wider text-[11px]">Booking Reference</span>
                    <span className="font-mono font-bold text-[var(--orange)] text-xs">{bookingReceipt.refId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Seva Offering:</span>
                    <span className="font-bold text-[#0A192F]">{bookingReceipt.pujaName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Amount:</span>
                    <span className="font-extrabold text-[#0A192F] text-sm">₹{Number(bookingReceipt.amount).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">UTR / Transaction ID:</span>
                    <span className="font-mono font-bold text-slate-800">{bookingReceipt.utrId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Devotee Name:</span>
                    <span className="font-medium text-slate-800">{bookingReceipt.name}</span>
                  </div>
                  {bookingReceipt.nakshetra && (
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Nakshatra:</span>
                      <span className="font-medium text-slate-800">{bookingReceipt.nakshetra}</span>
                    </div>
                  )}
                  {(bookingReceipt.date || formData.dob) && (
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Seva Date:</span>
                      <span className="font-semibold text-slate-800">
                        {new Date(bookingReceipt.date || formData.dob).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between pt-1 border-t border-slate-200">
                    <span className="text-slate-500 font-medium">Status:</span>
                    <span className="font-bold text-emerald-600">✓ Payment Proof Submitted</span>
                  </div>
                </div>
              )}

              <div className="pt-2 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-primary px-8 py-3 rounded-xl text-sm font-bold cursor-pointer shadow-md text-white transition-all hover:scale-[1.01]"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>

    <AuthModal
      isOpen={authModalOpen}
      onClose={() => setAuthModalOpen(false)}
      onSuccess={(user) => {
        setAuthModalOpen(false);
        if (user) {
          setFormData((prev) => ({
            ...prev,
            name: prev.name || user.fullName || '',
            phoneNumber: prev.phoneNumber || user.phone || '',
            email: prev.email || user.email || '',
          }));
        }
        setStep('review');
      }}
      title="Devotee Sign In Required"
      subtitle="Please sign in or create an account to book your sacred seva and confirm your blessings."
    />
    </>
  );
}

// Devotee Bookings Drawer / Modal
export function MyBookingsModal({ open, onClose }) {
  const { isUserAuthenticated } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    const local = getStoredBookings();
    setBookings(local);

    if (isUserAuthenticated) {
      setLoading(true);
      sevaBookingService
        .getMyBookings()
        .then((res) => {
          if (res.data?.data && Array.isArray(res.data.data)) {
            const serverBookings = res.data.data;
            const combinedMap = new Map();
            serverBookings.forEach((b) => combinedMap.set(b.bookingId || b.refId, b));
            local.forEach((b) => {
              const id = b.bookingId || b.refId;
              if (id && !combinedMap.has(id)) combinedMap.set(id, b);
            });
            setBookings(Array.from(combinedMap.values()));
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [open, isUserAuthenticated]);

  if (!open) return null;

  const clearAll = () => {
    if (window.confirm('Clear all stored booking records from this browser?')) {
      localStorage.removeItem('temple_seva_bookings');
      setBookings([]);
    }
  };

  return (
    <div className="seva-modal-backdrop" onClick={onClose}>
      <div
        className="seva-modal"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 680, fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" }}
      >
        <button className="seva-modal-close" onClick={onClose}>
          ×
        </button>

        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <span
            className="seva-eyebrow"
            style={{ color: '#FFA048', fontWeight: 700, letterSpacing: '0.28em' }}
          >
            Your Records
          </span>
          <h2
            style={{
              marginTop: 12,
              fontSize: 30,
              color: '#FFFFFF',
              fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif",
              fontWeight: 700,
            }}
          >
            Registered Sevas
          </h2>
        </div>

        {bookings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#E2E8F0' }}>
            <p style={{ fontStyle: 'italic', fontSize: 18, marginBottom: 16, color: '#FFFFFF' }}>
              No sevas booked yet in this session.
            </p>
            <p style={{ fontSize: 14, color: '#94A3B8' }}>
              Click "Book Seva" on any seva below to register your sacred intention.
            </p>
          </div>
        ) : (
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 16,
              }}
            >
              <span style={{ fontSize: 13, color: 'var(--seva-ivory-faint)' }}>
                Total Bookings: {bookings.length}
              </span>
              <button
                onClick={clearAll}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#ff7675',
                  fontSize: 12,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                Clear History
              </button>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
                maxHeight: 400,
                overflowY: 'auto',
                paddingRight: 4,
              }}
            >
              {bookings.map((b, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(255, 122, 46, 0.04)',
                    border: '1px solid var(--seva-line-soft)',
                    padding: '16px 20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span
                      style={{
                        fontWeight: 600,
                        color: 'var(--seva-gold)',
                        fontSize: 16,
                      }}
                    >
                      {b.pujaName}
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--seva-f-mono)',
                        fontSize: 11,
                        color: 'var(--seva-ivory-faint)',
                      }}
                    >
                      {b.refId}
                    </span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: 14,
                      color: 'var(--seva-ivory-dim)',
                    }}
                  >
                    <span>
                      Devotee: {b.name} {b.gotra ? `(${b.gotra} gotra)` : ''}
                    </span>
                    <span>Date: {b.date}</span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: 13,
                      color: 'var(--seva-ivory-faint)',
                      marginTop: 4,
                    }}
                  >
                    <span>Nakshatra: {b.nakshetra}</span>
                    <span style={{ color: '#2ecc71' }}>✓ Direct Confirmed</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ marginTop: 28, textAlign: 'center' }}>
          <button
            className="seva-btn"
            style={{ width: 'auto', padding: '10px 30px' }}
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export const TempleSevaSection = () => {
  const location = useLocation();
  const [activeService, setActiveService] = useState(null);
  const [bookingsCount, setBookingsCount] = useState(0);
  const [myBookingsOpen, setMyBookingsOpen] = useState(false);
  const [highlightedId, setHighlightedId] = useState(null);

  const refreshCount = () => {
    setBookingsCount(getStoredBookings().length);
  };

  useEffect(() => {
    refreshCount();
  }, []);

  useEffect(() => {
    const checkHighlight = () => {
      const hash = (window.location.hash || location.hash || '').replace('#', '').toLowerCase();
      const searchParams = new URLSearchParams(window.location.search || location.search || '');
      const highlightParam = (searchParams.get('highlight') || '').toLowerCase();

      if (
        hash === 'maha-shivaratri' ||
        hash === 'maha_shivaratri' ||
        hash === 'mahashivaratri' ||
        highlightParam === 'maha-shivaratri' ||
        highlightParam === 'maha_shivaratri'
      ) {
        setHighlightedId('maha-shivaratri');

        const scrollTimer1 = setTimeout(() => {
          const card =
            document.getElementById('maha-shivaratri') ||
            document.querySelector('[data-service-id="maha-shivaratri"]');
          if (card) {
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 150);

        const scrollTimer2 = setTimeout(() => {
          const card =
            document.getElementById('maha-shivaratri') ||
            document.querySelector('[data-service-id="maha-shivaratri"]');
          if (card) {
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 450);

        return () => {
          clearTimeout(scrollTimer1);
          clearTimeout(scrollTimer2);
        };
      }
    };

    checkHighlight();
    window.addEventListener('hashchange', checkHighlight);
    return () => window.removeEventListener('hashchange', checkHighlight);
  }, [location.hash, location.search]);

  const handleBookClick = (p) => {
    setActiveService(p);
  };

  return (
    <div className="temple-seva-wrapper">
      <header className="seva-top-bar">
        <a href="#services" className="seva-temple-brand">
          <span className="seva-temple-om">ॐ</span>
          <span className="seva-temple-title whitespace-nowrap">Shri Shantamalleshwara Swami Temple</span>
        </a>

        <div className="seva-top-actions">
          <button className="seva-my-bookings-btn" onClick={() => setMyBookingsOpen(true)}>
            <span>My Bookings</span>
            {bookingsCount > 0 && <span className="seva-booking-badge">{bookingsCount}</span>}
          </button>
        </div>
      </header>

      <section id="services" className="seva-section" data-screen-label="03 Pooja Timings">
        <div className="seva-ambient-glow-bottom"></div>

        <div className="seva-container">
          <div className="seva-header-block">
            <h2>
              The Hours of <span className="seva-serif-display" style={{ color: 'var(--seva-gold)' }}>Devotion &amp; Seva</span>
            </h2>
            <p className="seva-header-description">
              Let every prayer become an offering and every offering a path to the Divine. Choose a sacred seva and seek blessings through rituals performed with devotion and grace.
            </p>
          </div>

          <div className="seva-grid">
            {POOJA_SERVICES.map((p) => {
              const isShivaratri = p.id === 'maha-shivaratri';
              const isHighlighted =
                isShivaratri &&
                (highlightedId === 'maha-shivaratri' ||
                  (location.hash && location.hash.toLowerCase().includes('maha-shivaratri')));

              return (
                <div
                  key={p.id}
                  id={p.id}
                  data-service-id={p.id}
                  className={`seva-card seva-pooja-card ${
                    isHighlighted ? 'seva-card-highlighted' : ''
                  }`}
                >
                  {isHighlighted && (
                    <div className="seva-highlight-banner" aria-label="Magha Masam Poojalu">
                      <span className="seva-highlight-dot" />
                      <span>Magha Masam Poojalu</span>
                    </div>
                  )}

                  <div className="seva-pooja-card-icon">{p.icon}</div>

                  <h3>
                    {p.name.includes('|') ? (
                      p.name.split('|').map((line, li) => (
                        <React.Fragment key={li}>
                          {line}
                          {li === 0 && <br />}
                        </React.Fragment>
                      ))
                    ) : (
                      p.name
                    )}
                  </h3>

                  <div className="seva-pooja-card-desc">{p.desc}</div>

                  <button
                    className={`seva-btn ${isHighlighted ? 'seva-btn-highlighted' : ''}`}
                    onClick={() => handleBookClick(p)}
                    aria-label={`Book ${p.name.replace('|', ' ')}`}
                  >
                    Book Now
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {activeService && (
        <UnifiedBookingModal
          service={activeService}
          onClose={() => setActiveService(null)}
          onBookingSuccess={refreshCount}
        />
      )}

      <MyBookingsModal open={myBookingsOpen} onClose={() => setMyBookingsOpen(false)} />
    </div>
  );
};

export default TempleSevaSection;
