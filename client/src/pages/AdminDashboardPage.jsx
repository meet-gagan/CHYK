import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  adminService,
  eventService,
  bannerService,
  activityService,
  faqService,
  registrationService,
  contentService,
} from '../services/api';
import { HomePageManager } from './admin/HomePageManager';
import { FooterManager } from './admin/FooterManager';
import { AdminImagesPage } from './admin/AdminImagesPage';
import { LetsConnectManager } from './admin/LetsConnectManager';
import { GeneralEnquiryManager } from './admin/GeneralEnquiryManager';
import { VolunteeringManager } from './admin/VolunteeringManager';
import { UserManager } from './admin/UserManager';
import { AdminProfileManager } from './admin/AdminProfileManager';
import { StoryBoardManager } from './admin/StoryBoardManager';
import { UpdateContentManager } from './admin/UpdateContentManager';
import { SevaBookingsManager } from './admin/SevaBookingsManager';
import { MarathonImagesManager } from './admin/MarathonImagesManager';
import { AdminVideosPage } from './admin/AdminVideosPage';
import { GalleryManager } from './admin/GalleryManager';
import { TermsPrivacyManager } from './admin/TermsPrivacyManager';
import { RegistrationSummaryCards } from '../components/admin/RegistrationSummaryCards';
import { ClassSummary } from '../components/admin/ClassSummary';
import { RegistrationDetailsModal } from '../components/admin/RegistrationDetailsModal';
import { RegistrationEditModal } from '../components/admin/RegistrationEditModal';
import {
  Landmark,
  Shield,
  Globe,
  MessageSquareQuote,
  Users,
  Building,
  Calendar,
  FileSpreadsheet,
  Upload,
  Search,
  Filter,
  Download,
  Settings,
  Image as ImageIcon,
  Flame,
  Video,
  HelpCircle,
  KeyRound,
  CheckCircle,
  XCircle,
  RefreshCw,
  LogOut,
  Award,
  Layout,
  Trash2,
  Eye,
  EyeOff,
  Shirt,
  Pencil,
  GraduationCap,
  MessageSquare,
  UserCheck,
  HeartHandshake,
  AlertTriangle,
  Folder,
  Scale,
} from 'lucide-react';

