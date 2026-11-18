import React, { useEffect, useState } from 'react';
import { adminMediaService } from '../services/adminApi';
import {
  Image as ImageIcon,
  Upload,
  Trash2,
  Copy,
  Check,
  RefreshCw,
  Filter,
  Plus,
  CheckCircle,
  AlertTriangle,
  ExternalLink,
  Pencil,
  Save,
  X,
  Globe,
  Activity,
  Sparkles,
} from 'lucide-react';

export const ImagesMediaPage = () => {
  const [selectedWebsite, setSelectedWebsite] = useState('chinmaya');
  const [mediaList, setMediaList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    category: 'Upcoming events',
    description: '',
    file: null,
  });
  const [feedback, setFeedback] = useState({ type: null, message: '' });

  // Edit Modal State
  const [editingMedia, setEditingMedia] = useState(null);
  const [updatingMedia, setUpdatingMedia] = useState(false);

  const CHINMAYA_CATEGORIES = [
    'Upcoming events',
    'On going events',
    'Nitya Poojalu',
    'Hanuman Images',
    'Temples & Sevas',
    'Festivals & Gallery',
    'Ashram & Activities',
    'Leadership & Gurus',
    'Logos & Maps',
    'About',
  ];

  const MARATHON_CATEGORIES = [
    'Marathon Posters',
    'Hero & Graphics',
    'Inspiration & Gurus',
    'Logos & Branding',
  ];

  const currentCategories = selectedWebsite === 'marathon' ? MARATHON_CATEGORIES : CHINMAYA_CATEGORIES;

  const handleWebsiteChange = (site) => {
    if (site === selectedWebsite) return;
    setSelectedWebsite(site);
    setSelectedCategory('ALL');
    setUploadForm((prev) => ({
      ...prev,
      category: site === 'marathon' ? 'Marathon Posters' : 'Upcoming events',
    }));
  };

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const [mediaRes, catRes] = await Promise.all([
        adminMediaService.getMedia({
          website: selectedWebsite,
          category: selectedCategory !== 'ALL' ? selectedCategory : undefined,
          limit: 200,
        }),
        adminMediaService.getCategories({ website: selectedWebsite }),
      ]);

      if (mediaRes.data?.success) {
        const rawItems = mediaRes.data.data.items || mediaRes.data.data || [];
        // Strictly deduplicate by URL and title so no duplicate photo ever renders in admin panel
        const seenUrls = new Set();
        const uniqueItems = [];
        rawItems.forEach((item) => {
          const key = (item.url || item._id).trim();
          if (!seenUrls.has(key)) {
            seenUrls.add(key);
            uniqueItems.push(item);
          }
        });
        setMediaList(uniqueItems);
      }
      if (catRes.data?.success) setCategories(catRes.data.data);
    } catch (err) {
      console.error('Failed to load media:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [selectedWebsite, selectedCategory]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadForm.file) {
      alert('Please select an image file to upload.');
      return;
    }

    setUploading(true);
    setFeedback({ type: null, message: '' });

    try {
      const defaultCategory = selectedWebsite === 'marathon' ? 'Marathon Posters' : 'Upcoming events';
      const formData = new FormData();
      formData.append('image', uploadForm.file);
      formData.append('title', uploadForm.title || 'Media Upload');
      formData.append('category', uploadForm.category || defaultCategory);
      formData.append('website', selectedWebsite);
      formData.append('description', uploadForm.description || '');

      const res = await adminMediaService.uploadMedia(formData);
      if (res.data?.success) {
        setFeedback({
          type: 'success',
          message: 'Image asset and description uploaded successfully! Synced across website.',
        });
        setUploadForm({ title: '', category: defaultCategory, description: '', file: null });
        fetchMedia();
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err.response?.data?.message || 'Failed to upload image.',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleCopyUrl = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Permanently delete media item "${title || id}"?`)) return;

    try {
      const res = await adminMediaService.deleteMedia(id);
      if (res.data?.success) {
        setFeedback({
          type: 'success',
          message: 'Media item deleted from database.',
        });
        fetchMedia();
      }
    } catch (err) {
      alert('Failed to delete media');
    }
  };

  const handleStartEdit = (item) => {
    const defaultCat = selectedWebsite === 'marathon' ? 'Marathon Posters' : 'Upcoming events';
    setEditingMedia({
      _id: item._id,
      title: item.title || '',
      category: item.category || defaultCat,
      website: item.website || selectedWebsite,
      caption: item.caption || '',
      description: item.description || '',
      url: item.url,
      newFile: null,
    });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingMedia) return;

    setUpdatingMedia(true);
    setFeedback({ type: null, message: '' });

    try {
      let res;
      if (editingMedia.newFile) {
        const formData = new FormData();
        formData.append('image', editingMedia.newFile);
        formData.append('title', editingMedia.title.trim());
        formData.append('category', editingMedia.category);
        formData.append('website', editingMedia.website || selectedWebsite);
        formData.append('caption', editingMedia.caption || '');
        formData.append('description', editingMedia.description.trim());
        res = await adminMediaService.updateMedia(editingMedia._id, formData);
      } else {
        res = await adminMediaService.updateMedia(editingMedia._id, {
          title: editingMedia.title.trim(),
          category: editingMedia.category,
          website: editingMedia.website || selectedWebsite,
          caption: editingMedia.caption || '',
          description: editingMedia.description.trim(),
        });
      }

      if (res.data?.success) {
        setFeedback({
          type: 'success',
          message: `Updated "${editingMedia.title}" details & description successfully! Live website updated.`,
        });
        setEditingMedia(null);
        fetchMedia();
      } else {
        alert(res.data?.message || 'Failed to update media item.');
      }
    } catch (err) {
      console.error('Update media error:', err);
      alert(err.response?.data?.message || 'Failed to update media item.');
    } finally {
      setUpdatingMedia(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black tracking-widest text-[#00B4D8] uppercase">
            CLOUD ASSETS & CDN
          </span>
          <h2 className="text-2xl sm:text-3xl font-black font-heading text-white">
            IMAGES & MEDIA LIBRARY
          </h2>
          <p className="text-xs text-[#94A3B8] font-medium">
            Upload, browse, categorize, and edit image asset URLs, titles, and descriptions that reflect live on the website
          </p>
        </div>

        <button
          onClick={fetchMedia}
          disabled={loading}
          className="btn-secondary text-xs py-2 px-3.5 self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Reload</span>
        </button>
      </div>

      {/* Website Selection Switcher Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => handleWebsiteChange('chinmaya')}
          className={`flex items-start gap-4 p-5 rounded-3xl border text-left transition-all cursor-pointer relative overflow-hidden ${
            selectedWebsite === 'chinmaya'
              ? 'bg-gradient-to-br from-[#1C2541] to-[#253256] border-[#00B4D8] shadow-xl ring-2 ring-[#00B4D8]/50'
              : 'bg-[#161F38]/80 border-white/10 hover:border-white/20 opacity-75 hover:opacity-100'
          }`}
        >
          <div
            className={`p-3 rounded-2xl ${
              selectedWebsite === 'chinmaya'
                ? 'bg-[#00B4D8] text-white shadow-md'
                : 'bg-white/10 text-slate-300'
            }`}
          >
            <Globe className="w-6 h-6" />
          </div>
          <div className="space-y-1 flex-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-[#00B4D8]">
                CHINMAYA MISSION
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  selectedWebsite === 'chinmaya'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-white/5 text-slate-400'
                }`}
              >
                Port 5176 • Active
              </span>
            </div>
            <h3 className="text-base font-extrabold text-white">Chinmaya Mission Website</h3>
            <p className="text-xs text-[#94A3B8]">
              Manage photos for Temples, Sevas, Upcoming & Ongoing Events, Ashram Activities, and Leadership.
            </p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => handleWebsiteChange('marathon')}
          className={`flex items-start gap-4 p-5 rounded-3xl border text-left transition-all cursor-pointer relative overflow-hidden ${
            selectedWebsite === 'marathon'
              ? 'bg-gradient-to-br from-[#1C2541] to-[#253256] border-orange-500 shadow-xl ring-2 ring-orange-500/50'
              : 'bg-[#161F38]/80 border-white/10 hover:border-white/20 opacity-75 hover:opacity-100'
          }`}
        >
          <div
            className={`p-3 rounded-2xl ${
              selectedWebsite === 'marathon'
                ? 'bg-orange-500 text-white shadow-md'
                : 'bg-white/10 text-slate-300'
            }`}
          >
            <Activity className="w-6 h-6" />
          </div>
          <div className="space-y-1 flex-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-orange-400">
                ANTI-DRUG RUN
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  selectedWebsite === 'marathon'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-white/5 text-slate-400'
                }`}
              >
                Port 5175 • Active
              </span>
            </div>
            <h3 className="text-base font-extrabold text-white">Marathon Website</h3>
            <p className="text-xs text-[#94A3B8]">
              Manage photos for Marathon Posters, Runner Graphics, Gurudev Inspiration, and Logos.
            </p>
          </div>
        </button>
      </div>

      {feedback.message && (
        <div
          className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2.5 ${
            feedback.type === 'success'
              ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
              : 'bg-red-500/15 border border-red-500/30 text-red-400'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            <AlertTriangle className="w-4 h-4" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Upload Card */}
      <div className="p-6 sm:p-7 rounded-3xl bg-[#1C2541] border border-white/10 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-[#00B4D8]" />
            <h3 className="text-sm font-black font-heading text-white uppercase tracking-wider">
              Upload Image Asset ({selectedWebsite === 'marathon' ? 'Marathon Website' : 'Chinmaya Mission Website'})
            </h3>
          </div>
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-white/10 text-cyan-300">
            Target: {selectedWebsite === 'marathon' ? 'Marathon' : 'Chinmaya'}
          </span>
        </div>

        <form onSubmit={handleUpload} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-white uppercase mb-1">
                Image Title / Event Name *
              </label>
              <input
                type="text"
                required
                value={uploadForm.title}
                onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                placeholder={selectedWebsite === 'marathon' ? 'e.g. Marathon Poster 8 - Champions' : 'e.g. Rama Navami Celebrations'}
                className="w-full py-2.5 px-3 rounded-xl bg-[#0B132B] border border-white/10 font-semibold text-white focus:outline-none focus:border-[#00B4D8]"
              />
            </div>

            <div>
              <label className="block font-bold text-white uppercase mb-1">
                Asset Category / Section *
              </label>
              <select
                value={uploadForm.category}
                onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })}
                className="w-full py-2.5 px-3 rounded-xl bg-[#0B132B] border border-white/10 font-semibold text-white focus:outline-none focus:border-[#00B4D8]"
              >
                {currentCategories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
                <option value="General">General</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-white uppercase mb-1">
              Select Image File *
            </label>
            <input
              type="file"
              required
              accept="image/*"
              onChange={(e) => setUploadForm({ ...uploadForm, file: e.target.files[0] || null })}
              className="w-full py-2 px-3 rounded-xl bg-[#0B132B] border border-white/10 font-semibold text-[#94A3B8] focus:outline-none focus:border-[#00B4D8] file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#00B4D8] file:text-white"
            />
          </div>

          <div>
            <label className="block font-bold text-white uppercase mb-1 flex items-center justify-between">
              <span>Full Event Description (shown when image is clicked on main site)</span>
              <span className="text-[10px] text-amber-300 font-normal">Supports paragraphs & bullets</span>
            </label>
            <textarea
              rows={4}
              value={uploadForm.description}
              onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
              placeholder="Enter detailed celebration schedule, date, rituals, and welcoming message for devotees..."
              className="w-full p-3 rounded-xl bg-[#0B132B] border border-white/10 font-medium text-white focus:outline-none focus:border-[#00B4D8] leading-relaxed resize-y font-mono text-xs"
            />
          </div>

          <div className="pt-1">
            <button
              type="submit"
              disabled={uploading}
              className="btn-primary text-xs py-2.5 px-5 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{uploading ? 'Uploading Asset...' : 'Upload Image & Description'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Media Filter & Library */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-black font-heading text-white">
              {selectedWebsite === 'marathon' ? 'MARATHON MEDIA ASSETS' : 'CHINMAYA MISSION MEDIA ASSETS'} ({mediaList.length})
            </h3>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              {selectedWebsite.toUpperCase()} ONLY
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#94A3B8]" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="py-1.5 px-3 rounded-xl bg-[#1C2541] border border-white/10 text-xs font-semibold text-white focus:outline-none focus:border-[#00B4D8]"
            >
              <option value="ALL" className="bg-[#0B132B]">
                {selectedWebsite === 'marathon' ? 'All Marathon Categories' : 'All Chinmaya Categories'}
              </option>
              {currentCategories.map((c) => (
                <option key={c} value={c} className="bg-[#0B132B]">
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Section Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/10">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#94A3B8] mr-1">
            Filter:
          </span>
          {['ALL', ...currentCategories].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? selectedWebsite === 'marathon'
                    ? 'bg-orange-500 text-white shadow-sm'
                    : 'bg-[#00B4D8] text-white shadow-sm'
                  : 'bg-[#1C2541] text-[#CBD5E1] hover:bg-[#253256] border border-white/10'
              }`}
            >
              {cat === 'ALL'
                ? selectedWebsite === 'marathon'
                  ? 'All Marathon Images'
                  : 'All Chinmaya Mission Images'
                : cat}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-xs text-[#94A3B8] text-center py-8">Loading media library...</p>
        ) : mediaList.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {mediaList.map((item) => (
              <div
                key={item._id}
                className="rounded-2xl bg-[#1C2541] border border-white/10 overflow-hidden shadow-lg flex flex-col justify-between"
              >
                <div className="relative aspect-video bg-[#0B132B] overflow-hidden group">
                  <img
                    src={item.url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 text-[10px] font-bold text-white">
                    {item.category || 'General'}
                  </span>
                </div>

                <div className="p-3.5 space-y-2.5 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-extrabold text-xs text-white truncate" title={item.title}>
                      {item.title}
                    </h4>
                    <span className="text-[10px] text-[#64748B] block truncate" title={item.url}>
                      {item.url}
                    </span>
                    {item.description ? (
                      <p className="text-[11px] text-slate-300 line-clamp-2 mt-1.5 leading-snug bg-black/20 p-1.5 rounded-lg border border-white/5">
                        {item.description}
                      </p>
                    ) : null}
                    {item.caption ? (
                      <span className="inline-block mt-1.5 text-[10px] font-semibold text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20">
                        {item.caption}
                      </span>
                    ) : null}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => handleCopyUrl(item.url, item._id)}
                      className="flex items-center gap-1 text-[11px] font-bold text-[#00B4D8] hover:underline cursor-pointer"
                    >
                      {copiedId === item._id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy URL</span>
                        </>
                      )}
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleStartEdit(item)}
                        className="flex items-center gap-1 text-[11px] font-bold text-amber-400 hover:text-amber-300 hover:underline cursor-pointer"
                        title="Edit Image Title, Category & Description"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(item._id, item.title)}
                        className="p-1 rounded-lg bg-red-500/15 text-red-400 hover:bg-red-500 hover:text-white transition-colors"
                        title="Delete Asset"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-[#64748B] text-center py-8">No media items in this category.</p>
        )}
      </div>

      {/* Edit Media Asset Modal */}
      {editingMedia && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setEditingMedia(null)}
        >
          <div
            className="bg-[#1C2541] border border-white/15 rounded-3xl max-w-xl w-full p-6 space-y-4 text-white max-h-[92vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Pencil className="w-4 h-4 text-[#00B4D8]" />
                <h3 className="text-base font-black font-heading text-white uppercase tracking-wider">
                  Edit Media Asset & Description
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingMedia(null)}
                className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              {/* Image Preview & Replacement */}
              <div className="flex items-start gap-4 p-3 rounded-2xl bg-[#0B132B] border border-white/10">
                <img
                  src={editingMedia.newFile ? URL.createObjectURL(editingMedia.newFile) : editingMedia.url}
                  alt={editingMedia.title}
                  className="w-24 h-24 object-cover rounded-xl border border-white/20 shrink-0 bg-black"
                />
                <div className="space-y-2 flex-1">
                  <label className="block font-bold text-white uppercase">
                    Replace Image File (Optional)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setEditingMedia({
                        ...editingMedia,
                        newFile: e.target.files[0] || null,
                      })
                    }
                    className="w-full text-[11px] text-[#94A3B8] file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[11px] file:font-bold file:bg-[#00B4D8] file:text-white cursor-pointer"
                  />
                  <p className="text-[10px] text-slate-400">
                    Leave blank to keep the current image and update only text/description.
                  </p>
                </div>
              </div>

              {/* Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-white uppercase mb-1">
                    Event Title / Asset Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingMedia.title}
                    onChange={(e) =>
                      setEditingMedia({ ...editingMedia, title: e.target.value })
                    }
                    placeholder="e.g. Rama Navami"
                    className="w-full py-2.5 px-3 rounded-xl bg-[#0B132B] border border-white/10 font-semibold text-white focus:outline-none focus:border-[#00B4D8]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-white uppercase mb-1">
                    Category / Section *
                  </label>
                  <select
                    value={editingMedia.category}
                    onChange={(e) =>
                      setEditingMedia({ ...editingMedia, category: e.target.value })
                    }
                    className="w-full py-2.5 px-3 rounded-xl bg-[#0B132B] border border-white/10 font-semibold text-white focus:outline-none focus:border-[#00B4D8]"
                  >
                    {Array.from(new Set([...currentCategories, editingMedia.category, 'General'].filter(Boolean))).map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Subtitle / Event Date / Badge */}
              <div>
                <label className="block font-bold text-white uppercase mb-1">
                  Subtitle / Badge / Timing (e.g. Every Day, Every Saturday, April 15th)
                </label>
                <input
                  type="text"
                  value={editingMedia.caption}
                  onChange={(e) =>
                    setEditingMedia({ ...editingMedia, caption: e.target.value })
                  }
                  placeholder="e.g. Every Day, Every Saturday, or Event Date"
                  className="w-full py-2.5 px-3 rounded-xl bg-[#0B132B] border border-white/10 font-semibold text-white focus:outline-none focus:border-[#00B4D8]"
                />
              </div>

              {/* Full Description */}
              <div>
                <label className="block font-bold text-white uppercase mb-1 flex items-center justify-between">
                  <span>Full Event Description (shown when clicked on main site) *</span>
                  <span className="text-[10px] text-amber-300 font-normal">Supports paragraphs & bullets</span>
                </label>
                <textarea
                  rows={8}
                  required
                  value={editingMedia.description}
                  onChange={(e) =>
                    setEditingMedia({ ...editingMedia, description: e.target.value })
                  }
                  placeholder="Enter full celebration details, date, program schedule, and message for devotees..."
                  className="w-full p-3 rounded-xl bg-[#0B132B] border border-white/10 font-medium text-white focus:outline-none focus:border-[#00B4D8] leading-relaxed resize-y font-mono text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingMedia(null)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingMedia}
                  className="btn-primary py-2 px-5 text-xs inline-flex items-center gap-1.5 cursor-pointer"
                >
                  {updatingMedia ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>Save & Sync to Website</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImagesMediaPage;
