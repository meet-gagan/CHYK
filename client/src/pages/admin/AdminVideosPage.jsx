import React, { useState, useEffect } from 'react';
import { videoService } from '../../services/api';
import { extractYouTubeId, getYouTubeThumbnailUrl } from '../../utils/youtube';
import {
  Video as VideoIcon,
  Plus,
  Trash2,
  Edit2,
  RefreshCw,
  Search,
  ExternalLink,
  Play,
  AlertTriangle,
  CheckCircle,
  X,
  Info,
} from 'lucide-react';

const YoutubeIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

export const AdminVideosPage = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusMessage, setStatusMessage] = useState({ type: null, text: '' });

  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Form State (strictly only 3 required fields)
  const [form, setForm] = useState({
    youtubeUrl: '',
    title: '',
    description: '',
  });
  const [detectedId, setDetectedId] = useState(null);
  const [urlError, setUrlError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Load Videos
  const loadVideos = async () => {
    setLoading(true);
    try {
      const res = await videoService.getVideos();
      if (res.data?.success && Array.isArray(res.data.data)) {
        setVideos(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load videos:', err);
      showNotice('error', 'Failed to load videos. Please check your network connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVideos();
  }, []);

  const showNotice = (type, text) => {
    setStatusMessage({ type, text });
    setTimeout(() => {
      setStatusMessage({ type: null, text: '' });
    }, 4500);
  };

  // Handle URL change & live validation
  const handleUrlChange = (e) => {
    const val = e.target.value;
    setForm((prev) => ({ ...prev, youtubeUrl: val }));

    if (!val.trim()) {
      setDetectedId(null);
      setUrlError('');
      return;
    }

    const id = extractYouTubeId(val);
    if (id) {
      setDetectedId(id);
      setUrlError('');
    } else {
      setDetectedId(null);
      setUrlError('Invalid YouTube URL. Please enter a valid youtube.com, youtu.be, or shorts link.');
    }
  };

  // Open Add Modal
  const openAddModal = () => {
    setForm({
      youtubeUrl: '',
      title: '',
      description: '',
    });
    setDetectedId(null);
    setUrlError('');
    setShowAddModal(true);
  };

  // Open Edit Modal
  const openEditModal = (video) => {
    setSelectedVideo(video);
    setForm({
      youtubeUrl: video.youtubeUrl || `https://www.youtube.com/watch?v=${video.youtubeId}`,
      title: video.title || '',
      description: video.description || '',
    });
    setDetectedId(video.youtubeId || null);
    setUrlError('');
    setShowEditModal(true);
  };

  // Open Delete Modal
  const openDeleteModal = (video) => {
    setSelectedVideo(video);
    setShowDeleteModal(true);
  };

  // Submit Add Video
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    // Validation
    const id = extractYouTubeId(form.youtubeUrl);
    if (!id) {
      setUrlError('Please enter a valid YouTube Video URL');
      return;
    }
    if (!form.title.trim()) {
      showNotice('error', 'Video Title is required.');
      return;
    }
    if (!form.description.trim()) {
      showNotice('error', 'One-line Description is required.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await videoService.createVideo({
        youtubeUrl: form.youtubeUrl.trim(),
        title: form.title.trim(),
        description: form.description.trim(),
      });

      if (res.data?.success) {
        showNotice('success', 'Video added successfully! It is now live on the Marathon website.');
        setShowAddModal(false);
        loadVideos();
      } else {
        showNotice('error', res.data?.message || 'Failed to add video.');
      }
    } catch (err) {
      console.error('Error creating video:', err);
      showNotice('error', err.response?.data?.message || 'Error saving video. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Submit Edit Video
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (submitting || !selectedVideo) return;

    const id = extractYouTubeId(form.youtubeUrl);
    if (!id) {
      setUrlError('Please enter a valid YouTube Video URL');
      return;
    }
    if (!form.title.trim()) {
      showNotice('error', 'Video Title is required.');
      return;
    }
    if (!form.description.trim()) {
      showNotice('error', 'One-line Description is required.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await videoService.updateVideo(selectedVideo._id, {
        youtubeUrl: form.youtubeUrl.trim(),
        title: form.title.trim(),
        description: form.description.trim(),
      });

      if (res.data?.success) {
        showNotice('success', 'Video updated successfully! Changes reflected on Marathon website.');
        setShowEditModal(false);
        loadVideos();
      } else {
        showNotice('error', res.data?.message || 'Failed to update video.');
      }
    } catch (err) {
      console.error('Error updating video:', err);
      showNotice('error', err.response?.data?.message || 'Error updating video. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Submit Delete Video
  const handleDeleteConfirm = async () => {
    if (submitting || !selectedVideo) return;

    setSubmitting(true);
    try {
      const res = await videoService.deleteVideo(selectedVideo._id);
      if (res.data?.success) {
        showNotice('success', 'Video removed successfully from Marathon website.');
        setShowDeleteModal(false);
        loadVideos();
      } else {
        showNotice('error', res.data?.message || 'Failed to delete video.');
      }
    } catch (err) {
      console.error('Error deleting video:', err);
      showNotice('error', err.response?.data?.message || 'Error deleting video. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Filtered videos based on search
  const filteredVideos = videos.filter((v) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      (v.title && v.title.toLowerCase().includes(q)) ||
      (v.description && v.description.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {statusMessage.text && (
        <div
          className={`p-4 rounded-2xl text-xs font-black flex items-center gap-3 shadow-xl transition-all ${
            statusMessage.type === 'error'
              ? 'bg-red-500/15 border border-red-500/30 text-red-500'
              : 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-500'
          }`}
        >
          {statusMessage.type === 'error' ? (
            <AlertTriangle className="w-5 h-5 shrink-0" />
          ) : (
            <CheckCircle className="w-5 h-5 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-color)] relative overflow-hidden shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/15 text-red-500 font-extrabold text-[10px] tracking-widest uppercase border border-red-500/30">
              <YoutubeIcon className="w-3.5 h-3.5" />
              <span>YOUTUBE VIDEO CMS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-heading text-[var(--text-primary)]">
              Video Management
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] font-semibold max-w-2xl">
              Add and manage YouTube videos for the public Marathon website (/videos).
              All additions, edits, and removals automatically update on the live website.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={loadVideos}
              disabled={loading}
              className="btn-secondary text-xs py-3 px-4 flex items-center gap-2"
              title="Refresh videos"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">REFRESH</span>
            </button>

            <button
              onClick={openAddModal}
              className="btn-primary text-xs py-3 px-6 flex items-center gap-2 shadow-lg hover:scale-105 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>ADD YOUTUBE VIDEO</span>
            </button>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-[var(--border-color)]">
          <div>
            <span className="text-[10px] font-extrabold uppercase text-[var(--text-muted)] tracking-wider">
              TOTAL VIDEOS
            </span>
            <p className="text-xl sm:text-2xl font-black text-[var(--text-primary)] mt-0.5">
              {videos.length}
            </p>
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase text-[var(--text-muted)] tracking-wider">
              LIVE ON MARATHON SITE
            </span>
            <p className="text-xl sm:text-2xl font-black text-emerald-500 mt-0.5">
              {videos.length}
            </p>
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase text-[var(--text-muted)] tracking-wider">
              PUBLIC ROUTE
            </span>
            <p className="text-xs sm:text-sm font-black text-[var(--orange)] mt-1.5 flex items-center gap-1">
              <span>/videos</span>
            </p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md">
        <div className="relative flex-grow max-w-md">
          <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search videos by title or description..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs font-bold text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-red-500"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="text-xs font-bold text-[var(--text-muted)]">
          Showing <span className="text-[var(--text-primary)] font-extrabold">{filteredVideos.length}</span> of{' '}
          {videos.length} videos
        </div>
      </div>

      {/* Videos List / Grid */}
      {loading ? (
        <div className="p-16 text-center space-y-4 glass-card rounded-3xl">
          <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-[var(--text-muted)] tracking-wider uppercase">
            Loading Videos...
          </p>
        </div>
      ) : filteredVideos.length === 0 ? (
        <div className="p-16 text-center space-y-4 glass-card rounded-3xl border border-[var(--border-color)]">
          <VideoIcon className="w-12 h-12 text-[var(--text-muted)] mx-auto opacity-40" />
          <h3 className="text-lg font-extrabold text-[var(--text-primary)] font-heading">
            No Videos Found
          </h3>
          <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto">
            {search
              ? 'No videos matched your search query.'
              : 'No YouTube videos have been added yet. Click below to add your first video.'}
          </p>
          <button
            onClick={openAddModal}
            className="btn-primary py-2.5 px-6 text-xs text-decoration-none inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>ADD FIRST VIDEO</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredVideos.map((video) => (
            <div
              key={video._id}
              className="glass-card rounded-2xl overflow-hidden border border-[var(--border-color)] hover:border-red-500/40 transition-all duration-300 shadow-md flex flex-col justify-between group"
            >
              <div>
                {/* 16:9 Thumbnail Container */}
                <div className="relative aspect-video bg-black overflow-hidden">
                  <img
                    src={video.thumbnailUrl || getYouTubeThumbnailUrl(video.youtubeId)}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = getYouTubeThumbnailUrl(video.youtubeId);
                    }}
                  />
                  {/* Play badge overlay */}
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/15 transition-colors flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-2">
                  <h4
                    className="font-heading font-black text-sm text-[var(--text-primary)] line-clamp-2 leading-tight"
                    title={video.title}
                  >
                    {video.title}
                  </h4>
                  <p
                    className="text-xs text-[var(--text-muted)] truncate block"
                    title={video.description}
                  >
                    {video.description}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 pt-0 border-t border-[var(--border-color)]/50 mt-2 flex items-center justify-between gap-2">
                <a
                  href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-bold text-[var(--text-muted)] hover:text-red-500 flex items-center gap-1 transition-colors"
                  title="Open on YouTube in new tab"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Watch</span>
                </a>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(video)}
                    className="p-2 rounded-xl bg-[var(--bg-primary)] hover:bg-[var(--bg-tertiary)] text-[var(--text-primary)] border border-[var(--border-color)] transition-colors"
                    title="Edit video"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => openDeleteModal(video)}
                    className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 transition-colors"
                    title="Delete video"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL: ADD YOUTUBE VIDEO */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-red-500/15 text-red-500 flex items-center justify-center">
                  <YoutubeIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black font-heading text-[var(--text-primary)]">
                    Add YouTube Video
                  </h3>
                  <p className="text-[11px] text-[var(--text-muted)] font-medium">
                    This video will appear on the public Marathon website /videos page
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-xl hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              {/* Field 1: YouTube Video URL */}
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase text-[var(--text-primary)] tracking-wide flex items-center justify-between">
                  <span>1. YouTube Video URL *</span>
                  {detectedId && (
                    <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Valid YouTube Link
                    </span>
                  )}
                </label>
                <input
                  type="text"
                  required
                  value={form.youtubeUrl}
                  onChange={handleUrlChange}
                  placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                  className={`w-full px-4 py-2.5 rounded-xl bg-[var(--bg-primary)] border text-xs font-bold text-[var(--text-primary)] focus:outline-none transition-colors ${
                    urlError
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-[var(--border-color)] focus:border-red-500'
                  }`}
                />
                {urlError ? (
                  <p className="text-[11px] text-red-500 font-semibold flex items-center gap-1 mt-1">
                    <AlertTriangle className="w-3 h-3 shrink-0" />
                    <span>{urlError}</span>
                  </p>
                ) : (
                  <p className="text-[10px] text-[var(--text-muted)]">
                    Supports standard watch URLs, youtu.be links, shorts, or embed links.
                  </p>
                )}

                {/* Live Preview Box when valid ID detected */}
                {detectedId && (
                  <div className="mt-2 p-2.5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] flex items-center gap-3">
                    <div className="w-24 aspect-video rounded-lg overflow-hidden bg-black shrink-0 relative">
                      <img
                        src={getYouTubeThumbnailUrl(detectedId)}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <Play className="w-3.5 h-3.5 fill-white text-white" />
                      </div>
                    </div>
                    <div className="text-[11px] text-[var(--text-muted)]">
                      <span className="font-extrabold text-emerald-500 block">Thumbnail Auto-Detected</span>
                      <span>16:9 HD thumbnail ready to display</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Field 2: Video Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase text-[var(--text-primary)] tracking-wide">
                  2. Video Title *
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Anti-Drug Movement Marathon 2026 Promo Anthem"
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs font-bold text-[var(--text-primary)] focus:outline-none focus:border-red-500"
                />
              </div>

              {/* Field 3: One-Line Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase text-[var(--text-primary)] tracking-wide">
                  3. One-Line Description *
                </label>
                <input
                  type="text"
                  required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="e.g. Join hundreds of students running for a drug-free future in Adoni."
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs font-bold text-[var(--text-primary)] focus:outline-none focus:border-red-500"
                />
                <p className="text-[10px] text-[var(--text-muted)]">
                  Kept to a concise one line below the title on the public Marathon page.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border-color)]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-secondary text-xs py-2.5 px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !detectedId}
                  className="btn-primary text-xs py-2.5 px-6 flex items-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>SAVING...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>SAVE VIDEO</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT YOUTUBE VIDEO */}
      {showEditModal && selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-blue-500/15 text-blue-500 flex items-center justify-center">
                  <Edit2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black font-heading text-[var(--text-primary)]">
                    Edit YouTube Video
                  </h3>
                  <p className="text-[11px] text-[var(--text-muted)] font-medium">
                    Modify the video link, title, or one-line description
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-1.5 rounded-xl hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              {/* Field 1: YouTube Video URL */}
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase text-[var(--text-primary)] tracking-wide flex items-center justify-between">
                  <span>1. YouTube Video URL *</span>
                  {detectedId && (
                    <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Valid YouTube Link
                    </span>
                  )}
                </label>
                <input
                  type="text"
                  required
                  value={form.youtubeUrl}
                  onChange={handleUrlChange}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className={`w-full px-4 py-2.5 rounded-xl bg-[var(--bg-primary)] border text-xs font-bold text-[var(--text-primary)] focus:outline-none transition-colors ${
                    urlError
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-[var(--border-color)] focus:border-blue-500'
                  }`}
                />
                {urlError && (
                  <p className="text-[11px] text-red-500 font-semibold flex items-center gap-1 mt-1">
                    <AlertTriangle className="w-3 h-3 shrink-0" />
                    <span>{urlError}</span>
                  </p>
                )}

                {detectedId && (
                  <div className="mt-2 p-2.5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] flex items-center gap-3">
                    <div className="w-24 aspect-video rounded-lg overflow-hidden bg-black shrink-0 relative">
                      <img
                        src={getYouTubeThumbnailUrl(detectedId)}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <Play className="w-3.5 h-3.5 fill-white text-white" />
                      </div>
                    </div>
                    <div className="text-[11px] text-[var(--text-muted)]">
                      <span className="font-extrabold text-blue-500 block">Thumbnail Preview</span>
                      <span>16:9 aspect ratio thumbnail</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Field 2: Video Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase text-[var(--text-primary)] tracking-wide">
                  2. Video Title *
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Video Title"
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs font-bold text-[var(--text-primary)] focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Field 3: One-Line Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase text-[var(--text-primary)] tracking-wide">
                  3. One-Line Description *
                </label>
                <input
                  type="text"
                  required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="One-line description"
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs font-bold text-[var(--text-primary)] focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border-color)]">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="btn-secondary text-xs py-2.5 px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !detectedId}
                  className="btn-primary text-xs py-2.5 px-6 flex items-center gap-2 shadow-lg disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>UPDATING...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>UPDATE VIDEO</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: DELETE CONFIRMATION */}
      {showDeleteModal && selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[var(--bg-secondary)] border border-red-500/30 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-500/15 text-red-500 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-lg font-black font-heading text-[var(--text-primary)]">
                Delete Video?
              </h3>
              <p className="text-xs text-[var(--text-muted)] font-medium">
                Are you sure you want to delete{' '}
                <span className="font-extrabold text-[var(--text-primary)]">
                  "{selectedVideo.title}"
                </span>
                ? This will permanently remove it from the public Marathon website.
              </p>
            </div>

            {/* Thumbnail Preview of Item Being Deleted */}
            <div className="aspect-video w-full rounded-xl overflow-hidden bg-black border border-[var(--border-color)]">
              <img
                src={selectedVideo.thumbnailUrl || getYouTubeThumbnailUrl(selectedVideo.youtubeId)}
                alt={selectedVideo.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex items-center justify-center gap-3 pt-3">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="btn-secondary text-xs py-2.5 px-5"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={submitting}
                className="btn-primary text-xs py-2.5 px-6 bg-red-600 hover:bg-red-700 text-white border-red-600 shadow-lg disabled:opacity-50"
              >
                {submitting ? 'DELETING...' : 'YES, DELETE VIDEO'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminVideosPage;
