import React, { useState, useEffect, useMemo } from 'react';
import { generalEnquiryService } from '../../services/api';
import {
  HelpCircle,
  Search,
  Filter,
  RefreshCw,
  Download,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  Clock,
  Trash2,
  ExternalLink,
  MessageCircle,
  Sparkles,
  User,
  AlertCircle,
  CheckCheck,
  Eye,
  X,
  Send,
  BookOpen,
} from 'lucide-react';

export const GeneralEnquiryManager = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortOrder, setSortOrder] = useState('NEWEST');
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [notification, setNotification] = useState(null);

  const fetchEnquiries = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await generalEnquiryService.getEnquiriesAdmin();
      if (res.data?.success) {
        setEnquiries(res.data.data || []);
      }
    } catch (err) {
      showNotification('error', err.response?.data?.message || 'Failed to load general enquiries');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const handleStatusChange = async (id, newStatus) => {
    setActionLoadingId(id);
    try {
      const res = await generalEnquiryService.updateStatus(id, newStatus);
      if (res.data?.success) {
        setEnquiries((prev) =>
          prev.map((e) => (e._id === id ? { ...e, status: newStatus } : e))
        );
        if (selectedEnquiry && selectedEnquiry._id === id) {
          setSelectedEnquiry((prev) => ({ ...prev, status: newStatus }));
        }
        showNotification('success', `Status updated to ${newStatus}`);
      }
    } catch (err) {
      showNotification('error', err.response?.data?.message || 'Failed to update status');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (id) => {
    setActionLoadingId(id);
    try {
      const res = await generalEnquiryService.deleteEnquiry(id);
      if (res.data?.success) {
        setEnquiries((prev) => prev.filter((e) => e._id !== id));
        if (selectedEnquiry && selectedEnquiry._id === id) {
          setSelectedEnquiry(null);
        }
        setDeleteConfirmId(null);
        showNotification('success', 'General enquiry deleted successfully');
      }
    } catch (err) {
      showNotification('error', err.response?.data?.message || 'Failed to delete general enquiry');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (filteredEnquiries.length === 0) {
      showNotification('error', 'No general enquiries to export');
      return;
    }

    let csv = 'Enquiry ID,Date & Time,Name,Email ID,Mobile Number,What would you like to know more about?,Status,Notes\n';
    filteredEnquiries.forEach((item) => {
      const cleanGoal = (item.learningGoal || '').replace(/"/g, '""').replace(/\n/g, ' ');
      const cleanNotes = (item.notes || '').replace(/"/g, '""').replace(/\n/g, ' ');
      csv += `"${item._id}","${new Date(item.createdAt).toLocaleString()}","${item.name || ''}","${item.email || ''}","${item.mobileNumber || ''}","${cleanGoal}","${item.status || 'NEW'}","${cleanNotes}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `General_Enquiries_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showNotification('success', 'Exported general enquiries to CSV');
  };

  // KPIs
  const stats = useMemo(() => {
    const total = enquiries.length;
    const newCount = enquiries.filter((e) => e.status === 'NEW').length;
    const readCount = enquiries.filter((e) => e.status === 'READ').length;
    const respondedCount = enquiries.filter((e) => e.status === 'RESPONDED').length;
    return { total, newCount, readCount, respondedCount };
  }, [enquiries]);

  // Filtered & Sorted Enquiries
  const filteredEnquiries = useMemo(() => {
    return enquiries
      .filter((e) => {
        const q = searchTerm.trim().toLowerCase();
        const matchesSearch =
          !q ||
          (e.name && e.name.toLowerCase().includes(q)) ||
          (e.email && e.email.toLowerCase().includes(q)) ||
          (e.mobileNumber && e.mobileNumber.toLowerCase().includes(q)) ||
          (e.learningGoal && e.learningGoal.toLowerCase().includes(q));

        const matchesStatus = statusFilter === 'ALL' || e.status === statusFilter;

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortOrder === 'NEWEST' ? dateB - dateA : dateA - dateB;
      });
  }, [enquiries, searchTerm, statusFilter, sortOrder]);

  // Clean raw phone for whatsapp link
  const getWhatsAppLink = (phone, name) => {
    if (!phone) return '#';
    const cleanDigits = phone.replace(/[^0-9]/g, '');
    const fullPhone = cleanDigits.length === 10 ? `91${cleanDigits}` : cleanDigits;
    const text = encodeURIComponent(
      `Hello ${name || ''}, Greetings from Chinmaya Mission Adoni! We received your general enquiry: `
    );
    return `https://wa.me/${fullPhone}?text=${text}`;
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'NEW':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-500/15 text-amber-500 border border-amber-500/30 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            NEW
          </span>
        );
      case 'READ':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-blue-500/15 text-blue-500 border border-blue-500/30">
            <Eye className="w-3.5 h-3.5" />
            READ
          </span>
        );
      case 'RESPONDED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
            <CheckCheck className="w-3.5 h-3.5" />
            RESPONDED
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-500/15 text-gray-400">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {notification && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-2.5 px-5 py-3 rounded-2xl shadow-2xl border text-sm font-semibold transition-all duration-300 animate-in slide-in-from-top-3 ${
            notification.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200'
              : 'bg-rose-950/90 border-rose-500/50 text-rose-200'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          )}
          <span>{notification.message}</span>
          <button
            onClick={() => setNotification(null)}
            className="ml-2 hover:opacity-75 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-color)] shadow-xs">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-500">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">
                General Enquiry
              </h2>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Manage all enquiries submitted via the homepage upper-middle pop-up form
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-stretch sm:self-auto">
          <button
            onClick={() => fetchEnquiries(true)}
            disabled={refreshing || loading}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-tertiary)] hover:bg-[var(--border-color)] text-xs font-semibold text-[var(--text-secondary)] transition-all cursor-pointer disabled:opacity-50"
            title="Refresh list"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-600 border border-orange-500/30 text-xs font-semibold transition-all cursor-pointer"
            title="Download CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
              Total Enquiries
            </p>
            <p className="text-2xl font-black text-[var(--text-primary)] mt-1">{stats.total}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-amber-500">
              New (Unread)
            </p>
            <p className="text-2xl font-black text-amber-500 mt-1">{stats.newCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-blue-500">
              In Review
            </p>
            <p className="text-2xl font-black text-blue-500 mt-1">{stats.readCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
            <Eye className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-500">
              Responded
            </p>
            <p className="text-2xl font-black text-emerald-500 mt-1">{stats.respondedCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <CheckCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, email, phone number, or learning goal..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {['ALL', 'NEW', 'READ', 'RESPONDED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="px-3 py-2 text-xs font-semibold rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-secondary)] focus:outline-none focus:ring-1 focus:ring-orange-500 cursor-pointer"
          >
            <option value="NEWEST">Newest First</option>
            <option value="OLDEST">Oldest First</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-[var(--text-muted)]">Loading general enquiries...</p>
        </div>
      ) : filteredEnquiries.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-color)] space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[var(--bg-tertiary)] text-[var(--text-muted)] flex items-center justify-center mx-auto">
            <HelpCircle className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-[var(--text-primary)]">No Enquiries Found</h3>
          <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto">
            {searchTerm || statusFilter !== 'ALL'
              ? 'No general enquiries match your current filters. Try resetting the search or status filter.'
              : 'No general enquiries have been submitted through the homepage pop-up yet.'}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[var(--bg-tertiary)] border-b border-[var(--border-color)] text-[var(--text-muted)] uppercase tracking-wider font-bold text-[10px]">
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Email ID</th>
                  <th className="py-3 px-4">Mobile Number</th>
                  <th className="py-3 px-4">What would you like to know more about?</th>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {filteredEnquiries.map((item) => (
                  <tr
                    key={item._id}
                    className="hover:bg-[var(--bg-tertiary)]/50 transition-colors group"
                  >
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getStatusBadge(item.status)}
                    </td>

                    <td className="py-3.5 px-4 font-bold text-[var(--text-primary)] whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-orange-500/10 text-orange-500 flex items-center justify-center font-black text-xs shrink-0">
                          {item.name ? item.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <span>{item.name}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <a
                        href={`mailto:${item.email}`}
                        className="inline-flex items-center gap-1.5 text-blue-500 hover:text-blue-600 hover:underline font-medium"
                        title="Send email"
                      >
                        <Mail className="w-3.5 h-3.5 shrink-0" />
                        <span>{item.email}</span>
                      </a>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <a
                          href={`tel:${item.mobileNumber}`}
                          className="inline-flex items-center gap-1 text-[var(--text-secondary)] hover:text-orange-500 font-medium"
                          title="Call phone"
                        >
                          <Phone className="w-3.5 h-3.5 shrink-0" />
                          <span>{item.mobileNumber}</span>
                        </a>
                        <a
                          href={getWhatsAppLink(item.mobileNumber, item.name)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-6 h-6 rounded-lg bg-emerald-500/15 text-emerald-500 hover:bg-emerald-500/30 flex items-center justify-center transition-colors shrink-0"
                          title="Open WhatsApp chat"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 max-w-xs">
                      <p
                        className="line-clamp-2 text-[var(--text-secondary)] leading-relaxed cursor-pointer hover:text-orange-600 transition-colors"
                        onClick={() => setSelectedEnquiry(item)}
                        title="Click to view full message"
                      >
                        {item.learningGoal}
                      </p>
                    </td>

                    <td className="py-3.5 px-4 text-[var(--text-muted)] whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0" />
                        <span>
                          {new Date(item.createdAt).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                        <span className="text-[10px] text-[var(--text-muted)] opacity-75">
                          {new Date(item.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedEnquiry(item)}
                          className="w-7 h-7 rounded-lg bg-[var(--bg-tertiary)] hover:bg-orange-500/10 hover:text-orange-500 text-[var(--text-muted)] flex items-center justify-center transition-colors cursor-pointer"
                          title="View full enquiry details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <select
                          value={item.status}
                          disabled={actionLoadingId === item._id}
                          onChange={(e) => handleStatusChange(item._id, e.target.value)}
                          className="text-[11px] font-bold py-1 px-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-secondary)] focus:outline-none focus:ring-1 focus:ring-orange-500 cursor-pointer"
                        >
                          <option value="NEW">NEW</option>
                          <option value="READ">READ</option>
                          <option value="RESPONDED">RESPONDED</option>
                        </select>

                        <button
                          onClick={() => setDeleteConfirmId(item._id)}
                          className="w-7 h-7 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 flex items-center justify-center transition-colors cursor-pointer"
                          title="Delete enquiry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-xl rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-color)] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-[var(--border-color)] flex items-center justify-between bg-[var(--bg-tertiary)]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-orange-500/15 text-orange-500 flex items-center justify-center">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[var(--text-primary)]">
                    General Enquiry Details
                  </h3>
                  <p className="text-xs text-[var(--text-muted)]">
                    Submitted on {new Date(selectedEnquiry.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="w-8 h-8 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--border-color)] text-[var(--text-muted)] flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--border-color)]">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[var(--text-muted)]">Current Status:</span>
                  {getStatusBadge(selectedEnquiry.status)}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[var(--text-muted)] font-semibold">Change to:</span>
                  <select
                    value={selectedEnquiry.status}
                    onChange={(e) => handleStatusChange(selectedEnquiry._id, e.target.value)}
                    className="text-xs font-bold py-1 px-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-orange-500 cursor-pointer"
                  >
                    <option value="NEW">NEW</option>
                    <option value="READ">READ</option>
                    <option value="RESPONDED">RESPONDED</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--border-color)]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] block mb-1 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-orange-500" />
                    <span>Name</span>
                  </span>
                  <p className="text-sm font-bold text-[var(--text-primary)]">
                    {selectedEnquiry.name}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--border-color)]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] block mb-1 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-orange-500" />
                    <span>Mobile Number</span>
                  </span>
                  <div className="flex items-center justify-between">
                    <a
                      href={`tel:${selectedEnquiry.mobileNumber}`}
                      className="text-sm font-bold text-orange-500 hover:underline"
                    >
                      {selectedEnquiry.mobileNumber}
                    </a>
                    <a
                      href={getWhatsAppLink(selectedEnquiry.mobileNumber, selectedEnquiry.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-500 hover:bg-emerald-500/25 text-xs font-bold transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>

                <div className="sm:col-span-2 p-3.5 rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--border-color)]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] block mb-1 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-orange-500" />
                    <span>Email ID</span>
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-[var(--text-primary)]">
                      {selectedEnquiry.email}
                    </span>
                    <a
                      href={`mailto:${selectedEnquiry.email}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-500/15 text-blue-500 hover:bg-blue-500/25 text-xs font-bold transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Mail</span>
                    </a>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] space-y-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-orange-500 flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4" />
                  <span>What would you like to know more about?</span>
                </span>
                <p className="text-xs text-[var(--text-primary)] leading-relaxed whitespace-pre-wrap bg-[var(--bg-secondary)] p-3.5 rounded-xl border border-[var(--border-color)] font-medium">
                  {selectedEnquiry.learningGoal}
                </p>
              </div>
            </div>

            <div className="p-4 border-t border-[var(--border-color)] bg-[var(--bg-tertiary)] flex items-center justify-between">
              <button
                onClick={() => setDeleteConfirmId(selectedEnquiry._id)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 text-xs font-bold transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>

              <button
                onClick={() => setSelectedEnquiry(null)}
                className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-color)] p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/15 text-rose-500 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h4 className="text-base font-bold text-[var(--text-primary)]">
                Delete General Enquiry?
              </h4>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                Are you sure you want to delete this enquiry? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-tertiary)] hover:bg-[var(--border-color)] text-xs font-bold text-[var(--text-secondary)] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                disabled={actionLoadingId === deleteConfirmId}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
              >
                {actionLoadingId === deleteConfirmId ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeneralEnquiryManager;