export const AdminDashboardPage = ({ defaultTab }) => {
  const { adminUser, user, isAdmin, logoutAdmin, logout } = useAuth();
  const getTabFromUrl = () => {
    if (defaultTab) return defaultTab;
    const path = typeof window !== 'undefined' ? window.location.pathname : '';
    if (path.includes('/admin/users')) return 'USERS';
    if (path.includes('/admin/story-board') || path.includes('/admin/storyboard')) return 'STORY_BOARD';
    if (path.includes('/admin/profile')) return 'ADMIN_PROFILE';
    if (path.includes('/admin/registrations')) return 'REGISTRATIONS';
    if (path.includes('/admin/event-config')) return 'EVENT_CONFIG';
    if (path.includes('/admin/marathon-images') || path.includes('/admin/marathon')) return 'MARATHON_IMAGES';
    if (path.includes('/admin/videos') || path.includes('/admin/youtube') || path.includes('/admin/udaan')) return 'VIDEOS';
    if (path.includes('/admin/change-password')) return 'PASSWORD';
    if (path.includes('/admin/general-enquiry') || path.includes('/admin/general-enquiries') || path.includes('/admin/enquiries')) return 'GENERAL_ENQUIRY';
    if (path.includes('/admin/lets-connect')) return 'LETS_CONNECT';
    if (path.includes('/admin/volunteering')) return 'VOLUNTEERING';
    if (path.includes('/admin/gallery')) return 'GALLERY';
    if (path.includes('/admin/images')) return 'IMAGES';
    if (path.includes('/admin/update-content') || path.includes('/admin/content')) return 'UPDATE_CONTENT';
    if (path.includes('/admin/footer')) return 'FOOTER_CMS';
    if (path.includes('/admin/home')) return 'HOME_PAGE';
    if (path.includes('/admin/terms-privacy') || path.includes('/admin/terms') || path.includes('/admin/privacy') || path.includes('/admin/tc-and-pp')) return 'TERMS_PRIVACY';
    if (path.includes('/admin/bookings') || path.includes('/admin/seva-bookings') || path.includes('/admin/donations')) return 'BOOKINGS';
    return 'STATS';
  };

  const [activeTab, setActiveTab] = useState(getTabFromUrl);

  useEffect(() => {
    if (defaultTab) {
      setActiveTab(defaultTab);
    }
  }, [defaultTab]);
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // Registrations Tab State
  const [regType, setRegType] = useState('ALL'); // ALL | INDIVIDUAL | SCHOOL_COLLEGE | BATCHES
  const [registrations, setRegistrations] = useState([]);
  const [regPagination, setRegPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterInstitution, setFilterInstitution] = useState('ALL');
  const [filterSize, setFilterSize] = useState('ALL');
  const [filterStandard, setFilterStandard] = useState('ALL');
  const [institutions, setInstitutions] = useState([]);
  const [summaryData, setSummaryData] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [loadingRegistrations, setLoadingRegistrations] = useState(false);
  const [viewingRegistration, setViewingRegistration] = useState(null);
  const [editingRegistration, setEditingRegistration] = useState(null);

  // Bulk Delete Registrations State
  const [selectedRegIds, setSelectedRegIds] = useState([]);
  const [showBulkDeleteRegModal, setShowBulkDeleteRegModal] = useState(false);
  const [bulkDeletingReg, setBulkDeletingReg] = useState(false);

  useEffect(() => {
    setSelectedRegIds([]);
  }, [regType, searchTerm, filterInstitution, filterSize, filterStandard, regPagination.page]);

  const isAllRegSelected =
    registrations.length > 0 &&
    registrations.every((r) => selectedRegIds.includes(r.registrationId || r._id));
  const isSomeRegSelected =
    registrations.some((r) => selectedRegIds.includes(r.registrationId || r._id)) &&
    !isAllRegSelected;

  const handleToggleSelectAllReg = () => {
    if (isAllRegSelected) {
      setSelectedRegIds([]);
    } else {
      setSelectedRegIds(registrations.map((r) => r.registrationId || r._id));
    }
  };

  const handleToggleSelectReg = (id) => {
    setSelectedRegIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleConfirmBulkDeleteReg = async () => {
    if (selectedRegIds.length === 0) return;
    setBulkDeletingReg(true);
    try {
      const res = await adminService.bulkDeleteRegistrations(selectedRegIds);
      if (res.data?.success) {
        alert(res.data.message || `Successfully deleted ${selectedRegIds.length} registration(s).`);
        setSelectedRegIds([]);
        setShowBulkDeleteRegModal(false);
        loadRegistrations();
        loadRegistrationSummary();
        loadDashboardStats();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to bulk delete registrations.');
    } finally {
      setBulkDeletingReg(false);
    }
  };

  // Batches Tab State
  const [batches, setBatches] = useState([]);
  const [selectedBatchStudents, setSelectedBatchStudents] = useState(null);

  // Event Config Tab State
  const [eventForm, setEventForm] = useState({
    programName: '',
    slogan: '',
    venue: '',
    eventDate: '',
    registrationEndDate: '2026-11-30T23:59',
    registrationOpen: true,
  });
  const [configSaving, setConfigSaving] = useState(false);

  // Password State
  const [pwdForm, setPwdForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwdStatus, setPwdStatus] = useState({ success: false, error: null, message: '' });
  const [pwdSaving, setPwdSaving] = useState(false);
  const [showCurrentPwd, setShowCurrentPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin/login');
      return;
    }

    loadDashboardStats();
    loadInstitutionsList();
  }, [isAdmin]);

  const loadDashboardStats = () => {
    setLoadingStats(true);
    adminService.getStats().then((res) => {
      if (res.data?.success) setStats(res.data.data);
    }).catch(() => { }).finally(() => setLoadingStats(false));
  };

  const loadInstitutionsList = () => {
    registrationService.getInstitutions().then((res) => {
      if (res.data?.success) setInstitutions(res.data.data);
    }).catch(() => { });
  };

  // Fetch Registrations or Bulk Batches
  useEffect(() => {
    if (activeTab === 'REGISTRATIONS') {
      if (regType === 'BATCHES') {
        loadBatches();
      } else {
        loadRegistrations();
      }
      loadRegistrationSummary();
    }
  }, [activeTab, regType, searchTerm, filterStandard, filterInstitution, filterSize, regPagination.page]);

  const loadRegistrations = () => {
    setLoadingRegistrations(true);
    adminService
      .getRegistrations({
        type: regType === 'ALL' ? undefined : regType,
        search: searchTerm,
        standard: filterStandard !== 'ALL' ? filterStandard : undefined,
        institution: filterInstitution !== 'ALL' ? filterInstitution : undefined,
        size: filterSize !== 'ALL' ? filterSize : undefined,
        page: regPagination.page,
      })
      .then((res) => {
        if (res.data?.success) {
          setRegistrations(res.data.data.items);
          setRegPagination(res.data.data.pagination);
        }
      })
      .catch(() => { })
      .finally(() => setLoadingRegistrations(false));
  };

  const loadRegistrationSummary = () => {
    setLoadingSummary(true);
    adminService
      .getRegistrationSummary()
      .then((res) => {
        if (res.data?.success) {
          setSummaryData(res.data.data);
        }
      })
      .catch(() => { })
      .finally(() => setLoadingSummary(false));
  };

  const handleDeleteRegistration = async (id, name) => {
    if (
      !window.confirm(
        `Are you sure you want to delete registration ${id} (${name})? The record will be permanently deleted, and the ID sequence will continue safely without reuse.`
      )
    ) {
      return;
    }
    try {
      const res = await adminService.deleteRegistration(id);
      if (res.data?.success) {
        alert(res.data.message || 'Registration deleted successfully.');
        loadRegistrations();
        loadRegistrationSummary();
        loadDashboardStats();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete registration.');
    }
  };

  const handleRegistrationUpdated = (updated) => {
    alert(`Registration ${updated.registrationId} updated successfully.`);
    loadRegistrations();
    loadRegistrationSummary();
  };

  const loadBatches = () => {
    adminService
      .getBatches()
      .then((res) => {
        if (res.data?.success) setBatches(res.data.data);
      })
      .catch(() => { });
  };

  // Fetch Event Config
  useEffect(() => {
    if (activeTab === 'EVENT_CONFIG') {
      eventService.getConfig().then((res) => {
        if (res.data?.success) {
          const cfg = res.data.data;
          setEventForm({
            programName: cfg.programName,
            slogan: cfg.slogan,
            venue: cfg.venue,
            eventDate: cfg.eventDate ? new Date(cfg.eventDate).toISOString().substring(0, 16) : '',
            registrationEndDate: cfg.registrationEndDate
              ? new Date(cfg.registrationEndDate).toISOString().substring(0, 16)
              : '2026-11-30T23:59',
            registrationOpen: cfg.registrationOpen,
          });
        }
      }).catch(() => { });
    }
  }, [activeTab]);

  // Save Event Config
  const handleSaveEventConfig = async (e) => {
    e.preventDefault();
    setConfigSaving(true);
    try {
      await eventService.updateConfig(eventForm);
      alert('Event Configuration updated successfully!');
    } catch (err) {
      alert('Failed to update event configuration');
    } finally {
      setConfigSaving(false);
    }
  };

  // File Size Formatter Helper
  const formatFileSize = (bytes) => {
    if (!bytes) return null;
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Download Batch Spreadsheet File
  const handleDownloadBatchSheet = async (batch) => {
    try {
      const res = await adminService.downloadBatchSpreadsheet(batch.batchId);
      const blob = new Blob([res.data], {
        type: batch.fileMimeType || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = batch.fileName || `${(batch.institutionName || 'Batch').replace(/\s+/g, '_')}_${batch.batchId}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download batch spreadsheet failed:', err);
      alert('Failed to download spreadsheet file for this batch.');
    }
  };

  // Delete Bulk Batch
  const handleDeleteBatch = async (batchId, instName) => {
    if (!window.confirm(`Are you sure you want to delete the batch for "${instName || batchId}"? This will also remove all student records under this batch.`)) {
      return;
    }
    try {
      const res = await adminService.deleteBatch(batchId);
      if (res.data?.success) {
        alert('Batch deleted successfully.');
        loadBatches();
        loadDashboardStats();
      }
    } catch (err) {
      alert('Failed to delete batch.');
    }
  };

  // Export CSV Helper
  const exportRegistrationsCSV = () => {
    if (regType !== 'BATCHES') {
      if (registrations.length === 0) {
        alert('No registration records to export.');
        return;
      }
      let csv = 'Registration ID,Student Name,Age,Standard / Class,Profession,Contact Number,School / College,T-Shirt Size,Type,Date\n';
      registrations.forEach((r) => {
        csv += `"${r.registrationId}","${r.fullName}","${r.age ?? 'N/A'}","${r.standard ?? 'N/A'}","${r.profession ?? 'N/A'}","${r.contactNumber}","${r.institutionName}","${r.tShirtSize}","${r.registrationType}","${new Date(r.createdAt).toISOString()}"\n`;
      });
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Registrations_${regType}_${Date.now()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      if (batches.length === 0) return;
      let csv = 'Batch ID,Institution Name,Institution Type,Contact Person,Phone,Total Students,Uploaded File,Submission Date\n';
      batches.forEach((b) => {
        csv += `"${b.batchId}","${b.institutionName}","${b.institutionType || 'N/A'}","${b.contactPersonName}","${b.phone}","${b.totalStudents}","${b.fileName || 'N/A'}","${new Date(b.createdAt).toISOString()}"\n`;
      });
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `School_College_Batches_${Date.now()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const filteredBatches = batches.filter((b) => {
    const q = searchTerm.trim().toLowerCase();
    const matchesSearch = !q || (
      (b.batchId && b.batchId.toLowerCase().includes(q)) ||
      (b.institutionName && b.institutionName.toLowerCase().includes(q)) ||
      (b.contactPersonName && b.contactPersonName.toLowerCase().includes(q)) ||
      (b.phone && b.phone.toLowerCase().includes(q)) ||
      (b.fileName && b.fileName.toLowerCase().includes(q))
    );
    const matchesInst = filterInstitution === 'ALL' || b.institutionName === filterInstitution;
    return matchesSearch && matchesInst;
  });

  return (
    <div className="min-h-screen py-10 px-4 max-w-7xl mx-auto space-y-8">

      {/* Admin Navbar Header */}
      <div className="glass-card p-6 rounded-3xl border-2 border-[var(--cyan)]/30 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[var(--cyan)] text-white flex items-center justify-center shadow-lg">
            <Shield className="w-7 h-7" />
          </div>
          <div>
            <span className="px-3 py-1 rounded-full bg-[var(--cyan)]/15 text-[var(--cyan)] text-[10px] font-extrabold uppercase">
              ADMIN CONTROL PANEL
            </span>
            <h1 className="text-2xl font-black font-heading text-[var(--text-primary)]">
              Chinmaya Mission Management System
            </h1>
            <p className="text-xs text-[var(--text-muted)] font-semibold">
              Chinmaya Mission • Chinmaya Yuva Kendra
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-left">
            <div className="w-8 h-8 rounded-full bg-[var(--cyan)] text-white flex items-center justify-center font-black text-xs shadow-sm">
              {adminUser?.fullName ? adminUser.fullName.charAt(0).toUpperCase() : 'A'}
            </div>
            <div>
              <p className="text-xs font-extrabold text-[var(--text-primary)] truncate max-w-[160px]">
                {adminUser?.fullName || 'Chinmaya Admin'}
              </p>
              <span className="text-[10px] font-mono font-bold text-[var(--cyan)] block">
                {adminUser?.email || adminUser?.phone || 'admin@anti-drug-marathon.org'}
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              if (logoutAdmin) logoutAdmin();
              else logout();
              navigate('/admin/login');
            }}
            className="btn-secondary text-xs py-2.5 px-5 border-red-500/30 text-red-500"
          >
            <LogOut className="w-4 h-4" />
            <span>ADMIN LOGOUT</span>
          </button>
        </div>
      </div>

      {/* Admin Tabs Bar */}
      <div className="flex flex-wrap items-center gap-2 p-2 rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--border-color)]">
        {[
          { id: 'STATS', label: 'Dashboard Stats', icon: Users },
          { id: 'STORY_BOARD', label: 'Story Board', icon: MessageSquareQuote },
          { id: 'USERS', label: 'User Directory', icon: UserCheck },
          { id: 'ADMIN_PROFILE', label: 'Admin Profile', icon: Shield },
          { id: 'UPDATE_CONTENT', label: 'Update Content', icon: Globe },
          { id: 'GENERAL_ENQUIRY', label: 'General Enquiry', icon: HelpCircle },
          { id: 'LETS_CONNECT', label: "Let's Connect", icon: MessageSquare },
          { id: 'VOLUNTEERING', label: 'Volunteering', icon: HeartHandshake },
          { id: 'BOOKINGS', label: 'Bookings', icon: Landmark },
          { id: 'MARATHON_IMAGES', label: 'Marathon Images', icon: Flame },
          { id: 'VIDEOS', label: 'Udaan (Videos)', icon: Video },
          { id: 'GALLERY', label: 'Gallery Management', icon: Folder },
          { id: 'IMAGES', label: 'Images & Media', icon: ImageIcon },
          { id: 'HOME_PAGE', label: 'Home Page CMS', icon: Layout },
          { id: 'TERMS_PRIVACY', label: 'T&C and PP', icon: Scale },
          { id: 'FOOTER_CMS', label: 'Footer CMS', icon: Settings },
          { id: 'REGISTRATIONS', label: 'Registrations', icon: Award },
          { id: 'EVENT_CONFIG', label: 'Event Control', icon: Settings },
          { id: 'PASSWORD', label: 'Change Password', icon: KeyRound },
        ].map((tabItem) => {
          const IconComp = tabItem.icon;
          return (
            <button
              key={tabItem.id}
              onClick={() => setActiveTab(tabItem.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${activeTab === tabItem.id
                ? 'bg-[var(--cyan)] text-white shadow-lg'
                : 'text-[var(--text-primary)] hover:bg-[var(--bg-primary)]'
                }`}
            >
              <IconComp className="w-4 h-4" />
              <span>{tabItem.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB: SEVAS & DEVOTEE CONTRIBUTIONS / BOOKINGS */}
      {(activeTab === 'BOOKINGS' || activeTab === 'SEVA_BOOKINGS') && <SevaBookingsManager />}

      {/* TAB: MULTI-WEBSITE UPDATE CONTENT CMS */}
      {activeTab === 'UPDATE_CONTENT' && <UpdateContentManager />}

      {/* TAB: STORY BOARD MODERATION */}
      {activeTab === 'STORY_BOARD' && <StoryBoardManager />}

      {/* TAB: USER MANAGEMENT DIRECTORY */}
      {activeTab === 'USERS' && <UserManager />}

      {/* TAB: DEDICATED ADMIN PROFILE */}
      {activeTab === 'ADMIN_PROFILE' && <AdminProfileManager />}

      {/* TAB: GENERAL ENQUIRY INBOX */}
      {activeTab === 'GENERAL_ENQUIRY' && <GeneralEnquiryManager />}

      {/* TAB: LET'S CONNECT INBOX */}
      {activeTab === 'LETS_CONNECT' && <LetsConnectManager />}

      {/* TAB: VOLUNTEERING APPLICATIONS */}
      {activeTab === 'VOLUNTEERING' && <VolunteeringManager />}

      {/* TAB: MARATHON WEBSITE IMAGES & ASSETS */}
      {activeTab === 'MARATHON_IMAGES' && <MarathonImagesManager />}

      {/* TAB: YOUTUBE VIDEO MANAGEMENT */}
      {activeTab === 'VIDEOS' && <AdminVideosPage />}

      {/* TAB: SACRED GALLERY MANAGEMENT */}
      {activeTab === 'GALLERY' && <GalleryManager />}

      {/* TAB: IMAGES & MEDIA LIBRARY */}
      {activeTab === 'IMAGES' && <AdminImagesPage />}

      {/* TAB: HOME PAGE CMS */}
      {activeTab === 'HOME_PAGE' && <HomePageManager />}

      {/* TAB: FOOTER CMS */}
      {activeTab === 'FOOTER_CMS' && <FooterManager />}

      {/* TAB: TERMS & CONDITIONS AND PRIVACY POLICY (T&C and PP) */}
      {activeTab === 'TERMS_PRIVACY' && <TermsPrivacyManager />}

      {/* TAB 1: DASHBOARD OVERVIEW STATS */}
      {activeTab === 'STATS' && (
        <div className="space-y-8 animate-in fade-in">
          {loadingStats ? (
            <div className="text-center py-12 text-[var(--text-muted)] font-bold">
              Loading dashboard statistics...
            </div>
          ) : stats ? (
            <>
              {/* Metric Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="p-6 rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-color)] shadow-xl">
                  <span className="text-xs font-extrabold text-[var(--orange)] block mb-1">TOTAL REGISTRATIONS</span>
                  <h3 className="text-3xl font-black text-[var(--text-primary)] font-heading">{stats.totalRegistrations}</h3>
                </div>

                <div className="p-6 rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-color)] shadow-xl">
                  <span className="text-xs font-extrabold text-[var(--cyan)] block mb-1">FORM REGISTRATIONS</span>
                  <h3 className="text-3xl font-black text-[var(--text-primary)] font-heading">{stats.formRegistrations}</h3>
                </div>

                <div className="p-6 rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-color)] shadow-xl">
                  <span className="text-xs font-extrabold text-[var(--yellow)] block mb-1">SCHOOL/COLLEGE BULK</span>
                  <h3 className="text-3xl font-black text-[var(--text-primary)] font-heading">{stats.schoolCollegeRegistrations}</h3>
                </div>

                <div className="p-6 rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-color)] shadow-xl">
                  <span className="text-xs font-extrabold text-[var(--green)] block mb-1">TODAY'S REGISTRATIONS</span>
                  <h3 className="text-3xl font-black text-[var(--text-primary)] font-heading">{stats.todayRegistrations}</h3>
                </div>
              </div>

              {/* Institution & Batch Summary Pills */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="p-6 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-center">
                  <span className="text-xs font-bold text-[var(--text-muted)] block">PRELOADED SCHOOLS</span>
                  <span className="text-2xl font-black text-[var(--text-primary)]">{stats.totalSchools}</span>
                </div>
                <div className="p-6 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-center">
                  <span className="text-xs font-bold text-[var(--text-muted)] block">PRELOADED COLLEGES</span>
                  <span className="text-2xl font-black text-[var(--text-primary)]">{stats.totalColleges}</span>
                </div>
                <div className="p-6 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-center">
                  <span className="text-xs font-bold text-[var(--text-muted)] block">UPLOADED BATCHES</span>
                  <span className="text-2xl font-black text-[var(--text-primary)]">{stats.totalBatches}</span>
                </div>
              </div>

              {/* Recent Registrations Table */}
              <div className="glass-card p-6 rounded-3xl border border-[var(--border-color)] space-y-4">
                <h4 className="text-lg font-extrabold font-heading text-[var(--text-primary)]">
                  RECENT REGISTRATIONS LOG
                </h4>
                <div className="overflow-x-auto rounded-2xl border border-[var(--border-color)]">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[var(--bg-tertiary)] text-[var(--text-primary)] font-extrabold uppercase">
                      <tr>
                        <th className="p-3">Registration ID</th>
                        <th className="p-3">Full Name</th>
                        <th className="p-3">Institution</th>
                        <th className="p-3">Phone</th>
                        <th className="p-3">Size</th>
                        <th className="p-3">Type</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-color)]/30 text-[var(--text-primary)]">
                      {stats.recentRegistrations.map((item) => (
                        <tr key={item._id}>
                          <td className="p-3 font-mono font-bold text-[var(--orange)]">{item.registrationId}</td>
                          <td className="p-3 font-extrabold">{item.fullName}</td>
                          <td className="p-3 font-medium">{item.institutionName}</td>
                          <td className="p-3">{item.contactNumber}</td>
                          <td className="p-3 font-bold">{item.tShirtSize}</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[var(--cyan)]/15 text-[var(--cyan)]">
                              {item.registrationType}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : null}
        </div>
      )}

      {/* TAB 2: REGISTRATIONS MANAGEMENT */}
      {activeTab === 'REGISTRATIONS' && (
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-[var(--border-color)] space-y-8 animate-in fade-in">

          {/* Header & Export Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-[var(--orange)]/15 text-[var(--orange)]">
                  <Award className="w-5 h-5" />
                </span>
                <h3 className="text-2xl font-black font-heading text-[var(--text-primary)]">
                  Registration Management
                </h3>
              </div>
              <p className="text-xs text-[var(--text-muted)] font-medium mt-1">
                Manage all marathon registrations, track sequential IDs (CMA2026IN / CMA2026SC), T-shirts, and class breakdown.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  loadRegistrations();
                  loadRegistrationSummary();
                  if (regType === 'BATCHES') loadBatches();
                }}
                className="btn-secondary py-2.5 px-4 text-xs flex items-center gap-2"
                title="Refresh registrations and summary counts"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingRegistrations || loadingSummary ? 'animate-spin' : ''}`} />
                <span>REFRESH</span>
              </button>

              <button
                onClick={exportRegistrationsCSV}
                className="btn-secondary py-2.5 px-4 text-xs border-[var(--green)] text-[var(--green)] hover:bg-[var(--green)]/10 flex items-center gap-2 shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>EXPORT TO CSV</span>
              </button>
            </div>
          </div>

          {/* DYNAMIC REGISTRATION SUMMARY SECTION */}
          <div className="space-y-4">
            <RegistrationSummaryCards summary={summaryData} loading={loadingSummary} />
            <ClassSummary summary={summaryData} loading={loadingSummary} />
          </div>

          {/* REGISTRATION TYPE FILTER TABS */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[var(--border-color)]">
            <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--border-color)]">
              <button
                onClick={() => {
                  setRegType('ALL');
                  setRegPagination((prev) => ({ ...prev, page: 1 }));
                }}
                className={`px-4 py-2 rounded-xl text-xs font-black tracking-wider transition-all ${regType === 'ALL'
                  ? 'bg-[var(--orange)] text-white shadow-md'
                  : 'text-[var(--text-primary)] hover:text-[var(--orange)]'
                  }`}
              >
                ALL REGISTRATIONS
              </button>

              <button
                onClick={() => {
                  setRegType('INDIVIDUAL');
                  setRegPagination((prev) => ({ ...prev, page: 1 }));
                }}
                className={`px-4 py-2 rounded-xl text-xs font-black tracking-wider transition-all ${regType === 'INDIVIDUAL'
                  ? 'bg-[var(--orange)] text-white shadow-md'
                  : 'text-[var(--text-primary)] hover:text-[var(--orange)]'
                  }`}
              >
                INDIVIDUAL (IN)
              </button>

              <button
                onClick={() => {
                  setRegType('SCHOOL_COLLEGE');
                  setRegPagination((prev) => ({ ...prev, page: 1 }));
                }}
                className={`px-4 py-2 rounded-xl text-xs font-black tracking-wider transition-all ${regType === 'SCHOOL_COLLEGE'
                  ? 'bg-[var(--cyan)] text-white shadow-md'
                  : 'text-[var(--text-primary)] hover:text-[var(--cyan)]'
                  }`}
              >
                SCHOOL / COLLEGE (SC)
              </button>

              <button
                onClick={() => setRegType('BATCHES')}
                className={`px-4 py-2 rounded-xl text-xs font-black tracking-wider transition-all ${regType === 'BATCHES'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-[var(--text-primary)] hover:text-emerald-500'
                  }`}
              >
                BATCH SPREADSHEETS
              </button>
            </div>

            <div className="text-xs font-bold text-[var(--text-muted)]">
              {regType === 'BATCHES' ? (
                <span>Showing {batches.length} institution uploads</span>
              ) : (
                <span>Total: <strong className="text-[var(--text-primary)]">{regPagination.total}</strong> records</span>
              )}
            </div>
          </div>

          {/* VIEW 1: REGISTRATIONS TABLE (ALL, INDIVIDUAL, SCHOOL_COLLEGE) */}
          {regType !== 'BATCHES' && (
            <div className="space-y-4">

              {/* Search & Filter Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setRegPagination((prev) => ({ ...prev, page: 1 }));
                    }}
                    placeholder="Search ID, student name, phone, school..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--orange)]"
                  />
                </div>

                <select
                  value={filterStandard}
                  onChange={(e) => {
                    setFilterStandard(e.target.value);
                    setRegPagination((prev) => ({ ...prev, page: 1 }));
                  }}
                  className="py-2.5 px-3 rounded-xl text-xs bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] font-bold focus:outline-none focus:border-[var(--orange)]"
                >
                  <option value="ALL">ALL CLASSES / STANDARDS</option>
                  {summaryData?.classWise &&
                    Object.keys(summaryData.classWise).map((cls) => (
                      <option key={cls} value={cls}>Class: {cls}</option>
                    ))}
                  {(!summaryData?.classWise || Object.keys(summaryData.classWise).length === 0) && (
                    <>
                      <option value="8th">8th Class</option>
                      <option value="9th">9th Class</option>
                      <option value="10th">10th Class</option>
                    </>
                  )}
                </select>

                <select
                  value={filterInstitution}
                  onChange={(e) => {
                    setFilterInstitution(e.target.value);
                    setRegPagination((prev) => ({ ...prev, page: 1 }));
                  }}
                  className="py-2.5 px-3 rounded-xl text-xs bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] font-bold focus:outline-none focus:border-[var(--orange)]"
                >
                  <option value="ALL">ALL SCHOOLS / COLLEGES</option>
                  {institutions.map((inst) => (
                    <option key={inst} value={inst}>{inst}</option>
                  ))}
                </select>

                <select
                  value={filterSize}
                  onChange={(e) => {
                    setFilterSize(e.target.value);
                    setRegPagination((prev) => ({ ...prev, page: 1 }));
                  }}
                  className="py-2.5 px-3 rounded-xl text-xs bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] font-bold focus:outline-none focus:border-[var(--orange)]"
                >
                  <option value="ALL">ALL T-SHIRT SIZES</option>
                  {['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'].map((sz) => (
                    <option key={sz} value={sz}>{sz}</option>
                  ))}
                </select>
              </div>

              {/* Bulk Action Bar */}
              {selectedRegIds.length > 0 && (
                <div className="p-4 px-5 rounded-2xl bg-red-500/10 border border-red-500/30 flex flex-wrap items-center justify-between gap-3 animate-in fade-in">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black text-[var(--text-primary)]">
                      <span className="text-red-500 font-extrabold text-sm">{selectedRegIds.length}</span> registration{selectedRegIds.length > 1 ? 's' : ''} selected
                    </span>
                    <span className="text-xs text-[var(--text-muted)]">•</span>
                    <button
                      type="button"
                      onClick={() => setSelectedRegIds([])}
                      className="text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text-primary)] underline transition-colors"
                    >
                      Deselect All
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowBulkDeleteRegModal(true)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black flex items-center gap-2 shadow-lg shadow-red-600/20 transition-all cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Selected ({selectedRegIds.length})</span>
                  </button>
                </div>
              )}

              {/* Table */}
              <div className="overflow-x-auto rounded-2xl border border-[var(--border-color)]">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[var(--bg-tertiary)] text-[var(--text-primary)] font-extrabold uppercase tracking-wider">
                    <tr>
                      <th className="p-3.5 w-12 text-center">
                        <input
                          type="checkbox"
                          ref={(el) => {
                            if (el) el.indeterminate = isSomeRegSelected;
                          }}
                          checked={isAllRegSelected}
                          onChange={handleToggleSelectAllReg}
                          title={isAllRegSelected ? 'Deselect all registrations' : 'Select all registrations on this page'}
                          className="w-4 h-4 rounded text-red-600 focus:ring-red-500 cursor-pointer accent-red-600"
                        />
                      </th>
                      <th className="p-3.5">Registration ID</th>
                      <th className="p-3.5">Student Name</th>
                      <th className="p-3.5 text-center">Age</th>
                      <th className="p-3.5">Standard / Class</th>
                      <th className="p-3.5">Parent's Phone</th>
                      <th className="p-3.5">School / College</th>
                      <th className="p-3.5 text-center">T-Shirt</th>
                      <th className="p-3.5">Date & Time</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-color)]/30 text-[var(--text-primary)]">
                    {loadingRegistrations ? (
                      <tr>
                        <td colSpan={10} className="p-8 text-center text-[var(--text-muted)] font-bold animate-pulse">
                          Loading registrations from database...
                        </td>
                      </tr>
                    ) : registrations.length > 0 ? (
                      registrations.map((item) => {
                        const isIN = item.registrationId?.includes('IN');
                        const isSelected = selectedRegIds.includes(item.registrationId || item._id);
                        return (
                          <tr
                            key={item._id}
                            className={`hover:bg-[var(--bg-tertiary)]/50 transition-colors ${isSelected ? 'bg-red-500/5' : ''
                              }`}
                          >
                            <td className="p-3.5 text-center">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleToggleSelectReg(item.registrationId || item._id)}
                                title="Select registration for bulk action"
                                className="w-4 h-4 rounded text-red-600 focus:ring-red-500 cursor-pointer accent-red-600"
                              />
                            </td>
                            <td className="p-3.5 font-mono font-black">
                              <span className={`px-2.5 py-1 rounded-lg text-xs tracking-wider ${isIN
                                ? 'bg-[var(--orange)]/15 text-[var(--orange)] border border-[var(--orange)]/30'
                                : 'bg-[var(--cyan)]/15 text-[var(--cyan)] border border-[var(--cyan)]/30'
                                }`}>
                                {item.registrationId}
                              </span>
                            </td>
                            <td className="p-3.5 font-black text-sm">
                              {item.fullName}
                            </td>
                            <td className="p-3.5 text-center font-bold text-[var(--text-muted)]">
                              {item.age ?? '—'}
                            </td>
                            <td className="p-3.5 font-bold text-[var(--orange)]">
                              {item.standard || '—'}
                            </td>
                            <td className="p-3.5 font-mono font-semibold">
                              {item.contactNumber}
                            </td>
                            <td className="p-3.5 font-medium max-w-[200px] truncate" title={item.institutionName}>
                              {item.institutionName}
                            </td>
                            <td className="p-3.5 text-center font-black">
                              <span className="px-2.5 py-1 rounded-md bg-[var(--yellow)]/15 text-[var(--yellow)] font-bold">
                                {item.tShirtSize}
                              </span>
                            </td>
                            <td className="p-3.5 text-[var(--text-muted)] font-medium">
                              {new Date(item.createdAt).toLocaleDateString('en-IN', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </td>
                            <td className="p-3.5 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => setViewingRegistration(item)}
                                  title="View Details"
                                  className="p-1.5 rounded-lg border border-[var(--border-color)] text-[var(--text-primary)] hover:border-[var(--cyan)] hover:text-[var(--cyan)] transition-colors"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => setEditingRegistration(item)}
                                  title="Edit Registration"
                                  className="p-1.5 rounded-lg border border-[var(--border-color)] text-[var(--text-primary)] hover:border-[var(--orange)] hover:text-[var(--orange)] transition-colors"
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteRegistration(item.registrationId, item.fullName)}
                                  title="Delete Registration"
                                  className="p-1.5 rounded-lg border border-red-500/30 text-red-500 hover:bg-red-500/10 transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={10} className="p-8 text-center text-[var(--text-muted)] font-bold">
                          No registrations found matching your criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {regPagination.pages > 1 && (
                <div className="flex items-center justify-between text-xs pt-2">
                  <span className="text-[var(--text-muted)] font-bold">
                    Page {regPagination.page} of {regPagination.pages} ({regPagination.total} total records)
                  </span>
                  <div className="flex gap-2">
                    <button
                      disabled={regPagination.page === 1}
                      onClick={() => setRegPagination({ ...regPagination, page: regPagination.page - 1 })}
                      className="px-3.5 py-1.5 rounded-xl border border-[var(--border-color)] font-bold disabled:opacity-40 hover:bg-[var(--bg-tertiary)]"
                    >
                      Prev
                    </button>
                    <button
                      disabled={regPagination.page === regPagination.pages}
                      onClick={() => setRegPagination({ ...regPagination, page: regPagination.page + 1 })}
                      className="px-3.5 py-1.5 rounded-xl border border-[var(--border-color)] font-bold disabled:opacity-40 hover:bg-[var(--bg-tertiary)]"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* VIEW 2: SCHOOL / COLLEGE BATCHES SPREADSHEETS */}
          {regType === 'BATCHES' && (
            <div className="space-y-4">

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative">
                  <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search batch ID, school/college, contact person, file..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none"
                  />
                </div>

                <select
                  value={filterInstitution}
                  onChange={(e) => setFilterInstitution(e.target.value)}
                  className="py-2.5 px-3 rounded-xl text-xs bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] font-bold focus:outline-none"
                >
                  <option value="ALL">ALL INSTITUTIONS</option>
                  {institutions.map((inst) => (
                    <option key={inst} value={inst}>{inst}</option>
                  ))}
                </select>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-[var(--border-color)]">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[var(--bg-tertiary)] text-[var(--text-primary)] font-extrabold uppercase">
                    <tr>
                      <th className="p-3">Batch ID</th>
                      <th className="p-3">Institution</th>
                      <th className="p-3">Contact Person</th>
                      <th className="p-3">Phone</th>
                      <th className="p-3 text-center">Students</th>
                      <th className="p-3">Uploaded Sheet</th>
                      <th className="p-3">Submission Date</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-color)]/30 text-[var(--text-primary)]">
                    {filteredBatches.length > 0 ? (
                      filteredBatches.map((batch) => (
                        <tr key={batch._id} className="hover:bg-[var(--bg-tertiary)]/40 transition-colors">
                          <td className="p-3 font-mono font-bold text-[var(--cyan)]">{batch.batchId}</td>
                          <td className="p-3">
                            <div className="font-extrabold text-[var(--text-primary)]">{batch.institutionName}</div>
                            {batch.institutionType && (
                              <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[9px] font-black tracking-wider uppercase bg-[var(--cyan)]/15 text-[var(--cyan)]">
                                {batch.institutionType}
                              </span>
                            )}
                          </td>
                          <td className="p-3 font-medium">{batch.contactPersonName}</td>
                          <td className="p-3">{batch.phone}</td>
                          <td className="p-3 text-center">
                            <span className="px-2.5 py-1 rounded-full text-xs font-black bg-[var(--cyan)]/15 text-[var(--cyan)]">
                              {batch.totalStudents}
                            </span>
                          </td>
                          <td className="p-3">
                            {batch.fileName ? (
                              <div className="flex items-center gap-2 max-w-[220px]" title={batch.fileName}>
                                <FileSpreadsheet className="w-4 h-4 text-emerald-500 shrink-0" />
                                <span className="truncate font-semibold text-[var(--text-primary)]">{batch.fileName}</span>
                                {batch.fileSize && (
                                  <span className="text-[10px] text-[var(--text-muted)] shrink-0">
                                    ({formatFileSize(batch.fileSize)})
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-[var(--text-muted)] italic text-[11px]">Excel Spreadsheet</span>
                            )}
                          </td>
                          <td className="p-3">{new Date(batch.createdAt).toLocaleDateString('en-IN')}</td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleDownloadBatchSheet(batch)}
                                title="Download the sheet uploaded by this institution"
                                className="btn-secondary py-1.5 px-3 text-[11px] font-extrabold border-emerald-500/40 text-emerald-500 hover:bg-emerald-500/10 flex items-center gap-1.5 shadow-sm"
                              >
                                <Download className="w-3.5 h-3.5" />
                                <span>DOWNLOAD SHEET</span>
                              </button>
                              <button
                                onClick={() => {
                                  adminService.getBatchStudents(batch.batchId).then((r) => {
                                    if (r.data?.success) setSelectedBatchStudents(r.data.data);
                                  });
                                }}
                                title="View enrolled students"
                                className="btn-secondary py-1.5 px-2.5 text-[11px] font-extrabold border-[var(--cyan)]/40 text-[var(--cyan)] hover:bg-[var(--cyan)]/10 flex items-center gap-1"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>STUDENTS</span>
                              </button>
                              <button
                                onClick={() => handleDeleteBatch(batch.batchId, batch.institutionName)}
                                title="Delete Batch"
                                className="p-1.5 rounded-lg border border-red-500/30 text-red-500 hover:bg-red-500/10 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-[var(--text-muted)] font-bold">
                          {batches.length === 0
                            ? 'No school or college bulk submissions found yet.'
                            : 'No bulk submissions match your search filter.'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* VIEW DETAILS MODAL */}
          {viewingRegistration && (
            <RegistrationDetailsModal
              registration={viewingRegistration}
              onClose={() => setViewingRegistration(null)}
              onEdit={(item) => setEditingRegistration(item)}
            />
          )}

          {/* EDIT REGISTRATION MODAL */}
          {editingRegistration && (
            <RegistrationEditModal
              registration={editingRegistration}
              onClose={() => setEditingRegistration(null)}
              onUpdated={handleRegistrationUpdated}
            />
          )}

          {/* BATCH STUDENTS MODAL */}
          {selectedBatchStudents && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
              <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl max-w-3xl w-full p-6 space-y-4 max-h-[85vh] overflow-y-auto">
                <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)]">
                  <h4 className="text-lg font-bold font-heading text-[var(--text-primary)]">
                    BATCH STUDENT RECORDS ({selectedBatchStudents.length})
                  </h4>
                  <button onClick={() => setSelectedBatchStudents(null)} className="text-red-500 font-bold text-xs hover:underline">
                    CLOSE [X]
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[var(--bg-tertiary)] font-bold">
                      <tr>
                        <th className="p-2">Registration ID</th>
                        <th className="p-2">Name</th>
                        <th className="p-2">Age</th>
                        <th className="p-2">Standard</th>
                        <th className="p-2">T-Shirt Size</th>
                        <th className="p-2">Phone</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-color)]">
                      {selectedBatchStudents.map((st) => (
                        <tr key={st._id}>
                          <td className="p-2 font-mono font-bold text-[var(--cyan)]">{st.registrationId}</td>
                          <td className="p-2 font-bold">{st.fullName}</td>
                          <td className="p-2">{st.age ?? 'N/A'}</td>
                          <td className="p-2">{st.standard ?? 'N/A'}</td>
                          <td className="p-2 font-bold text-[var(--yellow)]">{st.tShirtSize}</td>
                          <td className="p-2">{st.contactNumber}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* BULK DELETE CONFIRMATION MODAL */}
          {showBulkDeleteRegModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
              <div className="bg-[var(--bg-secondary)] border border-red-500/40 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl relative">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-red-500/15 text-red-500 flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-black font-heading text-[var(--text-primary)]">
                      DELETE {selectedRegIds.length} SELECTED REGISTRATIONS
                    </h3>
                    <p className="text-xs text-red-500 font-bold">Irreversible Bulk Action</p>
                  </div>
                </div>

                <p className="text-xs text-[var(--text-primary)] leading-relaxed">
                  Are you sure you want to permanently delete all <strong className="text-red-500 font-black">{selectedRegIds.length}</strong> selected registration records?
                  These entries will be deleted permanently from the database.
                </p>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border-color)]">
                  <button
                    type="button"
                    onClick={() => setShowBulkDeleteRegModal(false)}
                    disabled={bulkDeletingReg}
                    className="btn-secondary text-xs py-2 px-4"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmBulkDeleteReg}
                    disabled={bulkDeletingReg}
                    className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black flex items-center gap-2 shadow-lg shadow-red-600/30 transition-all cursor-pointer"
                  >
                    {bulkDeletingReg ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Deleting...</span>
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Yes, Delete All Selected</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* TAB 4: EVENT CONFIG CONTROL */}
      {activeTab === 'EVENT_CONFIG' && (
        <div className="glass-card p-8 rounded-3xl border border-[var(--border-color)] max-w-2xl mx-auto space-y-6 animate-in fade-in">
          <h3 className="text-xl font-extrabold font-heading text-[var(--text-primary)]">
            MARATHON EVENT CONFIGURATION
          </h3>

          <form onSubmit={handleSaveEventConfig} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold mb-1 text-[var(--text-primary)] uppercase">Program Name</label>
              <input
                type="text"
                value={eventForm.programName}
                onChange={(e) => setEventForm({ ...eventForm, programName: e.target.value })}
                className="w-full py-3 px-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] font-bold text-[var(--text-primary)]"
              />
            </div>

            <div>
              <label className="block font-bold mb-1 text-[var(--text-primary)] uppercase">Event Slogan</label>
              <input
                type="text"
                value={eventForm.slogan}
                onChange={(e) => setEventForm({ ...eventForm, slogan: e.target.value })}
                className="w-full py-3 px-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)]"
              />
            </div>

            <div>
              <label className="block font-bold mb-1 text-[var(--text-primary)] uppercase">Venue & Location</label>
              <input
                type="text"
                value={eventForm.venue}
                onChange={(e) => setEventForm({ ...eventForm, venue: e.target.value })}
                className="w-full py-3 px-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)]"
              />
            </div>

            <div>
              <label className="block font-bold mb-1 text-[var(--text-primary)] uppercase">Event Date & Time</label>
              <input
                type="datetime-local"
                value={eventForm.eventDate}
                onChange={(e) => setEventForm({ ...eventForm, eventDate: e.target.value })}
                className="w-full py-3 px-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)]"
              />
            </div>

            <div>
              <label className="block font-bold mb-1 text-[var(--text-primary)] uppercase">Last Day of Registration (30/11/2026)</label>
              <input
                type="datetime-local"
                value={eventForm.registrationEndDate}
                onChange={(e) => setEventForm({ ...eventForm, registrationEndDate: e.target.value })}
                className="w-full py-3 px-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)]"
              />
              <span className="text-[10px] text-[var(--text-muted)] mt-1 block">Registration closes on: 30 November 2026 (30/11/2026)</span>
            </div>

            <div className="p-4 rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] flex items-center justify-between">
              <div>
                <h4 className="font-extrabold text-[var(--text-primary)] text-sm">REGISTRATION CONTROL</h4>
                <p className="text-[11px] text-[var(--text-muted)]">Turn marathon registration ON or OFF</p>
              </div>

              <button
                type="button"
                onClick={() => setEventForm({ ...eventForm, registrationOpen: !eventForm.registrationOpen })}
                className={`py-2 px-5 rounded-full font-extrabold text-xs transition-colors ${eventForm.registrationOpen
                  ? 'bg-emerald-500 text-white'
                  : 'bg-red-500 text-white'
                  }`}
              >
                {eventForm.registrationOpen ? 'REGISTRATION IS ON' : 'REGISTRATION IS OFF'}
              </button>
            </div>

            <button
              type="submit"
              disabled={configSaving}
              className="btn-primary w-full justify-center py-3.5 text-sm"
            >
              <span>{configSaving ? 'SAVING...' : 'SAVE EVENT CONFIGURATION'}</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB: CHANGE ADMIN PASSWORD */}
      {activeTab === 'PASSWORD' && (
        <div className="glass-card p-8 rounded-3xl border border-[var(--border-color)] max-w-md mx-auto space-y-6 animate-in fade-in">
          <h3 className="text-xl font-extrabold font-heading text-[var(--text-primary)] text-center">
            CHANGE ADMIN PASSWORD
          </h3>

          {pwdStatus.success && (
            <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 font-bold text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{pwdStatus.message || 'Admin password updated successfully in the database!'}</span>
            </div>
          )}

          {pwdStatus.error && (
            <div className="p-4 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-600 font-bold text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{pwdStatus.error}</span>
            </div>
          )}

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setPwdStatus({ success: false, error: null, message: '' });

              if (pwdForm.newPassword.length < 6) {
                setPwdStatus({ success: false, error: 'New password must be at least 6 characters long!' });
                return;
              }
              if (pwdForm.newPassword !== pwdForm.confirmPassword) {
                setPwdStatus({ success: false, error: 'New passwords do not match!' });
                return;
              }

              setPwdSaving(true);
              try {
                const res = await adminService.changePassword({
                  currentPassword: pwdForm.currentPassword,
                  newPassword: pwdForm.newPassword,
                  confirmNewPassword: pwdForm.confirmPassword,
                });
                if (res.data?.success) {
                  setPwdStatus({
                    success: true,
                    error: null,
                    message: 'Admin password changed successfully in the database!',
                  });
                  setPwdForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                }
              } catch (err) {
                setPwdStatus({
                  success: false,
                  error: err.response?.data?.message || 'Failed to update admin password. Check your current password.',
                });
              } finally {
                setPwdSaving(false);
              }
            }}
            className="space-y-4 text-xs"
          >
            <div>
              <label className="block font-bold mb-1 text-[var(--text-primary)]">Current Password *</label>
              <div className="relative">
                <input
                  type={showCurrentPwd ? 'text' : 'password'}
                  required
                  value={pwdForm.currentPassword}
                  onChange={(e) => setPwdForm({ ...pwdForm, currentPassword: e.target.value })}
                  placeholder="Enter your current password"
                  className="w-full py-3 pl-4 pr-10 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--cyan)]"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPwd(!showCurrentPwd)}
                  className="absolute right-3.5 top-3.5 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                >
                  {showCurrentPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block font-bold mb-1 text-[var(--text-primary)]">New Password (min 6 chars) *</label>
              <div className="relative">
                <input
                  type={showNewPwd ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={pwdForm.newPassword}
                  onChange={(e) => setPwdForm({ ...pwdForm, newPassword: e.target.value })}
                  placeholder="Enter new secure password"
                  className="w-full py-3 pl-4 pr-10 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--cyan)]"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPwd(!showNewPwd)}
                  className="absolute right-3.5 top-3.5 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                >
                  {showNewPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block font-bold mb-1 text-[var(--text-primary)]">Confirm New Password *</label>
              <div className="relative">
                <input
                  type={showConfirmPwd ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={pwdForm.confirmPassword}
                  onChange={(e) => setPwdForm({ ...pwdForm, confirmPassword: e.target.value })}
                  placeholder="Re-enter new password"
                  className="w-full py-3 pl-4 pr-10 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--cyan)]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPwd(!showConfirmPwd)}
                  className="absolute right-3.5 top-3.5 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                >
                  {showConfirmPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={pwdSaving}
              className="btn-primary w-full justify-center py-3.5 text-xs font-bold disabled:opacity-50 flex items-center gap-2 cursor-pointer"
            >
              {pwdSaving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>UPDATING PASSWORD...</span>
                </>
              ) : (
                <span>UPDATE ADMIN PASSWORD</span>
              )}
            </button>
          </form>
        </div>
      )}

    </div>
  );
};
