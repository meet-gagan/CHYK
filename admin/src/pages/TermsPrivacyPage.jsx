import React, { useState, useEffect } from 'react';
import {
  FileText,
  Shield,
  Scale,
  Plus,
  Trash2,
  Save,
  RotateCcw,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  ChevronUp,
  ChevronDown,
  Building,
  Flame,
  Clock,
  Sparkles,
} from 'lucide-react';
import { adminLegalService } from '../services/adminApi';

export const TermsPrivacyPage = () => {
  // Website selector: 'chinmaya' | 'marathon'
  const [selectedWebsite, setSelectedWebsite] = useState('chinmaya');
  // Document selector: 'terms' | 'privacy'
  const [selectedDocType, setSelectedDocType] = useState('terms');

  // Document state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [docData, setDocData] = useState({
    title: '',
    subtitle: '',
    lastUpdated: 'January 2027',
    sections: [],
  });

  // Fetch document when selectedWebsite or selectedDocType changes
  useEffect(() => {
    fetchDocument(selectedWebsite, selectedDocType);
  }, [selectedWebsite, selectedDocType]);

  const fetchDocument = async (website, type) => {
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await adminLegalService.getDoc(website, type);
      if (res.data?.success && res.data?.data) {
        setDocData({
          title: res.data.data.title || '',
          subtitle: res.data.data.subtitle || '',
          lastUpdated: res.data.data.lastUpdated || 'January 2027',
          sections: Array.isArray(res.data.data.sections) ? res.data.data.sections : [],
        });
      }
    } catch (err) {
      console.error('Failed to load legal document:', err);
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to load document from server.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });
    try {
      // Renumber sections in sequence
      const sanitizedSections = (docData.sections || []).map((sec, idx) => ({
        id: sec.id || `sec-${idx + 1}`,
        order: idx + 1,
        number: idx + 1,
        title: sec.title || `Section ${idx + 1}`,
        content: sec.content || '',
      }));

      const payload = {
        title: docData.title.trim(),
        subtitle: docData.subtitle.trim(),
        lastUpdated: docData.lastUpdated.trim(),
        sections: sanitizedSections,
      };

      const res = await adminLegalService.updateDoc(selectedWebsite, selectedDocType, payload);
      if (res.data?.success) {
        setMessage({
          type: 'success',
          text: `${selectedWebsite === 'chinmaya' ? 'Chinmaya Mission' : 'Marathon'} ${
            selectedDocType === 'terms' ? 'Terms & Conditions' : 'Privacy Policy'
          } saved successfully!`,
        });
        setDocData((prev) => ({ ...prev, sections: sanitizedSections }));
      }
    } catch (err) {
      console.error('Failed to save legal document:', err);
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Error saving changes. Please try again.',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleResetToDefault = async () => {
    const confirmReset = window.confirm(
      `Are you sure you want to reset the ${selectedWebsite === 'chinmaya' ? 'Chinmaya Mission' : 'Marathon'} ${
        selectedDocType === 'terms' ? 'Terms & Conditions' : 'Privacy Policy'
      } to default template? Custom changes will be overwritten.`
    );
    if (!confirmReset) return;

    setSaving(true);
    try {
      const res = await adminLegalService.resetDoc(selectedWebsite, selectedDocType);
      if (res.data?.success && res.data?.data) {
        setDocData({
          title: res.data.data.title || '',
          subtitle: res.data.data.subtitle || '',
          lastUpdated: res.data.data.lastUpdated || 'January 2027',
          sections: Array.isArray(res.data.data.sections) ? res.data.data.sections : [],
        });
        setMessage({
          type: 'success',
          text: 'Document restored to recommended default template.',
        });
      }
    } catch (err) {
      console.error('Reset error:', err);
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to reset document.',
      });
    } finally {
      setSaving(false);
    }
  };

  // Section manipulation helpers
  const handleAddSection = () => {
    const newNum = (docData.sections?.length || 0) + 1;
    const newSection = {
      id: `sec-${Date.now()}`,
      order: newNum,
      number: newNum,
      title: `Clause ${newNum}: New Section Title`,
      content: '',
    };
    setDocData((prev) => ({
      ...prev,
      sections: [...(prev.sections || []), newSection],
    }));
  };

  const handleRemoveSection = (idx) => {
    const confirmDelete = window.confirm('Delete this section?');
    if (!confirmDelete) return;

    setDocData((prev) => {
      const updated = [...(prev.sections || [])];
      updated.splice(idx, 1);
      return { ...prev, sections: updated };
    });
  };

  const handleMoveSection = (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= docData.sections.length) return;

    setDocData((prev) => {
      const updated = [...prev.sections];
      const temp = updated[index];
      updated[index] = updated[newIndex];
      updated[newIndex] = temp;
      return { ...prev, sections: updated };
    });
  };

  const handleSectionChange = (idx, field, val) => {
    setDocData((prev) => {
      const updated = [...prev.sections];
      updated[idx] = { ...updated[idx], [field]: val };
      return { ...prev, sections: updated };
    });
  };

  // Live website URLs
  const getLivePageUrl = () => {
    const path = selectedDocType === 'terms' ? '/terms' : '/privacy';
    if (selectedWebsite === 'chinmaya') {
      return `http://localhost:5176${path}`;
    }
    return `http://localhost:5175${path}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl bg-[#1C2541] border border-white/10 shadow-lg">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#00B4D8]/10 text-[#00B4D8] border border-[#00B4D8]/20">
              <Scale className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-white font-heading tracking-tight">
              T&C and PP (Terms & Conditions & Privacy Policy)
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 font-medium">
            Manage separated legal policies and terms for Chinmaya Mission Website and Marathon Website.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={handleSave}
            disabled={saving || loading}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00B4D8] to-blue-600 text-white font-extrabold text-xs shadow-md shadow-[#00B4D8]/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {message.text && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 text-xs sm:text-sm font-bold border transition-all ${
            message.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <div className="space-y-2">
        <label className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <span>1. Select Website Platform:</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <button
            type="button"
            onClick={() => setSelectedWebsite('chinmaya')}
            className={`p-4 sm:p-5 rounded-2xl border text-left transition-all relative overflow-hidden flex items-start gap-4 ${
              selectedWebsite === 'chinmaya'
                ? 'bg-[#243054] border-[#00B4D8] shadow-lg shadow-[#00B4D8]/10'
                : 'bg-[#1C2541]/70 border-white/10 hover:border-white/20 text-slate-300'
            }`}
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                selectedWebsite === 'chinmaya'
                  ? 'bg-[#00B4D8] text-white shadow-md'
                  : 'bg-white/5 text-slate-400'
              }`}
            >
              <Building className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-extrabold text-white font-heading">
                  Chinmaya Mission Website
                </span>
                {selectedWebsite === 'chinmaya' && (
                  <span className="px-2 py-0.5 rounded-full bg-[#00B4D8]/20 text-[#00B4D8] text-[10px] font-black uppercase">
                    Active
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                Spiritual portal: Temple Sevas, Puja registrations, 80G donations, Balavihar & mission classes.
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setSelectedWebsite('marathon')}
            className={`p-4 sm:p-5 rounded-2xl border text-left transition-all relative overflow-hidden flex items-start gap-4 ${
              selectedWebsite === 'marathon'
                ? 'bg-[#243054] border-[#F4511E] shadow-lg shadow-[#F4511E]/10'
                : 'bg-[#1C2541]/70 border-white/10 hover:border-white/20 text-slate-300'
            }`}
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                selectedWebsite === 'marathon'
                  ? 'bg-[#F4511E] text-white shadow-md'
                  : 'bg-white/5 text-slate-400'
              }`}
            >
              <Flame className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-extrabold text-white font-heading">
                  Marathon Website
                </span>
                {selectedWebsite === 'marathon' && (
                  <span className="px-2 py-0.5 rounded-full bg-[#F4511E]/20 text-[#F4511E] text-[10px] font-black uppercase">
                    Active
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                Anti-Drug Mini-Marathon: Runner registrations, entry pass rules, health waiver & student batches.
              </p>
            </div>
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <span>2. Select Document to Manage:</span>
        </label>
        <div className="flex flex-wrap gap-2.5 p-1.5 rounded-2xl bg-[#1C2541] border border-white/10">
          <button
            type="button"
            onClick={() => setSelectedDocType('terms')}
            className={`flex-1 min-w-[200px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-black text-xs uppercase tracking-wider transition-all ${
              selectedDocType === 'terms'
                ? 'bg-[#00B4D8] text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Terms & Conditions (T&C)</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedDocType('privacy')}
            className={`flex-1 min-w-[200px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-black text-xs uppercase tracking-wider transition-all ${
              selectedDocType === 'privacy'
                ? 'bg-[#00B4D8] text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Privacy Policy (PP)</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400 space-y-3 bg-[#1C2541] rounded-2xl border border-white/10">
          <div className="w-8 h-8 border-2 border-[#00B4D8] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold uppercase tracking-wider">Loading legal document...</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="p-5 sm:p-6 rounded-2xl bg-[#1C2541] border border-white/10 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div className="space-y-1">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#00B4D8]">
                  Editing Document Information
                </span>
                <h3 className="text-base sm:text-lg font-black text-white font-heading">
                  {selectedWebsite === 'chinmaya' ? 'Chinmaya Mission Website' : 'Marathon Website'} •{' '}
                  {selectedDocType === 'terms' ? 'Terms & Conditions' : 'Privacy Policy'}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleResetToDefault}
                  disabled={saving}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs font-bold inline-flex items-center gap-1.5 transition-colors"
                  title="Reset to recommended default template"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                  <span>Reset Default</span>
                </button>

                <a
                  href={getLivePageUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-[#00B4D8]/15 hover:bg-[#00B4D8]/25 text-[#00B4D8] border border-[#00B4D8]/30 text-xs font-bold inline-flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Preview Page</span>
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-black text-slate-300 uppercase tracking-wider">
                  Document Header Title
                </label>
                <input
                  type="text"
                  value={docData.title}
                  onChange={(e) => setDocData({ ...docData, title: e.target.value })}
                  placeholder="e.g. Chinmaya Mission, Adoni - Terms & Conditions"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B132B] border border-white/15 text-white text-xs sm:text-sm font-semibold focus:border-[#00B4D8] focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#00B4D8]" />
                  <span>Last Updated Date</span>
                </label>
                <input
                  type="text"
                  value={docData.lastUpdated}
                  onChange={(e) => setDocData({ ...docData, lastUpdated: e.target.value })}
                  placeholder="e.g. January 2027"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B132B] border border-white/15 text-white text-xs sm:text-sm font-semibold focus:border-[#00B4D8] focus:outline-none transition-colors"
                />
              </div>

              <div className="md:col-span-3 space-y-1.5">
                <label className="text-xs font-black text-slate-300 uppercase tracking-wider">
                  Introductory Paragraph / Subtitle
                </label>
                <textarea
                  rows={2}
                  value={docData.subtitle}
                  onChange={(e) => setDocData({ ...docData, subtitle: e.target.value })}
                  placeholder="Introductory text displayed at the top of the legal page..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B132B] border border-white/15 text-white text-xs sm:text-sm font-medium focus:border-[#00B4D8] focus:outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base sm:text-lg font-black text-white font-heading">
                  Document Sections & Clauses ({docData.sections?.length || 0})
                </h3>
                <p className="text-xs text-slate-400">
                  Each clause represents a numbered article or policy guideline shown to visitors.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddSection}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs inline-flex items-center gap-1.5 shadow transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Clause</span>
              </button>
            </div>

            <div className="space-y-4">
              {docData.sections?.map((section, idx) => (
                <div
                  key={section.id || idx}
                  className="p-4 sm:p-5 rounded-2xl bg-[#1C2541] border border-white/10 hover:border-white/20 transition-all space-y-3.5"
                >
                  <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-lg bg-[#00B4D8]/20 border border-[#00B4D8]/30 text-[#00B4D8] font-black text-xs flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                        Clause #{idx + 1}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleMoveSection(idx, -1)}
                        disabled={idx === 0}
                        className="p-1.5 rounded-lg bg-[#0B132B] text-slate-300 hover:text-white hover:bg-white/10 disabled:opacity-30 transition-colors"
                        title="Move Up"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveSection(idx, 1)}
                        disabled={idx === docData.sections.length - 1}
                        className="p-1.5 rounded-lg bg-[#0B132B] text-slate-300 hover:text-white hover:bg-white/10 disabled:opacity-30 transition-colors"
                        title="Move Down"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveSection(idx)}
                        className="p-1.5 rounded-lg bg-rose-500/15 text-rose-400 hover:bg-rose-500 hover:text-white transition-colors ml-1"
                        title="Delete Section"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-[11px] font-black text-slate-300 uppercase tracking-wider block mb-1">
                        Clause Title / Heading:
                      </label>
                      <input
                        type="text"
                        value={section.title || ''}
                        onChange={(e) => handleSectionChange(idx, 'title', e.target.value)}
                        placeholder="e.g. Acceptance of Terms or What Information We Collect"
                        className="w-full px-3.5 py-2 rounded-xl bg-[#0B132B] border border-white/15 text-white text-xs sm:text-sm font-bold focus:border-[#00B4D8] focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-black text-slate-300 uppercase tracking-wider block mb-1">
                        Clause Description / Terms Content:
                      </label>
                      <textarea
                        rows={4}
                        value={section.content || ''}
                        onChange={(e) => handleSectionChange(idx, 'content', e.target.value)}
                        placeholder="Detailed clause text..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B132B] border border-white/15 text-white text-xs sm:text-sm font-medium focus:border-[#00B4D8] focus:outline-none transition-colors leading-relaxed"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3">
              <button
                type="button"
                onClick={handleAddSection}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 font-bold text-xs inline-flex items-center justify-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Another Clause</span>
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00B4D8] to-blue-600 text-white font-extrabold text-xs shadow-md shadow-[#00B4D8]/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving Changes...' : 'Save All Changes'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TermsPrivacyPage;
