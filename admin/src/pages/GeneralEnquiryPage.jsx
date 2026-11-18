import React, { useEffect, useState, useMemo } from 'react';
import { adminGeneralEnquiryService } from '../services/adminApi';
import {
  HelpCircle,
  Trash2,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Clock,
  Mail,
  Phone,
  User,
  Check,
  Search,
  Download,
  Eye,
  MessageCircle,
  X,
} from 'lucide-react';

export const GeneralEnquiryPage = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({ type: null, message: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const res = await adminGeneralEnquiryService.getEnquiries();
      if (res.data?.success) {
        setEnquiries(res.data.data || []);
      }
    } catch (err) {
      console.error('Failed to load general enquiries:', err);
      setFeedback({
        type: 'error',
        message: 'Failed to load general enquiries.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await adminGeneralEnquiryService.updateStatus(id, newStatus);
      if (res.data?.success) {
        setEnquiries((prev) =>
          prev.map((e) => (e._id === id ? { ...e, status: newStatus } : e))
        );
        if (selectedEnquiry && selectedEnquiry._id === id) {
          setSelectedEnquiry((prev) => ({ ...prev, status: newStatus }));
        }
        setFeedback({
          type: 'success',
          message: `Enquiry status updated to ${newStatus}.`,
        });
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        message: 'Failed to update enquiry status.',
      });
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Permanently delete enquiry from "${name || id}"?`)) return;

    try {
      const res = await adminGeneralEnquiryService.deleteEnquiry(id);
      if (res.data?.success) {
        setFeedback({
          type: 'success',
          message: 'General enquiry deleted from database.',
        });
        setEnquiries((prev) => prev.filter((e) => e._id !== id));
        if (selectedEnquiry && selectedEnquiry._id === id) {
          setSelectedEnquiry(null);
        }
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        message: 'Failed to delete general enquiry.',
      });
    }
  };

  const handleExportCSV = () => {
    if (filteredEnquiries.length === 0) return;
    let csv = 'ID,Date,Name,Email,Mobile,What would you like to know more about?,Status\n';
    filteredEnquiries.forEach((item) => {
      const cleanGoal = (item.learningGoal || '').replace(/"/g, '""').replace(/\n/g, ' ');
      csv += `"${item._id}","${new Date(item.createdAt).toLocaleString()}","${item.name || ''}","${item.email || ''}","${item.mobileNumber || ''}","${cleanGoal}","${item.status || 'NEW'}"\n`;
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
  };

  const filteredEnquiries = useMemo(() => {
    return enquiries.filter((e) => {
      const q = searchTerm.trim().toLowerCase();
      const matchesSearch =
        !q ||
        (e.name && e.name.toLowerCase().includes(q)) ||
        (e.email && e.email.toLowerCase().includes(q)) ||
        (e.mobileNumber && e.mobileNumber.toLowerCase().includes(q)) ||
        (e.learningGoal && e.learningGoal.toLowerCase().includes(q));

      const matchesStatus = statusFilter === 'ALL' || e.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [enquiries, searchTerm, statusFilter]);

  const getWhatsAppLink = (phone, name) => {
    if (!phone) return '#';
    const cleanDigits = phone.replace(/[^0-9]/g, '');
    const fullPhone = cleanDigits.length === 10 ? `91${cleanDigits}` : cleanDigits;
    const text = encodeURIComponent(
      `Hello ${name || ''}, Greetings from Chinmaya Mission Adoni! Regarding your general enquiry: `
    );
    return `https://wa.me/${fullPhone}?text=${text}`;
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black tracking-widest text-[#FF5722] uppercase">
            POP-UP ENQUIRY INBOX
          </span>
          <h2 className="text-2xl sm:text-3xl font-black font-heading text-white">
            GENERAL ENQUIRY
          </h2>
          <p className="text-xs text-[#94A3B8] font-medium">
            Manage all enquiries submitted from the upper-middle general enquiry pop-up
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="btn-secondary text-xs py-2 px-3.5 inline-flex items-center gap-1.5"
            title="Export CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={fetchEnquiries}
            disabled={loading}
            className="btn-secondary text-xs py-2 px-3.5 self-start sm:self-auto inline-flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Reload</span>
          </button>
        </div>
      </div>

      {feedback.message && (
        <div
          className={`p-4 rounded-2xl text-xs font-bold flex items-center justify-between gap-2.5 ${
            feedback.type === 'success'
              ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
              : 'bg-red-500/15 border border-red-500/30 text-red-400'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? (
              <CheckCircle className="w-4 h-4 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button onClick={() => setFeedback({ type: null, message: '' })}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#0B1528] p-3 rounded-2xl border border-white/5">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search enquiries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#070F1E] border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FF5722]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {['ALL', 'NEW', 'READ', 'RESPONDED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                statusFilter === st
                  ? 'bg-[#FF5722] text-white'
                  : 'bg-white/5 text-gray-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-8 h-8 border-2 border-[#FF5722] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-gray-400">Loading general enquiries...</p>
        </div>
      ) : filteredEnquiries.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-[#0B1528] border border-white/5 space-y-2">
          <HelpCircle className="w-10 h-10 text-gray-500 mx-auto" />
          <h4 className="text-sm font-bold text-white">No General Enquiries Found</h4>
          <p className="text-xs text-gray-400">
            Enquiries submitted via the homepage upper-middle pop-up will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredEnquiries.map((item) => (
            <div
              key={item._id}
              className="p-5 rounded-2xl bg-[#0B1528] border border-white/5 hover:border-[#FF5722]/30 transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#FF5722]/15 text-[#FF5722] flex items-center justify-center font-bold text-sm">
                    {item.name ? item.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{item.name}</h3>
                    <div className="flex items-center gap-2 text-[11px] text-gray-400">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(item.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={item.status || 'NEW'}
                    onChange={(e) => handleStatusChange(item._id, e.target.value)}
                    className="text-xs font-bold py-1 px-2.5 rounded-lg bg-[#070F1E] border border-white/10 text-white focus:outline-none"
                  >
                    <option value="NEW">NEW</option>
                    <option value="READ">READ</option>
                    <option value="RESPONDED">RESPONDED</option>
                  </select>

                  <button
                    onClick={() => handleDelete(item._id, item.name)}
                    className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Contact info row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-2 text-gray-300">
                  <Mail className="w-3.5 h-3.5 text-[#FF5722]" />
                  <a href={`mailto:${item.email}`} className="text-blue-400 hover:underline">
                    {item.email}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Phone className="w-3.5 h-3.5 text-[#FF5722]" />
                  <a href={`tel:${item.mobileNumber}`} className="hover:text-white">
                    {item.mobileNumber}
                  </a>
                  <a
                    href={getWhatsAppLink(item.mobileNumber, item.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 font-bold hover:bg-emerald-500/30"
                  >
                    WhatsApp
                  </a>
                </div>
              </div>

              {/* What would you like to know more about? */}
              <div className="p-3 rounded-xl bg-[#070F1E] border border-white/5 space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#FF5722]">
                  What would you like to know more about?
                </span>
                <p className="text-xs text-gray-200 leading-relaxed whitespace-pre-wrap">
                  {item.learningGoal}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GeneralEnquiryPage;
