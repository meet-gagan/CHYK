import React, { useState, useEffect } from 'react';
import { galleryService } from '../../services/api';
import {
  Folder,
  FolderPlus,
  Image as ImageIcon,
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
  Eye,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  Layers,
  FileText,
  Upload,
  Globe,
  Lock,
} from 'lucide-react';

export const GalleryManager = () => {
  // Navigation State: 'FOLDERS' or 'MEDIA'
  const [currentView, setCurrentView] = useState('FOLDERS');
  const [selectedFolder, setSelectedFolder] = useState(null);

  // Data States
  const [folders, setFolders] = useState([]);
  const [folderMedia, setFolderMedia] = useState([]);
  const [stats, setStats] = useState({
    totalFolders: 0,
    totalImages: 0,
    totalVideos: 0,
    publishedFolders: 0,
    draftFolders: 0,
  });
  const [loadingFolders, setLoadingFolders] = useState(true);
  const [loadingMedia, setLoadingMedia] = useState(false);

  // Filters
  const [folderSearch, setFolderSearch] = useState('');
  const [folderStatusFilter, setFolderStatusFilter] = useState('ALL');
  const [mediaSearch, setMediaSearch] = useState('');
  const [mediaTypeFilter, setMediaTypeFilter] = useState('ALL');

  // Status message
  const [notice, setNotice] = useState({ type: null, text: '' });

  // Modals
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);
  const [showEditFolderModal, setShowEditFolderModal] = useState(false);
  const [showDeleteFolderModal, setShowDeleteFolderModal] = useState(false);
  const [editingFolder, setEditingFolder] = useState(null);
  const [deletingFolder, setDeletingFolder] = useState(null);

  const [showUploadImageModal, setShowUploadImageModal] = useState(false);
  const [showUploadVideoModal, setShowUploadVideoModal] = useState(false);
  const [showEditMediaModal, setShowEditMediaModal] = useState(false);
  const [showDeleteMediaModal, setShowDeleteMediaModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const [previewItem, setPreviewItem] = useState(null);
  const [editingMedia, setEditingMedia] = useState(null);
  const [deletingMedia, setDeletingMedia] = useState(null);

  // Forms
  const [folderForm, setFolderForm] = useState({
    name: '',
    slug: '',
    description: '',
    coverImage: '',
    coverFile: null,
    status: 'published',
    displayOrder: 0,
  });

  const [imageUploadForm, setImageUploadForm] = useState({
    files: [],
    title: '',
    description: '',
    category: 'Temple & Sanctum',
    tag: '',
    status: 'published',
  });

  const [videoUploadForm, setVideoUploadForm] = useState({
    file: null,
    url: '',
    title: '',
    description: '',
    thumbnailUrl: '',
    thumbnailFile: null,
    category: 'Festivals & Homams',
    tag: '',
    status: 'published',
  });

  const [mediaEditForm, setMediaEditForm] = useState({
    title: '',
    description: '',
    category: '',
    tag: '',
    status: 'published',
    displayOrder: 0,
  });

  const [submitting, setSubmitting] = useState(false);

  const showNotification = (type, text) => {
    setNotice({ type, text });
    setTimeout(() => {
      setNotice({ type: null, text: '' });
    }, 5000);
  };

  // Helper to generate slug from name
  const autoSlug = (name) => {
    return (name || '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // LOAD DATA

  const loadFolders = async () => {
    setLoadingFolders(true);
    try {
      const res = await galleryService.getAdminFolders();
      if (res.data?.success) {
        setFolders(res.data.data || []);
        if (res.data.stats) {
          setStats(res.data.stats);
        }
      }
    } catch (err) {
      console.error('Failed to load gallery folders:', err);
      showNotification('error', 'Failed to load gallery folders. Please try again.');
    } finally {
      setLoadingFolders(false);
    }
  };

  const loadFolderMedia = async (folderId) => {
    setLoadingMedia(true);
    try {
      const res = await galleryService.getFolderMedia(folderId);
      if (res.data?.success) {
        setFolderMedia(res.data.data || []);
        if (res.data.folder) {
          setSelectedFolder(res.data.folder);
        }
      }
    } catch (err) {
      console.error('Failed to load folder media:', err);
      showNotification('error', 'Failed to load media for this folder.');
    } finally {
      setLoadingMedia(false);
    }
  };

  useEffect(() => {
    loadFolders();
  }, []);

  // FOLDER HANDLERS

  const handleOpenCreateFolder = () => {
    setFolderForm({
      name: '',
      slug: '',
      description: '',
      coverImage: '',
      coverFile: null,
      status: 'published',
      displayOrder: folders.length + 1,
    });
    setShowCreateFolderModal(true);
  };

  const handleOpenEditFolder = (folder) => {
    setEditingFolder(folder);
    setFolderForm({
      name: folder.name || '',
      slug: folder.slug || '',
      description: folder.description || '',
      coverImage: folder.coverImage || folder.cover_image || '',
      coverFile: null,
      status: folder.status || 'published',
      displayOrder: folder.displayOrder || 0,
    });
    setShowEditFolderModal(true);
  };

  const handleCreateFolderSubmit = async (e) => {
    e.preventDefault();
    if (!folderForm.name.trim()) {
      showNotification('error', 'Folder Name is required.');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('name', folderForm.name.trim());
      formData.append('slug', folderForm.slug.trim() || autoSlug(folderForm.name));
      formData.append('description', folderForm.description.trim());
      formData.append('status', folderForm.status);
      formData.append('displayOrder', folderForm.displayOrder);

      if (folderForm.coverFile) {
        formData.append('file', folderForm.coverFile);
      } else if (folderForm.coverImage.trim()) {
        formData.append('coverImage', folderForm.coverImage.trim());
      }

      const res = await galleryService.createFolder(formData);
      if (res.data?.success) {
        showNotification(
          'success',
          res.data.message || `Folder "${folderForm.name}" created successfully.`
        );
        setShowCreateFolderModal(false);
        await loadFolders();
      }
    } catch (err) {
      console.error('Create folder error:', err);
      showNotification(
        'error',
        err.response?.data?.message || 'Failed to create folder. Please check your inputs.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditFolderSubmit = async (e) => {
    e.preventDefault();
    if (!editingFolder) return;

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('name', folderForm.name.trim());
      formData.append('slug', folderForm.slug.trim() || autoSlug(folderForm.name));
      formData.append('description', folderForm.description.trim());
      formData.append('status', folderForm.status);
      formData.append('displayOrder', folderForm.displayOrder);

      if (folderForm.coverFile) {
        formData.append('file', folderForm.coverFile);
      } else if (folderForm.coverImage.trim()) {
        formData.append('coverImage', folderForm.coverImage.trim());
      }

      const res = await galleryService.updateFolder(editingFolder._id, formData);
      if (res.data?.success) {
        showNotification('success', `Folder "${folderForm.name}" updated successfully.`);
        setShowEditFolderModal(false);
        setEditingFolder(null);
        await loadFolders();
        if (selectedFolder && selectedFolder._id === editingFolder._id) {
          setSelectedFolder(res.data.data);
        }
      }
    } catch (err) {
      console.error('Update folder error:', err);
      showNotification(
        'error',
        err.response?.data?.message || 'Failed to update folder.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (folder) => {
    try {
      const res = await galleryService.toggleFolderStatus(folder._id);
      if (res.data?.success) {
        showNotification(
          'success',
          `Folder status changed to ${res.data.data.status.toUpperCase()}`
        );
        await loadFolders();
      }
    } catch (err) {
      console.error('Toggle status error:', err);
      showNotification('error', 'Failed to toggle status.');
    }
  };

  const handleDeleteFolderSubmit = async () => {
    if (!deletingFolder) return;
    setSubmitting(true);
    try {
      const res = await galleryService.deleteFolder(deletingFolder._id);
      if (res.data?.success) {
        showNotification('success', res.data.message || 'Folder deleted.');
        setShowDeleteFolderModal(false);
        setDeletingFolder(null);
        await loadFolders();
        if (selectedFolder && selectedFolder._id === deletingFolder._id) {
          setCurrentView('FOLDERS');
          setSelectedFolder(null);
        }
      }
    } catch (err) {
      console.error('Delete folder error:', err);
      showNotification('error', 'Failed to delete folder.');
    } finally {
      setSubmitting(false);
    }
  };

  // Open Media Manager for a folder
  const handleOpenFolderMedia = (folder) => {
    setSelectedFolder(folder);
    setCurrentView('MEDIA');
    loadFolderMedia(folder._id);
  };

  // MEDIA HANDLERS

  const handleImageUploadSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFolder) return;
    if (imageUploadForm.files.length === 0) {
      showNotification('error', 'Please select at least one image file.');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      for (const file of imageUploadForm.files) {
        formData.append('files', file);
      }
      formData.append('title', imageUploadForm.title.trim());
      formData.append('description', imageUploadForm.description.trim());
      formData.append('category', imageUploadForm.category);
      formData.append('tag', imageUploadForm.tag.trim());
      formData.append('status', imageUploadForm.status);

      const res = await galleryService.uploadFolderMedia(selectedFolder._id, formData);
      if (res.data?.success) {
        showNotification('success', res.data.message || 'Images uploaded successfully.');
        setShowUploadImageModal(false);
        setImageUploadForm({
          files: [],
          title: '',
          description: '',
          category: 'Temple & Sanctum',
          tag: '',
          status: 'published',
        });
        await loadFolderMedia(selectedFolder._id);
        await loadFolders();
      }
    } catch (err) {
      console.error('Upload images error:', err);
      showNotification(
        'error',
        err.response?.data?.message || 'Failed to upload images.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleVideoUploadSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFolder) return;
    if (!videoUploadForm.file && !videoUploadForm.url.trim()) {
      showNotification('error', 'Please select a video file or provide a video URL.');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      if (videoUploadForm.file) {
        formData.append('file', videoUploadForm.file);
      } else {
        formData.append('url', videoUploadForm.url.trim());
      }
      formData.append('title', videoUploadForm.title.trim() || 'Sacred Video');
      formData.append('description', videoUploadForm.description.trim());
      formData.append('category', videoUploadForm.category);
      formData.append('tag', videoUploadForm.tag.trim());
      formData.append('status', videoUploadForm.status);
      formData.append('mediaType', 'video');
      if (videoUploadForm.thumbnailUrl.trim()) {
        formData.append('thumbnailUrl', videoUploadForm.thumbnailUrl.trim());
      }

      const res = await galleryService.uploadFolderMedia(selectedFolder._id, formData);
      if (res.data?.success) {
        showNotification('success', 'Video added to folder successfully.');
        setShowUploadVideoModal(false);
        setVideoUploadForm({
          file: null,
          url: '',
          title: '',
          description: '',
          thumbnailUrl: '',
          thumbnailFile: null,
          category: 'Festivals & Homams',
          tag: '',
          status: 'published',
        });
        await loadFolderMedia(selectedFolder._id);
        await loadFolders();
      }
    } catch (err) {
      console.error('Upload video error:', err);
      showNotification(
        'error',
        err.response?.data?.message || 'Failed to add video.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenEditMedia = (item) => {
    setEditingMedia(item);
    setMediaEditForm({
      title: item.title || '',
      description: item.description || '',
      category: item.category || 'General',
      tag: item.tag || '',
      status: item.status || 'published',
      displayOrder: item.displayOrder || 0,
    });
    setShowEditMediaModal(true);
  };

  const handleEditMediaSubmit = async (e) => {
    e.preventDefault();
    if (!editingMedia) return;

    setSubmitting(true);
    try {
      const res = await galleryService.updateMediaItem(editingMedia._id, mediaEditForm);
      if (res.data?.success) {
        showNotification('success', 'Media item updated successfully.');
        setShowEditMediaModal(false);
        setEditingMedia(null);
        await loadFolderMedia(selectedFolder._id);
      }
    } catch (err) {
      console.error('Update media error:', err);
      showNotification('error', 'Failed to update media item.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteMediaSubmit = async () => {
    if (!deletingMedia) return;
    setSubmitting(true);
    try {
      const res = await galleryService.deleteMediaItem(deletingMedia._id);
      if (res.data?.success) {
        showNotification('success', 'Media item removed successfully.');
        setShowDeleteMediaModal(false);
        setDeletingMedia(null);
        await loadFolderMedia(selectedFolder._id);
        await loadFolders();
      }
    } catch (err) {
      console.error('Delete media error:', err);
      showNotification('error', 'Failed to delete media item.');
    } finally {
      setSubmitting(false);
    }
  };

  // Move item up or down in display order
  const handleMoveMedia = async (index, direction) => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= folderMedia.length) return;

    const newMediaList = [...folderMedia];
    const temp = newMediaList[index];
    newMediaList[index] = newMediaList[targetIndex];
    newMediaList[targetIndex] = temp;

    // Optimistic update
    setFolderMedia(newMediaList);

    const orderedIds = newMediaList.map((m) => m._id);
    try {
      await galleryService.reorderFolderMedia(selectedFolder._id, { orderedIds });
      showNotification('success', 'Media display order updated.');
    } catch (err) {
      console.error('Reorder error:', err);
      showNotification('error', 'Failed to save new order. Reverting...');
      await loadFolderMedia(selectedFolder._id);
    }
  };

  // FILTERING

  const filteredFolders = folders.filter((f) => {
    const matchesSearch =
      !folderSearch.trim() ||
      f.name.toLowerCase().includes(folderSearch.toLowerCase()) ||
      (f.description && f.description.toLowerCase().includes(folderSearch.toLowerCase()));
    const matchesStatus =
      folderStatusFilter === 'ALL' || f.status === folderStatusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const filteredMedia = folderMedia.filter((m) => {
    const matchesSearch =
      !mediaSearch.trim() ||
      (m.title && m.title.toLowerCase().includes(mediaSearch.toLowerCase())) ||
      (m.description && m.description.toLowerCase().includes(mediaSearch.toLowerCase())) ||
      (m.tag && m.tag.toLowerCase().includes(mediaSearch.toLowerCase()));
    const matchesType =
      mediaTypeFilter === 'ALL' || m.mediaType === mediaTypeFilter.toLowerCase();
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-8 animate-in fade-in">
      {notice.text && (
        <div
          className={`p-4 rounded-2xl flex items-center justify-between text-sm font-bold shadow-lg transition-all ${
            notice.type === 'success'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : 'bg-red-500/20 text-red-400 border border-red-500/30'
          }`}
        >
          <div className="flex items-center gap-2">
            {notice.type === 'success' ? (
              <CheckCircle className="w-5 h-5 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 shrink-0" />
            )}
            <span>{notice.text}</span>
          </div>
          <button
            onClick={() => setNotice({ type: null, text: '' })}
            className="p-1 hover:bg-white/10 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {currentView === 'FOLDERS' && (
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-black text-[var(--orange)] uppercase tracking-wider block">
                Visual Heritage CMS
              </span>
              <h2 className="text-2xl font-black text-[var(--text-primary)] font-heading">
                Gallery Management
              </h2>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Create and manage folder collections, upload high-resolution temple imagery, and organize video archives.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={loadFolders}
                className="p-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
                title="Refresh folders"
              >
                <RefreshCw className={`w-4 h-4 ${loadingFolders ? 'animate-spin' : ''}`} />
              </button>

              <button
                onClick={handleOpenCreateFolder}
                className="btn-primary text-xs py-2.5 px-5 bg-[var(--orange)] hover:bg-[var(--orange)]/90 text-white flex items-center gap-2 rounded-xl font-bold shadow-lg"
              >
                <FolderPlus className="w-4 h-4" />
                <span>CREATE FOLDER</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="p-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
              <span className="text-[11px] font-extrabold text-[var(--orange)] block mb-1">
                TOTAL FOLDERS
              </span>
              <h3 className="text-2xl font-black text-[var(--text-primary)] font-heading">
                {stats.totalFolders}
              </h3>
            </div>

            <div className="p-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
              <span className="text-[11px] font-extrabold text-emerald-400 block mb-1">
                PUBLISHED
              </span>
              <h3 className="text-2xl font-black text-[var(--text-primary)] font-heading">
                {stats.publishedFolders}
              </h3>
            </div>

            <div className="p-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
              <span className="text-[11px] font-extrabold text-amber-400 block mb-1">
                DRAFTS
              </span>
              <h3 className="text-2xl font-black text-[var(--text-primary)] font-heading">
                {stats.draftFolders}
              </h3>
            </div>

            <div className="p-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
              <span className="text-[11px] font-extrabold text-[var(--cyan)] block mb-1">
                TOTAL IMAGES
              </span>
              <h3 className="text-2xl font-black text-[var(--text-primary)] font-heading">
                {stats.totalImages}
              </h3>
            </div>

            <div className="p-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
              <span className="text-[11px] font-extrabold text-purple-400 block mb-1">
                TOTAL VIDEOS
              </span>
              <h3 className="text-2xl font-black text-[var(--text-primary)] font-heading">
                {stats.totalVideos}
              </h3>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-grow max-w-md">
              <div className="relative w-full">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  type="text"
                  placeholder="Search folders by name or description..."
                  value={folderSearch}
                  onChange={(e) => setFolderSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--orange)]"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[var(--text-muted)]">Status:</span>
              {['ALL', 'PUBLISHED', 'DRAFT'].map((st) => (
                <button
                  key={st}
                  onClick={() => setFolderStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    folderStatusFilter === st
                      ? 'bg-[var(--cyan)] text-white'
                      : 'text-[var(--text-muted)] hover:bg-[var(--bg-tertiary)]'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {loadingFolders ? (
            <div className="text-center py-16 text-[var(--text-muted)] font-bold">
              Loading gallery collections...
            </div>
          ) : filteredFolders.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
              <Folder className="w-12 h-12 mx-auto text-[var(--text-muted)] mb-3 opacity-50" />
              <h3 className="text-lg font-bold text-[var(--text-primary)]">No folders found</h3>
              <p className="text-xs text-[var(--text-muted)] mt-1 mb-4">
                {folderSearch ? 'Try a different search term.' : 'Click "CREATE FOLDER" to get started.'}
              </p>
              <button
                onClick={handleOpenCreateFolder}
                className="btn-primary text-xs py-2 px-4 rounded-xl font-bold bg-[var(--orange)] text-white"
              >
                Create First Collection
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFolders.map((folder) => {
                const isPublished = folder.status === 'published';
                return (
                  <div
                    key={folder._id}
                    className="rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-color)] overflow-hidden shadow-xl flex flex-col justify-between transition-all hover:border-[var(--orange)]/40"
                  >
                    <div className="relative aspect-[4/3] bg-slate-950 overflow-hidden flex items-center justify-center">
                      {folder.coverImage || folder.cover_image ? (
                        <>
                          <img
                            src={folder.coverImage || folder.cover_image}
                            alt=""
                            aria-hidden="true"
                            className="absolute inset-0 w-full h-full object-cover blur-md opacity-30 scale-110 pointer-events-none"
                          />
                          <img
                            src={folder.coverImage || folder.cover_image}
                            alt={folder.name}
                            className="relative z-10 max-h-full max-w-full object-contain transition-transform duration-500 hover:scale-105"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        </>
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-[var(--text-muted)] bg-[var(--bg-tertiary)]">
                          <ImageIcon className="w-10 h-10 opacity-30 mb-2" />
                          <span className="text-xs font-bold">No Cover Image</span>
                        </div>
                      )}

                      <div className="absolute top-3 left-3">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider backdrop-blur-md shadow-md ${
                            isPublished
                              ? 'bg-emerald-500/90 text-white'
                              : 'bg-amber-500/90 text-white'
                          }`}
                        >
                          {isPublished ? 'PUBLISHED' : 'DRAFT'}
                        </span>
                      </div>

                      <div className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black bg-black/75 text-white backdrop-blur-md">
                        <ImageIcon className="w-3.5 h-3.5 text-[var(--cyan)]" />
                        <span>{folder.imageCount || 0}</span>
                        <span className="opacity-40">|</span>
                        <VideoIcon className="w-3.5 h-3.5 text-purple-400" />
                        <span>{folder.videoCount || 0}</span>
                      </div>
                    </div>

                    <div className="p-5 flex-grow flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-mono text-[var(--text-muted)] block mb-1">
                          /gallery/{folder.slug}
                        </span>
                        <h3 className="text-lg font-black text-[var(--text-primary)] font-heading line-clamp-1 mb-2">
                          {folder.name}
                        </h3>
                        <p className="text-xs text-[var(--text-muted)] line-clamp-2 leading-relaxed mb-4">
                          {folder.description || 'No description provided.'}
                        </p>
                      </div>

                      <div className="text-[11px] text-[var(--text-muted)] border-t border-[var(--border-color)]/60 pt-3 flex items-center justify-between">
                        <span>Updated: {new Date(folder.updatedAt || folder.createdAt).toLocaleDateString()}</span>
                        <span className="font-bold text-[var(--text-primary)]">
                          {(folder.totalMedia || 0)} items
                        </span>
                      </div>
                    </div>

                    <div className="p-3 bg-[var(--bg-tertiary)] border-t border-[var(--border-color)] flex items-center justify-between gap-1.5">
                      <button
                        onClick={() => handleOpenFolderMedia(folder)}
                        className="flex-1 py-2 px-3 rounded-xl bg-[var(--orange)] hover:bg-[var(--orange)]/90 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-md"
                      >
                        <Layers className="w-3.5 h-3.5" />
                        <span>MANAGE MEDIA</span>
                      </button>

                      <a
                        href={`/gallery/${folder.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--bg-primary)] transition-colors"
                        title="View Public Page"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>

                      <button
                        onClick={() => handleToggleStatus(folder)}
                        className={`p-2 rounded-xl border transition-colors ${
                          isPublished
                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
                            : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                        }`}
                        title={isPublished ? 'Unpublish (Make Draft)' : 'Publish Folder'}
                      >
                        {isPublished ? <Lock className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
                      </button>

                      <button
                        onClick={() => handleOpenEditFolder(folder)}
                        className="p-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--bg-primary)] transition-colors"
                        title="Edit Folder Details"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          setDeletingFolder(folder);
                          setShowDeleteFolderModal(true);
                        }}
                        className="p-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors"
                        title="Delete Folder"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {currentView === 'MEDIA' && selectedFolder && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setCurrentView('FOLDERS');
                  loadFolders();
                }}
                className="p-2 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--bg-primary)] transition-colors flex items-center gap-1.5 text-xs font-bold"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>BACK TO FOLDERS</span>
              </button>

              <div>
                <span className="text-[10px] font-black text-[var(--orange)] uppercase tracking-wider block">
                  Folder Media Library
                </span>
                <h2 className="text-xl font-black text-[var(--text-primary)] font-heading line-clamp-1">
                  {selectedFolder.name}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowUploadImageModal(true)}
                className="py-2 px-4 rounded-xl bg-[var(--orange)] hover:bg-[var(--orange)]/90 text-white text-xs font-bold flex items-center gap-2 shadow-lg transition-colors"
              >
                <Upload className="w-4 h-4" />
                <span>+ UPLOAD IMAGES</span>
              </button>

              <button
                onClick={() => setShowUploadVideoModal(true)}
                className="py-2 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-2 shadow-lg transition-colors"
              >
                <VideoIcon className="w-4 h-4" />
                <span>+ UPLOAD VIDEO</span>
              </button>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {selectedFolder.coverImage || selectedFolder.cover_image ? (
                <img
                  src={selectedFolder.coverImage || selectedFolder.cover_image}
                  alt={selectedFolder.name}
                  className="w-16 h-16 rounded-2xl object-cover border border-[var(--border-color)] shrink-0"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] flex flex-col items-center justify-center shrink-0 text-[var(--text-muted)]">
                  <ImageIcon className="w-6 h-6 opacity-40" />
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      selectedFolder.status === 'published'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {selectedFolder.status}
                  </span>
                  <span className="text-xs font-mono text-[var(--text-muted)]">
                    /gallery/{selectedFolder.slug}
                  </span>
                </div>
                <p className="text-xs text-[var(--text-muted)] mt-1 max-w-2xl line-clamp-2">
                  {selectedFolder.description || 'No description provided.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={`/gallery/${selectedFolder.slug}`}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Public View</span>
              </a>
              <button
                onClick={() => loadFolderMedia(selectedFolder._id)}
                className="p-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--bg-primary)]"
                title="Reload media"
              >
                <RefreshCw className={`w-4 h-4 ${loadingMedia ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-grow max-w-md">
              <div className="relative w-full">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  type="text"
                  placeholder="Search media by title or description..."
                  value={mediaSearch}
                  onChange={(e) => setMediaSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--orange)]"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[var(--text-muted)]">Filter:</span>
              {['ALL', 'IMAGE', 'VIDEO'].map((type) => (
                <button
                  key={type}
                  onClick={() => setMediaTypeFilter(type)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    mediaTypeFilter === type
                      ? 'bg-[var(--cyan)] text-white'
                      : 'text-[var(--text-muted)] hover:bg-[var(--bg-tertiary)]'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {loadingMedia ? (
            <div className="text-center py-16 text-[var(--text-muted)] font-bold">
              Loading media items...
            </div>
          ) : filteredMedia.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
              <ImageIcon className="w-12 h-12 mx-auto text-[var(--text-muted)] mb-3 opacity-50" />
              <h3 className="text-lg font-bold text-[var(--text-primary)]">No media in this folder</h3>
              <p className="text-xs text-[var(--text-muted)] mt-1 mb-4">
                Upload photographs or videos to populate this collection.
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setShowUploadImageModal(true)}
                  className="py-2 px-4 rounded-xl bg-[var(--orange)] text-white text-xs font-bold"
                >
                  Upload Images
                </button>
                <button
                  onClick={() => setShowUploadVideoModal(true)}
                  className="py-2 px-4 rounded-xl bg-purple-600 text-white text-xs font-bold"
                >
                  Upload Video
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {filteredMedia.map((item, index) => {
                const isVideo = item.mediaType === 'video';
                return (
                  <div
                    key={item._id}
                    className="rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] overflow-hidden shadow-lg flex flex-col justify-between group hover:border-[var(--orange)]/40 transition-all"
                  >
                    <div className="relative aspect-[4/3] bg-slate-950 overflow-hidden flex items-center justify-center">
                      {isVideo ? (
                        item.thumbnailUrl ? (
                          <>
                            <img
                              src={item.thumbnailUrl}
                              alt=""
                              aria-hidden="true"
                              className="absolute inset-0 w-full h-full object-cover blur-md opacity-30 scale-110 pointer-events-none"
                            />
                            <img
                              src={item.thumbnailUrl}
                              alt={item.title}
                              className="relative z-10 max-h-full max-w-full object-contain"
                            />
                          </>
                        ) : (
                          <video
                            src={item.url}
                            className="w-full h-full object-contain"
                            preload="metadata"
                          />
                        )
                      ) : (
                        <>
                          <img
                            src={item.url}
                            alt=""
                            aria-hidden="true"
                            className="absolute inset-0 w-full h-full object-cover blur-md opacity-30 scale-110 pointer-events-none"
                          />
                          <img
                            src={item.url}
                            alt={item.title}
                            className="relative z-10 max-h-full max-w-full object-contain"
                            loading="lazy"
                            onError={(e) => {
                              e.target.src = '/assets/images/temple-seva-shiva-kalyanam.jpg';
                            }}
                          />
                        </>
                      )}

                      {isVideo && (
                        <div
                          onClick={() => {
                            setPreviewItem(item);
                            setShowPreviewModal(true);
                          }}
                          className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/50 transition-colors cursor-pointer"
                        >
                          <div className="w-12 h-12 rounded-full bg-purple-600/90 text-white flex items-center justify-center shadow-lg">
                            <Play className="w-5 h-5 ml-0.5" />
                          </div>
                        </div>
                      )}

                      <div className="absolute top-2 left-2">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider backdrop-blur-md ${
                            isVideo ? 'bg-purple-600 text-white' : 'bg-blue-600 text-white'
                          }`}
                        >
                          {item.mediaType}
                        </span>
                      </div>

                      <div className="absolute top-2 right-2 flex items-center gap-1">
                        <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-black/70 text-white">
                          #{item.displayOrder || index + 1}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-md text-[9px] font-bold ${
                            item.status === 'published'
                              ? 'bg-emerald-500/80 text-white'
                              : 'bg-amber-500/80 text-white'
                          }`}
                        >
                          {item.status === 'published' ? 'PUB' : 'DRAFT'}
                        </span>
                      </div>
                    </div>

                    <div className="p-3.5 flex-grow flex flex-col justify-between">
                      <div>
                        {item.tag && (
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="text-[10px] font-bold text-[var(--orange)] truncate">
                              {item.tag}
                            </span>
                          </div>
                        )}
                        <h4 className="text-xs font-bold text-[var(--text-primary)] line-clamp-1 mb-1">
                          {item.title || 'Untitled Media'}
                        </h4>
                        <p className="text-[11px] text-[var(--text-muted)] line-clamp-2 leading-relaxed">
                          {item.description || 'No description.'}
                        </p>
                      </div>
                    </div>

                    <div className="p-2 bg-[var(--bg-tertiary)] border-t border-[var(--border-color)] flex items-center justify-between gap-1">
                      <div className="flex items-center gap-0.5">
                        <button
                          onClick={() => handleMoveMedia(index, 'up')}
                          disabled={index === 0}
                          className="p-1.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Move up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleMoveMedia(index, 'down')}
                          disabled={index === folderMedia.length - 1}
                          className="p-1.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Move down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setPreviewItem(item);
                            setShowPreviewModal(true);
                          }}
                          className="p-1.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--bg-primary)]"
                          title="Preview Full Size"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenEditMedia(item)}
                          className="p-1.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--bg-primary)]"
                          title="Edit Details"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setDeletingMedia(item);
                            setShowDeleteMediaModal(true);
                          }}
                          className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20"
                          title="Delete Media"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {showCreateFolderModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-color)] shadow-2xl p-6 overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-[var(--border-color)]">
              <div>
                <span className="text-[10px] font-black text-[var(--orange)] uppercase tracking-wider block">
                  New Collection
                </span>
                <h3 className="text-xl font-black text-[var(--text-primary)] font-heading">
                  Create Gallery Folder
                </h3>
              </div>
              <button
                onClick={() => setShowCreateFolderModal(false)}
                className="p-2 text-[var(--text-muted)] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateFolderSubmit} className="space-y-4 pt-4">
              <div>
                <label className="text-xs font-bold text-[var(--text-primary)] block mb-1">
                  Folder Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maha Shivaratri Celebrations 2026"
                  value={folderForm.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setFolderForm({
                      ...folderForm,
                      name,
                      slug: autoSlug(name),
                    });
                  }}
                  className="w-full p-3 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--orange)]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[var(--text-primary)] block mb-1">
                  Slug (URL Path)
                </label>
                <input
                  type="text"
                  placeholder="e.g. maha-shivaratri-celebrations-2026"
                  value={folderForm.slug}
                  onChange={(e) =>
                    setFolderForm({ ...folderForm, slug: autoSlug(e.target.value) })
                  }
                  className="w-full p-3 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl text-xs font-mono text-[var(--text-primary)] focus:outline-none focus:border-[var(--orange)]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[var(--text-primary)] block mb-1">
                  Cover Image
                </label>
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setFolderForm({
                        ...folderForm,
                        coverFile: e.target.files[0] || null,
                      })
                    }
                    className="w-full p-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl text-xs text-[var(--text-primary)] file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-[var(--cyan)] file:text-white file:font-bold file:text-xs"
                  />
                  <div className="text-[10px] text-[var(--text-muted)] text-center">or paste image URL:</div>
                  <input
                    type="text"
                    placeholder="https://... or /assets/..."
                    value={folderForm.coverImage}
                    onChange={(e) =>
                      setFolderForm({ ...folderForm, coverImage: e.target.value })
                    }
                    className="w-full p-2.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl text-xs text-[var(--text-primary)] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[var(--text-primary)] block mb-1">
                    Publication Status
                  </label>
                  <select
                    value={folderForm.status}
                    onChange={(e) =>
                      setFolderForm({ ...folderForm, status: e.target.value })
                    }
                    className="w-full p-3 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl text-xs text-[var(--text-primary)] focus:outline-none"
                  >
                    <option value="published">Published (Visible Publicly)</option>
                    <option value="draft">Draft (Admin Only)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-[var(--text-primary)] block mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={folderForm.displayOrder}
                    onChange={(e) =>
                      setFolderForm({
                        ...folderForm,
                        displayOrder: Number(e.target.value) || 0,
                      })
                    }
                    className="w-full p-3 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl text-xs text-[var(--text-primary)] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border-color)]">
                <button
                  type="button"
                  onClick={() => setShowCreateFolderModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-[var(--border-color)] text-xs font-bold text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-[var(--orange)] hover:bg-[var(--orange)]/90 text-white text-xs font-bold shadow-lg disabled:opacity-50"
                >
                  {submitting ? 'Creating...' : 'Create Folder'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditFolderModal && editingFolder && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-color)] shadow-2xl p-6 overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-[var(--border-color)]">
              <div>
                <span className="text-[10px] font-black text-[var(--orange)] uppercase tracking-wider block">
                  Modify Collection
                </span>
                <h3 className="text-xl font-black text-[var(--text-primary)] font-heading">
                  Edit Folder Details
                </h3>
              </div>
              <button
                onClick={() => setShowEditFolderModal(false)}
                className="p-2 text-[var(--text-muted)] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditFolderSubmit} className="space-y-4 pt-4">
              <div>
                <label className="text-xs font-bold text-[var(--text-primary)] block mb-1">
                  Folder Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={folderForm.name}
                  onChange={(e) =>
                    setFolderForm({ ...folderForm, name: e.target.value })
                  }
                  className="w-full p-3 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--orange)]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[var(--text-primary)] block mb-1">
                  Slug (URL Path)
                </label>
                <input
                  type="text"
                  value={folderForm.slug}
                  onChange={(e) =>
                    setFolderForm({ ...folderForm, slug: autoSlug(e.target.value) })
                  }
                  className="w-full p-3 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl text-xs font-mono text-[var(--text-primary)] focus:outline-none focus:border-[var(--orange)]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[var(--text-primary)] block mb-1">
                  Update Cover Image
                </label>
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setFolderForm({
                        ...folderForm,
                        coverFile: e.target.files[0] || null,
                      })
                    }
                    className="w-full p-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl text-xs text-[var(--text-primary)] file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-[var(--cyan)] file:text-white file:font-bold file:text-xs"
                  />
                  <input
                    type="text"
                    placeholder="or image URL"
                    value={folderForm.coverImage}
                    onChange={(e) =>
                      setFolderForm({ ...folderForm, coverImage: e.target.value })
                    }
                    className="w-full p-2.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl text-xs text-[var(--text-primary)] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[var(--text-primary)] block mb-1">
                    Publication Status
                  </label>
                  <select
                    value={folderForm.status}
                    onChange={(e) =>
                      setFolderForm({ ...folderForm, status: e.target.value })
                    }
                    className="w-full p-3 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl text-xs text-[var(--text-primary)] focus:outline-none"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-[var(--text-primary)] block mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={folderForm.displayOrder}
                    onChange={(e) =>
                      setFolderForm({
                        ...folderForm,
                        displayOrder: Number(e.target.value) || 0,
                      })
                    }
                    className="w-full p-3 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl text-xs text-[var(--text-primary)] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border-color)]">
                <button
                  type="button"
                  onClick={() => setShowEditFolderModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-[var(--border-color)] text-xs font-bold text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-[var(--orange)] hover:bg-[var(--orange)]/90 text-white text-xs font-bold shadow-lg disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteFolderModal && deletingFolder && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-[var(--bg-secondary)] border border-red-500/30 shadow-2xl p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 mx-auto flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-[var(--text-primary)] font-heading mb-2">
              Delete Folder?
            </h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-6">
              Are you sure you want to delete <strong className="text-white">"{deletingFolder.name}"</strong>? This will permanently delete the collection and all <strong className="text-white">{deletingFolder.totalMedia || 0} media items</strong> inside it. This action cannot be undone.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteFolderModal(false)}
                className="px-5 py-2.5 rounded-xl border border-[var(--border-color)] text-xs font-bold text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteFolderSubmit}
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-lg disabled:opacity-50"
              >
                {submitting ? 'Deleting...' : 'Yes, Delete Folder'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showUploadImageModal && selectedFolder && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-color)] shadow-2xl p-6 overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-[var(--border-color)]">
              <div>
                <span className="text-[10px] font-black text-[var(--orange)] uppercase tracking-wider block">
                  Media Upload
                </span>
                <h3 className="text-xl font-black text-[var(--text-primary)] font-heading">
                  Upload Images to Folder
                </h3>
              </div>
              <button
                onClick={() => setShowUploadImageModal(false)}
                className="p-2 text-[var(--text-muted)] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleImageUploadSubmit} className="space-y-4 pt-4">
              <div>
                <label className="text-xs font-bold text-[var(--text-primary)] block mb-1">
                  Select Image File(s) <span className="text-red-400">*</span>
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  required
                  onChange={(e) =>
                    setImageUploadForm({
                      ...imageUploadForm,
                      files: Array.from(e.target.files || []),
                    })
                  }
                  className="w-full p-3 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl text-xs text-[var(--text-primary)] file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-[var(--orange)] file:text-white file:font-bold file:text-xs"
                />
                <span className="text-[10px] text-[var(--text-muted)] block mt-1">
                  Supported: JPG, JPEG, PNG, WEBP (Max 20MB per image). You can select multiple images at once.
                </span>
              </div>

              <div>
                <label className="text-xs font-bold text-[var(--text-primary)] block mb-1">
                  Title (Optional if multiple files)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sanctum Darshan of Lord Shiva"
                  value={imageUploadForm.title}
                  onChange={(e) =>
                    setImageUploadForm({ ...imageUploadForm, title: e.target.value })
                  }
                  className="w-full p-3 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--orange)]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[var(--text-primary)] block mb-1">
                  Tag / Label (e.g. Pancha Linga)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sanctum Photograph"
                  value={imageUploadForm.tag}
                  onChange={(e) =>
                    setImageUploadForm({ ...imageUploadForm, tag: e.target.value })
                  }
                  className="w-full p-3 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl text-xs text-[var(--text-primary)] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[var(--text-primary)] block mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Sacred description or context for the image..."
                  value={imageUploadForm.description}
                  onChange={(e) =>
                    setImageUploadForm({
                      ...imageUploadForm,
                      description: e.target.value,
                    })
                  }
                  className="w-full p-3 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl text-xs text-[var(--text-primary)] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[var(--text-primary)] block mb-1">
                  Publication Status
                </label>
                <select
                  value={imageUploadForm.status}
                  onChange={(e) =>
                    setImageUploadForm({
                      ...imageUploadForm,
                      status: e.target.value,
                    })
                  }
                  className="w-full p-3 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl text-xs text-[var(--text-primary)] focus:outline-none"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border-color)]">
                <button
                  type="button"
                  onClick={() => setShowUploadImageModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-[var(--border-color)] text-xs font-bold text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-[var(--orange)] hover:bg-[var(--orange)]/90 text-white text-xs font-bold shadow-lg disabled:opacity-50"
                >
                  {submitting ? 'Uploading...' : 'Upload Images'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showUploadVideoModal && selectedFolder && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-color)] shadow-2xl p-6 overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-[var(--border-color)]">
              <div>
                <span className="text-[10px] font-black text-purple-400 uppercase tracking-wider block">
                  Media Archive
                </span>
                <h3 className="text-xl font-black text-[var(--text-primary)] font-heading">
                  Add Video to Folder
                </h3>
              </div>
              <button
                onClick={() => setShowUploadVideoModal(false)}
                className="p-2 text-[var(--text-muted)] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleVideoUploadSubmit} className="space-y-4 pt-4">
              <div>
                <label className="text-xs font-bold text-[var(--text-primary)] block mb-1">
                  Upload Video File (MP4, WebM)
                </label>
                <input
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime"
                  onChange={(e) =>
                    setVideoUploadForm({
                      ...videoUploadForm,
                      file: e.target.files[0] || null,
                    })
                  }
                  className="w-full p-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl text-xs text-[var(--text-primary)] file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-purple-600 file:text-white file:font-bold file:text-xs"
                />
              </div>

              <div>
                <div className="text-[11px] font-bold text-[var(--text-muted)] mb-1">
                  OR Provide Video URL / Embed link:
                </div>
                <input
                  type="text"
                  placeholder="https://...mp4 or YouTube URL"
                  value={videoUploadForm.url}
                  onChange={(e) =>
                    setVideoUploadForm({ ...videoUploadForm, url: e.target.value })
                  }
                  className="w-full p-3 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl text-xs text-[var(--text-primary)] focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[var(--text-primary)] block mb-1">
                  Video Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maha Kumbhabhishekam Sacred Darshan Highlights"
                  value={videoUploadForm.title}
                  onChange={(e) =>
                    setVideoUploadForm({ ...videoUploadForm, title: e.target.value })
                  }
                  className="w-full p-3 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl text-xs text-[var(--text-primary)] focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[var(--text-primary)] block mb-1">
                  Video Thumbnail URL (Optional)
                </label>
                <input
                  type="text"
                  placeholder="https://... image poster URL"
                  value={videoUploadForm.thumbnailUrl}
                  onChange={(e) =>
                    setVideoUploadForm({
                      ...videoUploadForm,
                      thumbnailUrl: e.target.value,
                    })
                  }
                  className="w-full p-3 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl text-xs text-[var(--text-primary)] focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[var(--text-primary)] block mb-1">
                  Publication Status
                </label>
                <select
                  value={videoUploadForm.status}
                  onChange={(e) =>
                    setVideoUploadForm({
                      ...videoUploadForm,
                      status: e.target.value,
                    })
                  }
                  className="w-full p-3 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl text-xs text-[var(--text-primary)] focus:outline-none"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[var(--text-primary)] block mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Brief summary of the video..."
                  value={videoUploadForm.description}
                  onChange={(e) =>
                    setVideoUploadForm({
                      ...videoUploadForm,
                      description: e.target.value,
                    })
                  }
                  className="w-full p-3 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl text-xs text-[var(--text-primary)] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border-color)]">
                <button
                  type="button"
                  onClick={() => setShowUploadVideoModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-[var(--border-color)] text-xs font-bold text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-lg disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Add Video'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditMediaModal && editingMedia && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-color)] shadow-2xl p-6 overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-[var(--border-color)]">
              <div>
                <span className="text-[10px] font-black text-[var(--orange)] uppercase tracking-wider block">
                  Modify Media
                </span>
                <h3 className="text-xl font-black text-[var(--text-primary)] font-heading">
                  Edit Media Details
                </h3>
              </div>
              <button
                onClick={() => setShowEditMediaModal(false)}
                className="p-2 text-[var(--text-muted)] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditMediaSubmit} className="space-y-4 pt-4">
              <div>
                <label className="text-xs font-bold text-[var(--text-primary)] block mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={mediaEditForm.title}
                  onChange={(e) =>
                    setMediaEditForm({ ...mediaEditForm, title: e.target.value })
                  }
                  className="w-full p-3 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl text-xs text-[var(--text-primary)] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[var(--text-primary)] block mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={mediaEditForm.description}
                  onChange={(e) =>
                    setMediaEditForm({
                      ...mediaEditForm,
                      description: e.target.value,
                    })
                  }
                  className="w-full p-3 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl text-xs text-[var(--text-primary)] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[var(--text-primary)] block mb-1">
                    Tag / Label
                  </label>
                  <input
                    type="text"
                    value={mediaEditForm.tag}
                    onChange={(e) =>
                      setMediaEditForm({ ...mediaEditForm, tag: e.target.value })
                    }
                    className="w-full p-3 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl text-xs text-[var(--text-primary)] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[var(--text-primary)] block mb-1">
                    Status
                  </label>
                  <select
                    value={mediaEditForm.status}
                    onChange={(e) =>
                      setMediaEditForm({
                        ...mediaEditForm,
                        status: e.target.value,
                      })
                    }
                    className="w-full p-3 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl text-xs text-[var(--text-primary)] focus:outline-none"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[var(--text-primary)] block mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  value={mediaEditForm.displayOrder}
                  onChange={(e) =>
                    setMediaEditForm({
                      ...mediaEditForm,
                      displayOrder: Number(e.target.value) || 0,
                    })
                  }
                  className="w-full p-3 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl text-xs text-[var(--text-primary)] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border-color)]">
                <button
                  type="button"
                  onClick={() => setShowEditMediaModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-[var(--border-color)] text-xs font-bold text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-[var(--orange)] hover:bg-[var(--orange)]/90 text-white text-xs font-bold shadow-lg disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Save Details'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteMediaModal && deletingMedia && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-[var(--bg-secondary)] border border-red-500/30 shadow-2xl p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 mx-auto flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-[var(--text-primary)] font-heading mb-2">
              Remove Media Item?
            </h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-6">
              Are you sure you want to delete <strong className="text-white">"{deletingMedia.title || 'this item'}"</strong> from folder "{selectedFolder.name}"?
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteMediaModal(false)}
                className="px-5 py-2.5 rounded-xl border border-[var(--border-color)] text-xs font-bold text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteMediaSubmit}
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-lg disabled:opacity-50"
              >
                {submitting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showPreviewModal && previewItem && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in"
          onClick={() => setShowPreviewModal(false)}
        >
          <div
            className="w-full max-w-4xl max-h-[90vh] rounded-3xl bg-[#0B132B] border border-white/10 shadow-2xl p-4 overflow-hidden flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
              <div>
                <span className="text-[10px] font-bold text-[var(--orange)] uppercase">
                  {previewItem.tag ? `${previewItem.mediaType} · ${previewItem.tag}` : previewItem.mediaType}
                </span>
                <h3 className="text-base font-black text-white line-clamp-1">
                  {previewItem.title}
                </h3>
              </div>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="p-2 text-white/60 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-grow flex items-center justify-center max-h-[65vh] overflow-hidden bg-black/50 rounded-2xl">
              {previewItem.mediaType === 'video' ? (
                previewItem.url.includes('youtube.com') || previewItem.url.includes('youtu.be') ? (
                  <iframe
                    src={previewItem.url.replace('watch?v=', 'embed/')}
                    title={previewItem.title}
                    className="w-full h-[55vh] rounded-2xl"
                    allowFullScreen
                  />
                ) : (
                  <video
                    src={previewItem.url}
                    controls
                    autoPlay
                    className="max-h-[60vh] max-w-full rounded-2xl"
                  />
                )
              ) : (
                <img
                  src={previewItem.url}
                  alt={previewItem.title}
                  className="max-h-[60vh] max-w-full object-contain rounded-2xl"
                />
              )}
            </div>

            {previewItem.description && (
              <p className="text-xs text-white/70 mt-3 pt-3 border-t border-white/10 leading-relaxed">
                {previewItem.description}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryManager;
