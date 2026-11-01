import React, { useState, useEffect } from 'react';
import { mediaService } from '../../services/api';
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  Edit2,
  RefreshCw,
  Search,
  ExternalLink,
  Copy,
  Check,
  Flame,
  AlertTriangle,
  Upload,
  Link as LinkIcon,
  X,
  Eye,
  SlidersHorizontal,
  CheckCircle,
} from 'lucide-react';

const MARATHON_SECTIONS = [
  'ALL',
  'Hero Graphic',
  'Quote Banner',
  'Myths vs Facts',
  'Vertical Poster Carousel',
  'Marathon Graphics',
  'Inspiration',
  'Logos & Branding',
  'General',
];

export const MarathonImagesManager = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedSection, setSelectedSection] = useState('ALL');
  const [statusMessage, setStatusMessage] = useState({ type: null, text: '' });
  const [copiedId, setCopiedId] = useState(null);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  // Selected item for edit/delete
  const [selectedItem, setSelectedItem] = useState(null);

  // Add Form State
  const [addMode, setAddMode] = useState('file'); // 'file' | 'url'
  const [addForm, setAddForm] = useState({
    title: '',
    section: 'Vertical Poster Carousel',
    caption: '',
    altText: 'Anti-Drug Movement Marathon Run 2026 Asset',
    imageUrl: '',
    file: null,
    displayOrder: 1,
  });
  const [uploading, setUploading] = useState(false);

  // Edit Form State
  const [editForm, setEditForm] = useState({
    title: '',
    section: 'Vertical Poster Carousel',
    caption: '',
    altText: '',
    url: '',
    status: 'ACTIVE',
    displayOrder: 1,
    file: null,
  });
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Load Marathon Images
  const loadMarathonImages = async () => {
    setLoading(true);
    try {
      // Query images with category=Marathon or pageName=Marathon
      const res = await mediaService.getMedia({
        category: 'Marathon',
        limit: 100,
        sortBy: 'displayOrder',
        order: 'asc',
      });

      const mediaItems =
        res.data?.data?.items ||
        (Array.isArray(res.data?.data) ? res.data.data : []);

      if (mediaItems.length > 0) {
        setImages(mediaItems);
      } else {
        // Fallback to fetch by pageName
        const fallbackRes = await mediaService.getMedia({
          pageName: 'Marathon',
          limit: 100,
        });
        const fallbackItems =
          fallbackRes.data?.data?.items ||
          (Array.isArray(fallbackRes.data?.data) ? fallbackRes.data.data : []);
        setImages(fallbackItems);
      }
    } catch (err) {
      console.error('Failed to load marathon images:', err);
      showNotice('error', 'Failed to load marathon images. Please check server connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMarathonImages();
  }, []);

  const showNotice = (type, text) => {
    setStatusMessage({ type, text });
    setTimeout(() => {
      setStatusMessage({ type: null, text: '' });
    }, 4500);
  };

  const handleCopyUrl = (url, id) => {
    if (!url) return;
    const fullUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Submit Add Image
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!addForm.title.trim()) {
      showNotice('error', 'Please enter a title for the image');
      return;
    }
    if (addMode === 'file' && !addForm.file) {
      showNotice('error', 'Please select an image file to upload');
      return;
    }
    if (addMode === 'url' && !addForm.imageUrl.trim()) {
      showNotice('error', 'Please enter a valid image URL');
      return;
    }

    setUploading(true);
    try {
      if (addMode === 'file') {
        const formData = new FormData();
        formData.append('image', addForm.file);
        formData.append('title', addForm.title.trim());
        formData.append('category', 'Marathon');
        formData.append('page', 'Marathon');
        formData.append('section', addForm.section);
        formData.append('caption', addForm.caption.trim());
        formData.append('altText', addForm.altText.trim() || addForm.title.trim());
        formData.append('displayOrder', addForm.displayOrder);
        formData.append('tags', `marathon, ${addForm.section.toLowerCase()}`);
        formData.append('status', 'ACTIVE');

        const res = await mediaService.uploadMedia(formData);
        if (res.data?.success) {
          showNotice('success', 'Image uploaded and added to Marathon website successfully!');
          setShowAddModal(false);
          setAddForm({
            title: '',
            section: 'Vertical Poster Carousel',
            caption: '',
            altText: 'Anti-Drug Movement Marathon Run 2026 Asset',
            imageUrl: '',
            file: null,
            displayOrder: 1,
          });
          loadMarathonImages();
        } else {
          showNotice('error', res.data?.message || 'Failed to upload image');
        }
      } else {
        // Direct URL mode
        const res = await mediaService.uploadMedia({
          title: addForm.title.trim(),
          category: 'Marathon',
          page: 'Marathon',
          section: addForm.section,
          caption: addForm.caption.trim(),
          altText: addForm.altText.trim() || addForm.title.trim(),
          imageUrl: addForm.imageUrl.trim(),
          displayOrder: Number(addForm.displayOrder) || 1,
          tags: `marathon, ${addForm.section.toLowerCase()}`,
          status: 'ACTIVE',
        });

        if (res.data?.success) {
          showNotice('success', 'Image URL added to Marathon website assets!');
          setShowAddModal(false);
          setAddForm({
            title: '',
            section: 'Vertical Poster Carousel',
            caption: '',
            altText: 'Anti-Drug Movement Marathon Run 2026 Asset',
            imageUrl: '',
            file: null,
            displayOrder: 1,
          });
          loadMarathonImages();
        } else {
          showNotice('error', res.data?.message || 'Failed to add image');
        }
      }
    } catch (err) {
      console.error('Error adding marathon image:', err);
      showNotice('error', err.response?.data?.message || err.message || 'Error saving marathon image');
    } finally {
      setUploading(false);
    }
  };

  // Open Edit Modal
  const openEditModal = (item) => {
    setSelectedItem(item);
    setEditForm({
      title: item.title || '',
      section: item.section || 'General',
      caption: item.caption || '',
      altText: item.altText || '',
      url: item.url || '',
      status: item.status || 'ACTIVE',
      displayOrder: item.displayOrder ?? 1,
      file: null,
    });
    setShowEditModal(true);
  };

  // Submit Edit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!selectedItem) return;

    setUpdating(true);
    try {
      if (editForm.file) {
        const formData = new FormData();
        formData.append('image', editForm.file);
        formData.append('title', editForm.title);
        formData.append('section', editForm.section);
        formData.append('category', 'Marathon');
        formData.append('page', 'Marathon');
        formData.append('caption', editForm.caption);
        formData.append('altText', editForm.altText);
        formData.append('status', editForm.status);
        formData.append('displayOrder', editForm.displayOrder);

        const res = await mediaService.updateMedia(selectedItem._id, formData);
        if (res.data?.success) {
          showNotice('success', 'Image updated successfully!');
          setShowEditModal(false);
          loadMarathonImages();
        } else {
          showNotice('error', res.data?.message || 'Failed to update image');
        }
      } else {
        const res = await mediaService.updateMedia(selectedItem._id, {
          title: editForm.title,
          section: editForm.section,
          category: 'Marathon',
          page: 'Marathon',
          caption: editForm.caption,
          altText: editForm.altText,
          url: editForm.url,
          status: editForm.status,
          displayOrder: Number(editForm.displayOrder) || 0,
        });

        if (res.data?.success) {
          showNotice('success', 'Image details updated successfully!');
          setShowEditModal(false);
          loadMarathonImages();
        } else {
          showNotice('error', res.data?.message || 'Failed to update image');
        }
      }
    } catch (err) {
      console.error('Error updating image:', err);
      showNotice('error', err.response?.data?.message || 'Failed to update image');
    } finally {
      setUpdating(false);
    }
  };

  // Delete Image
  const handleDeleteConfirm = async () => {
    if (!selectedItem) return;
    setDeleting(true);
    try {
      const res = await mediaService.deleteMedia(selectedItem._id, true);
      if (res.data?.success) {
        showNotice('success', `"${selectedItem.title}" deleted permanently from Marathon website!`);
        setShowDeleteModal(false);
        setSelectedItem(null);
        loadMarathonImages();
      } else {
        showNotice('error', res.data?.message || 'Failed to delete image');
      }
    } catch (err) {
      console.error('Error deleting marathon image:', err);
      showNotice('error', err.response?.data?.message || 'Failed to delete image');
    } finally {
      setDeleting(false);
    }
  };

  // Filter images by search & section
  const filteredImages = images.filter((img) => {
    const matchesSection = selectedSection === 'ALL' || img.section === selectedSection;
    const term = search.toLowerCase().trim();
    const matchesSearch =
      !term ||
      (img.title || '').toLowerCase().includes(term) ||
      (img.section || '').toLowerCase().includes(term) ||
      (img.caption || '').toLowerCase().includes(term) ||
      (img.tags || []).some((t) => t.toLowerCase().includes(term));
    return matchesSection && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {statusMessage.text && (
        <div
          className={`p-4 rounded-2xl flex items-center gap-3 text-xs font-bold shadow-xl border animate-in fade-in slide-in-from-top-2 ${
            statusMessage.type === 'error'
              ? 'bg-red-500/15 border-red-500/30 text-red-500'
              : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-500'
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--orange)]/15 text-[var(--orange)] font-extrabold text-[10px] tracking-widest uppercase border border-[var(--orange)]/30">
              <Flame className="w-3.5 h-3.5" />
              <span>MARATHON PORTAL MEDIA CONTROL</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-heading text-[var(--text-primary)]">
              Marathon Website Images
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] font-semibold max-w-2xl">
              Add, replace, or delete any image featured on the Anti-Drug Movement Marathon portal.
              Updates reflect immediately across hero banners, poster sliders, quotes, and campaigns.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={loadMarathonImages}
              disabled={loading}
              className="btn-secondary text-xs py-3 px-4 flex items-center gap-2"
              title="Refresh list"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">REFRESH</span>
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary text-xs py-3 px-6 flex items-center gap-2 shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span>ADD MARATHON IMAGE</span>
            </button>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-[var(--border-color)]">
          <div>
            <span className="text-[10px] font-extrabold uppercase text-[var(--text-muted)] tracking-wider">
              TOTAL ASSETS
            </span>
            <p className="text-xl sm:text-2xl font-black text-[var(--text-primary)] mt-0.5">
              {images.length}
            </p>
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase text-[var(--text-muted)] tracking-wider">
              ACTIVE ON SITE
            </span>
            <p className="text-xl sm:text-2xl font-black text-emerald-500 mt-0.5">
              {images.filter((i) => i.status === 'ACTIVE').length}
            </p>
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase text-[var(--text-muted)] tracking-wider">
              CAROUSEL POSTERS
            </span>
            <p className="text-xl sm:text-2xl font-black text-[var(--orange)] mt-0.5">
              {images.filter((i) => i.section === 'Vertical Poster Carousel').length}
            </p>
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase text-[var(--text-muted)] tracking-wider">
              LOGOS & BRANDING
            </span>
            <p className="text-xl sm:text-2xl font-black text-cyan-500 mt-0.5">
              {images.filter((i) => i.section === 'Logos & Branding').length}
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] space-y-4 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-grow max-w-md">
            <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by image title, section, or tags..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs font-bold text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--orange)]"
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
            Showing <span className="text-[var(--text-primary)] font-extrabold">{filteredImages.length}</span> of{' '}
            {images.length} images
          </div>
        </div>

        {/* Section Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[var(--border-color)]">
          <span className="text-[10px] font-extrabold uppercase text-[var(--text-muted)] flex items-center gap-1.5 mr-2">
            <SlidersHorizontal className="w-3 h-3" />
            <span>Filter Section:</span>
          </span>
          {MARATHON_SECTIONS.map((sec) => (
            <button
              key={sec}
              onClick={() => setSelectedSection(sec)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-extrabold transition-all ${
                selectedSection === sec
                  ? 'bg-[var(--orange)] text-white shadow-md'
                  : 'bg-[var(--bg-primary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
              }`}
            >
              {sec}
            </button>
          ))}
        </div>
      </div>

      {/* Images Grid */}
      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center space-y-3">
          <div className="w-10 h-10 rounded-full border-4 border-[var(--orange)] border-t-transparent animate-spin" />
          <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
            Loading Marathon Media Assets...
          </p>
        </div>
      ) : filteredImages.length === 0 ? (
        <div className="py-16 text-center space-y-4 rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
          <div className="w-14 h-14 rounded-2xl bg-[var(--orange)]/15 text-[var(--orange)] flex items-center justify-center mx-auto">
            <ImageIcon className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h4 className="text-base font-bold text-[var(--text-primary)]">No images found</h4>
            <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto">
              {search || selectedSection !== 'ALL'
                ? 'No marathon assets match your search/filter criteria. Try clearing filters.'
                : 'No marathon images have been added yet.'}
            </p>
          </div>
          {(search || selectedSection !== 'ALL') && (
            <button
              onClick={() => {
                setSearch('');
                setSelectedSection('ALL');
              }}
              className="btn-secondary text-xs py-2 px-4"
            >
              CLEAR FILTERS
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredImages.map((img) => {
            const isCopied = copiedId === img._id;
            return (
              <div
                key={img._id}
                className="rounded-3xl overflow-hidden bg-[var(--bg-secondary)] border border-[var(--border-color)] shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group"
              >
                {/* Visual Thumbnail Container */}
                <div className="relative aspect-video sm:aspect-square bg-slate-900/60 overflow-hidden flex items-center justify-center">
                  <img
                    src={img.url}
                    alt={img.altText || img.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />

                  {/* Section Badge */}
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md text-white text-[10px] font-extrabold uppercase border border-white/20">
                    {img.section || 'General'}
                  </span>

                  {/* Status Indicator */}
                  <span
                    className={`absolute top-3 right-3 px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                      img.status === 'ACTIVE'
                        ? 'bg-emerald-500/90 text-white'
                        : 'bg-red-500/90 text-white'
                    }`}
                  >
                    {img.status || 'ACTIVE'}
                  </span>

                  {/* Hover Quick Actions Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button
                      onClick={() => setPreviewImage(img)}
                      className="w-10 h-10 rounded-full bg-white/20 text-white hover:bg-white hover:text-black flex items-center justify-center backdrop-blur-md transition-all shadow-lg"
                      title="Preview Full Size"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openEditModal(img)}
                      className="w-10 h-10 rounded-full bg-white/20 text-white hover:bg-[var(--cyan)] hover:text-white flex items-center justify-center backdrop-blur-md transition-all shadow-lg"
                      title="Edit Details"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedItem(img);
                        setShowDeleteModal(true);
                      }}
                      className="w-10 h-10 rounded-full bg-red-500/80 text-white hover:bg-red-600 flex items-center justify-center backdrop-blur-md transition-all shadow-lg"
                      title="Delete Image"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Card Content Info */}
                <div className="p-4 space-y-3 flex-grow flex flex-col justify-between">
                  <div className="space-y-1">
                    <h4 className="text-sm font-extrabold text-[var(--text-primary)] line-clamp-1">
                      {img.title}
                    </h4>
                    {img.caption && (
                      <p className="text-[11px] text-[var(--text-muted)] line-clamp-2">
                        {img.caption}
                      </p>
                    )}
                  </div>

                  {/* URL Snippet with Copy Button */}
                  <div className="pt-2 border-t border-[var(--border-color)] space-y-2">
                    <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)]">
                      <span className="font-mono truncate max-w-[160px] sm:max-w-[180px]">
                        {img.url}
                      </span>
                      <button
                        onClick={() => handleCopyUrl(img.url, img._id)}
                        className={`inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded transition-all ${
                          isCopied
                            ? 'bg-emerald-500 text-white'
                            : 'hover:bg-[var(--bg-tertiary)] text-[var(--text-primary)]'
                        }`}
                        title="Copy image URL"
                      >
                        {isCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        <span>{isCopied ? 'COPIED' : 'COPY'}</span>
                      </button>
                    </div>

                    {/* Bottom Action Buttons */}
                    <div className="flex items-center justify-between pt-1">
                      <button
                        onClick={() => openEditModal(img)}
                        className="text-[11px] font-extrabold text-[var(--cyan)] hover:underline flex items-center gap-1"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => {
                          setSelectedItem(img);
                          setShowDeleteModal(true);
                        }}
                        className="text-[11px] font-extrabold text-red-500 hover:underline flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: ADD MARATHON IMAGE                                               */}
      {/* ========================================================================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-[var(--border-color)]">
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-[var(--orange)] tracking-widest">
                  MARATHON MEDIA UPLOAD
                </span>
                <h3 className="text-xl font-black font-heading text-[var(--text-primary)]">
                  Add Marathon Image
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full bg-[var(--bg-primary)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Mode Toggle: Upload File vs Direct URL */}
            <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)]">
              <button
                type="button"
                onClick={() => setAddMode('file')}
                className={`py-2 px-3 rounded-lg text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
                  addMode === 'file'
                    ? 'bg-[var(--orange)] text-white shadow'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload File</span>
              </button>
              <button
                type="button"
                onClick={() => setAddMode('url')}
                className={`py-2 px-3 rounded-lg text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
                  addMode === 'url'
                    ? 'bg-[var(--orange)] text-white shadow'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                <LinkIcon className="w-3.5 h-3.5" />
                <span>Image URL</span>
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-[var(--text-primary)] mb-1">
                  Image Title *
                </label>
                <input
                  type="text"
                  required
                  value={addForm.title}
                  onChange={(e) => setAddForm({ ...addForm, title: e.target.value })}
                  placeholder="e.g. Marathon Runners Hero Graphic"
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs font-bold text-[var(--text-primary)]"
                />
              </div>

              {/* Section Dropdown */}
              <div>
                <label className="block text-xs font-bold text-[var(--text-primary)] mb-1">
                  Marathon Website Section *
                </label>
                <select
                  value={addForm.section}
                  onChange={(e) => setAddForm({ ...addForm, section: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs font-bold text-[var(--text-primary)]"
                >
                  <option value="Hero Graphic">Hero Graphic (Home Page Top)</option>
                  <option value="Quote Banner">Quote Banner (Swami Quote Background)</option>
                  <option value="Myths vs Facts">Myths vs Facts (Campaign Cover)</option>
                  <option value="Vertical Poster Carousel">Vertical Poster Carousel (Posters Slider)</option>
                  <option value="Marathon Graphics">Marathon Graphics (Runners / Badges)</option>
                  <option value="Inspiration">Inspiration (Swami Chinmayananda)</option>
                  <option value="Logos & Branding">Logos & Branding (CHYK, Lamp, Emblems)</option>
                  <option value="General">General Marathon Asset</option>
                </select>
              </div>

              {/* Source: File or URL */}
              {addMode === 'file' ? (
                <div>
                  <label className="block text-xs font-bold text-[var(--text-primary)] mb-1">
                    Select Image File * (PNG, JPG, WebP)
                  </label>
                  <input
                    type="file"
                    required
                    accept="image/*"
                    onChange={(e) => setAddForm({ ...addForm, file: e.target.files[0] })}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs font-semibold text-[var(--text-primary)]"
                  />
                  {addForm.file && (
                    <p className="text-[10px] text-emerald-500 font-bold mt-1">
                      Selected: {addForm.file.name} ({(addForm.file.size / 1024).toFixed(1)} KB)
                    </p>
                  )}
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-[var(--text-primary)] mb-1">
                    Direct Image URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={addForm.imageUrl}
                    onChange={(e) => setAddForm({ ...addForm, imageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/... or /assets/images/..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs font-bold text-[var(--text-primary)] font-mono"
                  />
                </div>
              )}

              {/* Caption */}
              <div>
                <label className="block text-xs font-bold text-[var(--text-primary)] mb-1">
                  Caption / Description (Optional)
                </label>
                <input
                  type="text"
                  value={addForm.caption}
                  onChange={(e) => setAddForm({ ...addForm, caption: e.target.value })}
                  placeholder="e.g. Say No to Drugs • Choose Life"
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs font-semibold text-[var(--text-primary)]"
                />
              </div>

              {/* Display Order */}
              <div>
                <label className="block text-xs font-bold text-[var(--text-primary)] mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  min="0"
                  value={addForm.displayOrder}
                  onChange={(e) => setAddForm({ ...addForm, displayOrder: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs font-bold text-[var(--text-primary)]"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border-color)]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-secondary text-xs py-2.5 px-5"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="btn-primary text-xs py-2.5 px-6 flex items-center gap-2"
                >
                  {uploading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>SAVING TO CLOUD...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>ADD IMAGE NOW</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: EDIT MARATHON IMAGE                                              */}
      {/* ========================================================================= */}
      {showEditModal && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-[var(--border-color)]">
              <div>
                <span className="text-[10px] font-extrabold uppercase text-[var(--cyan)] tracking-widest">
                  EDIT ASSET
                </span>
                <h3 className="text-xl font-black font-heading text-[var(--text-primary)]">
                  Edit Marathon Image
                </h3>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="w-8 h-8 rounded-full bg-[var(--bg-primary)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[var(--text-primary)] mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs font-bold text-[var(--text-primary)]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--text-primary)] mb-1">
                  Section
                </label>
                <select
                  value={editForm.section}
                  onChange={(e) => setEditForm({ ...editForm, section: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs font-bold text-[var(--text-primary)]"
                >
                  <option value="Hero Graphic">Hero Graphic</option>
                  <option value="Quote Banner">Quote Banner</option>
                  <option value="Myths vs Facts">Myths vs Facts</option>
                  <option value="Vertical Poster Carousel">Vertical Poster Carousel</option>
                  <option value="Marathon Graphics">Marathon Graphics</option>
                  <option value="Inspiration">Inspiration</option>
                  <option value="Logos & Branding">Logos & Branding</option>
                  <option value="General">General</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--text-primary)] mb-1">
                  Image URL
                </label>
                <input
                  type="text"
                  value={editForm.url}
                  onChange={(e) => setEditForm({ ...editForm, url: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs font-bold text-[var(--text-primary)] font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--text-primary)] mb-1">
                  Or Upload New Replacement File (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setEditForm({ ...editForm, file: e.target.files[0] })}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs font-semibold text-[var(--text-primary)]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--text-primary)] mb-1">
                  Caption
                </label>
                <input
                  type="text"
                  value={editForm.caption}
                  onChange={(e) => setEditForm({ ...editForm, caption: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs font-semibold text-[var(--text-primary)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[var(--text-primary)] mb-1">
                    Status
                  </label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs font-bold text-[var(--text-primary)]"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[var(--text-primary)] mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={editForm.displayOrder}
                    onChange={(e) => setEditForm({ ...editForm, displayOrder: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs font-bold text-[var(--text-primary)]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border-color)]">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="btn-secondary text-xs py-2.5 px-5"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="btn-primary text-xs py-2.5 px-6 flex items-center gap-2"
                >
                  {updating ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>SAVING...</span>
                    </>
                  ) : (
                    <span>SAVE CHANGES</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: DELETE CONFIRMATION                                              */}
      {/* ========================================================================= */}
      {showDeleteModal && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[var(--bg-secondary)] border border-red-500/40 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl relative text-center">
            <div className="w-14 h-14 rounded-2xl bg-red-500/15 text-red-500 flex items-center justify-center mx-auto shadow-inner">
              <Trash2 className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-extrabold uppercase text-red-500 tracking-widest">
                PERMANENT DELETION
              </span>
              <h3 className="text-xl font-black font-heading text-[var(--text-primary)]">
                Delete Marathon Image?
              </h3>
              <p className="text-xs text-[var(--text-muted)] font-semibold leading-relaxed">
                Are you sure you want to delete <span className="text-[var(--text-primary)] font-bold">"{selectedItem.title}"</span>?
                This image will be removed from the Marathon website and any banner sliders.
              </p>
            </div>

            {/* Thumbnail Preview */}
            <div className="rounded-2xl overflow-hidden border border-[var(--border-color)] max-h-36 mx-auto bg-black flex items-center justify-center">
              <img
                src={selectedItem.url}
                alt={selectedItem.title}
                className="w-full h-full object-cover max-h-36"
              />
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedItem(null);
                }}
                disabled={deleting}
                className="btn-secondary text-xs py-2.5 px-5"
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="py-2.5 px-6 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold flex items-center gap-2 shadow-lg shadow-red-600/30 transition-all"
              >
                {deleting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>DELETING...</span>
                  </>
                ) : (
                  <span>YES, DELETE PERMANENTLY</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: FULL SIZE PREVIEW                                                */}
      {/* ========================================================================= */}
      {previewImage && (
        <div
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-4xl w-full max-h-[90vh] flex flex-col items-center justify-center space-y-4"
          >
            <div className="flex items-center justify-between w-full text-white px-2">
              <div className="space-y-0.5">
                <span className="text-[10px] font-extrabold uppercase text-[var(--orange)] tracking-widest">
                  {previewImage.section}
                </span>
                <h4 className="text-lg font-bold">{previewImage.title}</h4>
              </div>
              <button
                onClick={() => setPreviewImage(null)}
                className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="rounded-3xl overflow-hidden border border-white/20 max-h-[75vh] bg-black shadow-2xl flex items-center justify-center">
              <img
                src={previewImage.url}
                alt={previewImage.title}
                className="max-w-full max-h-[75vh] object-contain"
              />
            </div>

            <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
              <span>{previewImage.url}</span>
              <button
                onClick={() => handleCopyUrl(previewImage.url, 'preview')}
                className="text-white underline hover:text-[var(--orange)]"
              >
                {copiedId === 'preview' ? 'Copied!' : 'Copy Link'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarathonImagesManager;

