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
  Info,
} from 'lucide-react';
import { legalService } from '../../services/api';

export const TermsPrivacyManager = () => {
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
      const res = await legalService.getLegalDoc(website, type);
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

      const res = await legalService.updateLegalDoc(selectedWebsite, selectedDocType, payload);
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
      } to the recommended default template? Any custom modifications will be overwritten.`
    );
    if (!confirmReset) return;

    setSaving(true);
    try {
      const res = await legalService.resetLegalDoc(selectedWebsite, selectedDocType);
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

  const getLivePageUrl = () => {
    const path = selectedDocType === 'terms' ? '/terms' : '/privacy';
    if (selectedWebsite === 'chinmaya') {
      return `${window.location.origin}${path}`;
    }
    // Marathon port is 5175 in dev, or marathon website url
    return `http://localhost:5175${path}`;
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-color)] shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">
              <Scale className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-[var(--text-primary)] font-heading tracking-tight">
              T&C and PP (Terms & Conditions & Privacy Policy)
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] font-medium">
            Manage separated legal policies and terms for Chinmaya Mission Website and Marathon Website.
          </p>
        </div>

        {/* Global Action: Save Changes */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <a
            href={getLivePageUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--border-color)] text-xs font-bold text-[var(--text-primary)] hover:bg-[var(--bg-primary)] transition-all"
          >
            <ExternalLink className="w-4 h-4 text-cyan-500" />
            <span>Preview Live Page</span>
          </a>

          <button
            onClick={handleSave}
            disabled={saving || loading}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-extrabold text-xs shadow-lg shadow-cyan-500/25 transition-all cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. Notification Message */}
      {message.text && (
        <div
          className={`p-4 rounded-2xl flex items-center gap-3 text-xs sm:text-sm font-bold border transition-all ${
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

      {/* 3. STEP 1: SELECT WEBSITE (Chinmaya Mission vs Marathon) */}
      <div className="space-y-3">
        <label className="text-xs font-black text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-2">
          <span>1. Select Website Platform:</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Option A: Chinmaya Mission Website */}
          <button
            type="button"
            onClick={() => setSelectedWebsite('chinmaya')}
            className={`p-5 rounded-3xl border text-left transition-all relative overflow-hidden flex items-start gap-4 cursor-pointer ${
              selectedWebsite === 'chinmaya'
                ? 'bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border-blue-500 shadow-xl shadow-blue-500/10'
                : 'bg-[var(--bg-secondary)] border-[var(--border-color)] hover:border-blue-400/50 text-[var(--text-muted)]'
            }`}
          >
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                selectedWebsite === 'chinmaya'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-[var(--bg-primary)] text-[var(--text-muted)]'
              }`}
            >
              <Building className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-extrabold text-[var(--text-primary)] font-heading">
                  Chinmaya Mission Website
                </span>
                {selectedWebsite === 'chinmaya' && (
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-500 text-[10px] font-black uppercase">
                    Active
                  </span>
                )}
              </div>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                Spiritual portal: Temple Sevas, Puja registrations, 80G tax exemptions, Balavihar & Vedanta classes.
              </p>
            </div>
          </button>

          {/* Option B: Marathon Website */}
          <button
            type="button"
            onClick={() => setSelectedWebsite('marathon')}
            className={`p-5 rounded-3xl border text-left transition-all relative overflow-hidden flex items-start gap-4 cursor-pointer ${
              selectedWebsite === 'marathon'
                ? 'bg-gradient-to-br from-orange-500/10 to-amber-500/10 border-orange-500 shadow-xl shadow-orange-500/10'
                : 'bg-[var(--bg-secondary)] border-[var(--border-color)] hover:border-orange-400/50 text-[var(--text-muted)]'
            }`}
          >
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                selectedWebsite === 'marathon'
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                  : 'bg-[var(--bg-primary)] text-[var(--text-muted)]'
              }`}
            >
              <Flame className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-extrabold text-[var(--text-primary)] font-heading">
                  Marathon Website
                </span>
                {selectedWebsite === 'marathon' && (
                  <span className="px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-500 text-[10px] font-black uppercase">
                    Active
                  </span>
                )}
              </div>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                Anti-Drug Mini-Marathon: Runner registrations, entry pass rules, health waiver, timing & bib allocation.
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* 4. STEP 2: SELECT DOCUMENT TYPE (Terms & Conditions vs Privacy Policy) */}
      <div className="space-y-3">
        <label className="text-xs font-black text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-2">
          <span>2. Select Document to Edit:</span>
        </label>
        <div className="flex flex-wrap gap-2.5 p-2 rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--border-color)]">
          <button
            type="button"
            onClick={() => setSelectedDocType('terms')}
            className={`flex-1 min-w-[200px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer ${
              selectedDocType === 'terms'
                ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/25'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-primary)]'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Terms & Conditions (T&C)</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedDocType('privacy')}
            className={`flex-1 min-w-[200px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer ${
              selectedDocType === 'privacy'
                ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/25'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-primary)]'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Privacy Policy (PP)</span>
          </button>
        </div>
      </div>

      {/* 5. DOCUMENT CONTENT EDITOR */}
      {loading ? (
        <div className="p-12 text-center rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-muted)] font-bold">
          <div className="w-8 h-8 border-3 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <span>Loading document content...</span>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Active Context Banner */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-5 py-3.5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)]">
            <div className="flex items-center gap-2 text-xs font-extrabold text-[var(--text-primary)]">
              <Info className="w-4 h-4 text-cyan-500 shrink-0" />
              <span>
                Currently Editing:{' '}
                <strong className="text-cyan-500 uppercase">
                  {selectedWebsite === 'chinmaya' ? 'Chinmaya Mission' : 'Marathon'}
                </strong>{' '}
                —{' '}
                <strong className="text-amber-500 uppercase">
                  {selectedDocType === 'terms' ? 'Terms & Conditions' : 'Privacy Policy'}
                </strong>
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] font-semibold">
              <Clock className="w-3.5 h-3.5" />
              <span>Last Updated: {docData.lastUpdated || 'January 2027'}</span>
            </div>
          </div>

          {/* Document Header Fields */}
          <div className="p-6 rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-color)] shadow-xl space-y-4">
            <h3 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-500" />
              <span>Document Header Details</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[11px] font-black text-[var(--text-muted)] uppercase tracking-wider">
                  Document Title:
                </label>
                <input
                  type="text"
                  value={docData.title}
                  onChange={(e) => setDocData({ ...docData, title: e.target.value })}
                  placeholder="e.g. Terms and Conditions / Privacy Policy"
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs font-bold text-[var(--text-primary)] focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-[var(--text-muted)] uppercase tracking-wider">
                  Last Updated Date:
                </label>
                <input
                  type="text"
                  value={docData.lastUpdated}
                  onChange={(e) => setDocData({ ...docData, lastUpdated: e.target.value })}
                  placeholder="e.g. January 2027"
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs font-bold text-[var(--text-primary)] focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-[var(--text-muted)] uppercase tracking-wider">
                Subtitle / Preamble Note:
              </label>
              <textarea
                rows={2}
                value={docData.subtitle}
                onChange={(e) => setDocData({ ...docData, subtitle: e.target.value })}
                placeholder="Brief summary or introductory note displayed under the title..."
                className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs font-medium text-[var(--text-primary)] focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Document Clauses / Sections List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-[var(--text-primary)] font-heading">
                  Document Clauses & Policies ({docData.sections?.length || 0})
                </h3>
                <p className="text-xs text-[var(--text-muted)]">
                  Add, edit, reorder or remove individual clauses for this document.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddSection}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-extrabold text-xs shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Clause</span>
              </button>
            </div>

            {/* List of Section Cards */}
            <div className="space-y-3.5">
              {(docData.sections || []).map((sec, idx) => (
                <div
                  key={sec.id || idx}
                  className="p-5 rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-color)] shadow-lg space-y-3 transition-all hover:border-cyan-500/40"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 pb-2 border-b border-[var(--border-color)]">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-500 flex items-center justify-center font-black text-xs">
                        {idx + 1}
                      </span>
                      <span className="text-xs font-black text-[var(--text-muted)] uppercase tracking-wider">
                        Clause {idx + 1}
                      </span>
                    </div>

                    {/* Section Controls (Move up, Move down, Delete) */}
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleMoveSection(idx, -1)}
                        disabled={idx === 0}
                        className="p-1.5 rounded-lg border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-primary)] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Move Up"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleMoveSection(idx, 1)}
                        disabled={idx === (docData.sections.length - 1)}
                        className="p-1.5 rounded-lg border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-primary)] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Move Down"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRemoveSection(idx)}
                        className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-all ml-1 cursor-pointer"
                        title="Delete Clause"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Clause Title Input */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-wider">
                      Clause Title:
                    </label>
                    <input
                      type="text"
                      value={sec.title}
                      onChange={(e) => handleSectionChange(idx, 'title', e.target.value)}
                      placeholder="e.g. 1. Acceptance of Terms / Medical Clearance"
                      className="w-full px-3.5 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs font-bold text-[var(--text-primary)] focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  {/* Clause Content Input */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-wider">
                      Clause Content (Multi-line paragraphs supported):
                    </label>
                    <textarea
                      rows={4}
                      value={sec.content}
                      onChange={(e) => handleSectionChange(idx, 'content', e.target.value)}
                      placeholder="Enter legal description, terms, policies or conditions..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs font-medium text-[var(--text-primary)] leading-relaxed focus:outline-none focus:border-cyan-500 font-mono"
                    />
                  </div>
                </div>
              ))}

              {(!docData.sections || docData.sections.length === 0) && (
                <div className="p-8 text-center rounded-3xl bg-[var(--bg-secondary)] border border-dashed border-[var(--border-color)] text-[var(--text-muted)] text-xs font-bold">
                  No clauses in this document yet. Click "Add New Clause" or "Reset to Recommended Default".
                </div>
              )}
            </div>

            {/* Bottom Add Section Button */}
            <button
              type="button"
              onClick={handleAddSection}
              className="w-full py-4 rounded-2xl border border-dashed border-[var(--border-color)] text-[var(--text-muted)] hover:text-cyan-500 hover:border-cyan-500/50 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Another Clause to this Document</span>
            </button>
          </div>

          {/* 6. BOTTOM ACTION TOOLBAR */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-color)] shadow-xl">
            <button
              type="button"
              onClick={handleResetToDefault}
              disabled={saving}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 text-xs font-extrabold transition-all cursor-pointer disabled:opacity-50"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset to Recommended Default</span>
            </button>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <a
                href={getLivePageUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--border-color)] text-xs font-bold text-[var(--text-primary)] hover:bg-[var(--bg-primary)] transition-all"
              >
                <ExternalLink className="w-4 h-4 text-cyan-500" />
                <span>Preview Live Page</span>
              </a>

              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-extrabold text-xs shadow-lg shadow-cyan-500/30 transition-all cursor-pointer disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TermsPrivacyManager;
