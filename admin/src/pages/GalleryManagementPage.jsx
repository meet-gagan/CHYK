import React, { useState, useEffect } from 'react';
import { adminGalleryService } from '../services/adminApi';
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
  Upload,
  Globe,
  Lock,
} from 'lucide-react';

export const GalleryManagementPage = () => {
  const [currentView, setCurrentView] = useState('FOLDERS');
  const [selectedFolder, setSelectedFolder] = useState(null);

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

  const [folderSearch, setFolderSearch] = useState('');
  const [folderStatusFilter, setFolderStatusFilter] = useState('ALL');
  const [mediaSearch, setMediaSearch] = useState('');
  const [mediaTypeFilter, setMediaTypeFilter] = useState('ALL');

  const [notice, setNotice] = useState({ type: null, text: '' });

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

  const autoSlug = (name) => {
    return (name || '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const loadFolders = async () => {
    setLoadingFolders(true);
    try {
      const res = await adminGalleryService.getAdminFolders();
      if (res.data?.success) {
        setFolders(res.data.data || []);
        if (res.data.stats) {
          setStats(res.data.stats);
        }
      }
    } catch (err) {
      console.error('Failed to load gallery folders:', err);
      showNotification('error', 'Failed to load gallery folders.');
    } finally {
      setLoadingFolders(false);
    }
  };

  const loadFolderMedia = async (folderId) => {
    setLoadingMedia(true);
    try {
      const res = await adminGalleryService.getFolderMedia(folderId);
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

      const res = await adminGalleryService.createFolder(formData);
      if (res.data?.success) {
        showNotification('success', `Folder "${folderForm.name}" created successfully.`);
        setShowCreateFolderModal(false);
        await loadFolders();
      }
    } catch (err) {
      console.error('Create folder error:', err);
      showNotification(
        'error',
        err.response?.data?.message || 'Failed to create folder.'
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

      const res = await adminGalleryService.updateFolder(editingFolder._id, formData);
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
      showNotification('error', 'Failed to update folder.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (folder) => {
    try {
      const res = await adminGalleryService.toggleFolderStatus(folder._id);
      if (res.data?.success) {
        showNotification(
          'success',
          `Folder status set to ${res.data.data.status.toUpperCase()}`
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
      const res = await adminGalleryService.deleteFolder(deletingFolder._id);
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

  const handleOpenFolderMedia = (folder) => {
    setSelectedFolder(folder);
    setCurrentView('MEDIA');
    loadFolderMedia(folder._id);
  };

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

      const res = await adminGalleryService.uploadFolderMedia(selectedFolder._id, formData);
      if (res.data?.success) {
        showNotification('success', res.data.message || 'Images uploaded.');
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
      showNotification('error', 'Failed to upload images.');
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

      const res = await adminGalleryService.uploadFolderMedia(selectedFolder._id, formData);
      if (res.data?.success) {
        showNotification('success', 'Video added to folder.');
        setShowUploadVideoModal(false);
        setVideoUploadForm({
          file: null,
          url: '',
          title: '',
          description: '',
          thumbnailUrl: '',
          category: 'Festivals & Homams',
          tag: '',
          status: 'published',
        });
        await loadFolderMedia(selectedFolder._id);
        await loadFolders();
      }
    } catch (err) {
      console.error('Upload video error:', err);
      showNotification('error', 'Failed to add video.');
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
      const res = await adminGalleryService.updateMediaItem(editingMedia._id, mediaEditForm);
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
      const res = await adminGalleryService.deleteMediaItem(deletingMedia._id);
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

  const handleMoveMedia = async (index, direction) => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= folderMedia.length) return;

    const newMediaList = [...folderMedia];
    const temp = newMediaList[index];
    newMediaList[index] = newMediaList[targetIndex];
    newMediaList[targetIndex] = temp;

    setFolderMedia(newMediaList);
    const orderedIds = newMediaList.map((m) => m._id);

    try {
      await adminGalleryService.reorderFolderMedia(selectedFolder._id, { orderedIds });
      showNotification('success', 'Media order updated.');
    } catch (err) {
      console.error('Reorder error:', err);
      showNotification('error', 'Failed to save new order.');
      await loadFolderMedia(selectedFolder._id);
    }
  };

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
    <div className="space-y-8 p-6 animate-in fade-in max-w-7xl mx-auto">
      {notice.text && (
        <div
          className={`p-4 rounded-2xl flex items-center justify-between text-sm font-bold shadow-lg ${
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
              <span className="text-xs font-black text-[#F0441D] uppercase tracking-wider block">
                Visual Heritage CMS
              </span>
              <h2 className="text-2xl font-black text-white font-heading">
                Gallery Management
              </h2>
              <p className="text-xs text-white/60 mt-1">
                Create and manage folder collections, upload photographs, and organize video archives.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={loadFolders}
                className="p-2.5 rounded-xl bg-[#1C2541] border border-white/10 text-white hover:bg-[#243054] transition-colors"
                title="Refresh folders"
              >
                <RefreshCw className={`w-4 h-4 ${loadingFolders ? 'animate-spin' : ''}`} />
              </button>

              <button
                onClick={handleOpenCreateFolder}
                className="text-xs py-2.5 px-5 bg-[#F0441D] hover:bg-[#F0441D]/90 text-white flex items-center gap-2 rounded-xl font-bold shadow-lg transition-colors"
              >
                <FolderPlus className="w-4 h-4" />
                <span>CREATE FOLDER</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="p-5 rounded-2xl bg-[#1C2541] border border-white/10">
              <span className="text-[11px] font-extrabold text-[#F0441D] block mb-1">TOTAL FOLDERS</span>
              <h3 className="text-2xl font-black text-white">{stats.totalFolders}</h3>
            </div>
            <div className="p-5 rounded-2xl bg-[#1C2541] border border-white/10">
              <span className="text-[11px] font-extrabold text-emerald-400 block mb-1">PUBLISHED</span>
              <h3 className="text-2xl font-black text-white">{stats.publishedFolders}</h3>
            </div>
            <div className="p-5 rounded-2xl bg-[#1C2541] border border-white/10">
              <span className="text-[11px] font-extrabold text-amber-400 block mb-1">DRAFTS</span>
              <h3 className="text-2xl font-black text-white">{stats.draftFolders}</h3>
            </div>
            <div className="p-5 rounded-2xl bg-[#1C2541] border border-white/10">
              <span className="text-[11px] font-extrabold text-[#00B4D8] block mb-1">TOTAL IMAGES</span>
              <h3 className="text-2xl font-black text-white">{stats.totalImages}</h3>
            </div>
            <div className="p-5 rounded-2xl bg-[#1C2541] border border-white/10">
              <span className="text-[11px] font-extrabold text-purple-400 block mb-1">TOTAL VIDEOS</span>
              <h3 className="text-2xl font-black text-white">{stats.totalVideos}</h3>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#1C2541] border border-white/10 flex flex-wrap items-center justify-between gap-4">
            <div className="relative w-full max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                placeholder="Search folders..."
                value={folderSearch}
                onChange={(e) => setFolderSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-[#0B132B] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#F0441D]"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white/50">Status:</span>
              {['ALL', 'PUBLISHED', 'DRAFT'].map((st) => (
                <button
                  key={st}
                  onClick={() => setFolderStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    folderStatusFilter === st
                      ? 'bg-[#00B4D8] text-white'
                      : 'text-white/60 hover:bg-[#243054]'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {loadingFolders ? (
            <div className="text-center py-16 text-white/50 font-bold">
              Loading collections...
            </div>
          ) : filteredFolders.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-[#1C2541] border border-white/10">
              <Folder className="w-12 h-12 mx-auto text-white/30 mb-3" />
              <h3 className="text-lg font-bold text-white">No collections found</h3>
              <p className="text-xs text-white/50 mt-1 mb-4">Click "CREATE FOLDER" to get started.</p>
              <button
                onClick={handleOpenCreateFolder}
                className="text-xs py-2 px-4 rounded-xl font-bold bg-[#F0441D] text-white"
              >
                Create Collection
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFolders.map((folder) => {
                const isPublished = folder.status === 'published';
                return (
                  <div
                    key={folder._id}
                    className="rounded-3xl bg-[#1C2541] border border-white/10 overflow-hidden shadow-xl flex flex-col justify-between hover:border-[#F0441D]/40 transition-all"
                  >
                    <div className="relative aspect-video bg-[#0B132B] overflow-hidden">
                      {folder.coverImage || folder.cover_image ? (
                        <img
                          src={folder.coverImage || folder.cover_image}
                          alt={folder.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-white/30">
                          <ImageIcon className="w-10 h-10 mb-2" />
                          <span className="text-xs font-bold">No Cover</span>
                        </div>
                      )}
                      <div className="absolute top-3 left-3">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                            isPublished ? 'bg-emerald-500/90 text-white' : 'bg-amber-500/90 text-white'
                          }`}
                        >
                          {folder.status}
                        </span>
                      </div>
                      <div className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black bg-black/75 text-white">
                        <ImageIcon className="w-3.5 h-3.5 text-[#00B4D8]" />
                        <span>{folder.imageCount || 0}</span>
                        <span className="opacity-40">|</span>
                        <VideoIcon className="w-3.5 h-3.5 text-purple-400" />
                        <span>{folder.videoCount || 0}</span>
                      </div>
                    </div>

                    <div className="p-5 flex-grow flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-mono text-white/40 block mb-1">
                          /gallery/{folder.slug}
                        </span>
                        <h3 className="text-base font-black text-white line-clamp-1 mb-2">
                          {folder.name}
                        </h3>
                        <p className="text-xs text-white/60 line-clamp-2 leading-relaxed mb-4">
                          {folder.description || 'No description.'}
                        </p>
                      </div>
                      <div className="text-[11px] text-white/40 border-t border-white/10 pt-3 flex items-center justify-between">
                        <span>Updated: {new Date(folder.updatedAt || folder.createdAt).toLocaleDateString()}</span>
                        <span className="font-bold text-white">{(folder.totalMedia || 0)} items</span>
                      </div>
                    </div>

                    <div className="p-3 bg-[#0B132B] border-t border-white/10 flex items-center justify-between gap-1.5">
                      <button
                        onClick={() => handleOpenFolderMedia(folder)}
                        className="flex-1 py-2 px-3 rounded-xl bg-[#F0441D] hover:bg-[#F0441D]/90 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Layers className="w-3.5 h-3.5" />
                        <span>MANAGE MEDIA</span>
                      </button>

                      <button
                        onClick={() => handleToggleStatus(folder)}
                        className={`p-2 rounded-xl border transition-colors ${
                          isPublished
                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
                            : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                        }`}
                        title={isPublished ? 'Unpublish' : 'Publish'}
                      >
                        {isPublished ? <Lock className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
                      </button>

                      <button
                        onClick={() => handleOpenEditFolder(folder)}
                        className="p-2 rounded-xl bg-[#1C2541] border border-white/10 text-white hover:bg-[#243054]"
                        title="Edit Folder"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          setDeletingFolder(folder);
                          setShowDeleteFolderModal(true);
                        }}
                        className="p-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20"
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
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#1C2541] border border-white/10">
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setCurrentView('FOLDERS');
                  loadFolders();
                }}
                className="p-2 rounded-xl bg-[#0B132B] border border-white/10 text-white hover:bg-[#243054] transition-colors flex items-center gap-1.5 text-xs font-bold"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>BACK TO FOLDERS</span>
              </button>
              <div>
                <span className="text-[10px] font-black text-[#F0441D] uppercase block">
                  Collection Media
                </span>
                <h2 className="text-xl font-black text-white line-clamp-1">
                  {selectedFolder.name}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowUploadImageModal(true)}
                className="py-2 px-4 rounded-xl bg-[#F0441D] text-white text-xs font-bold flex items-center gap-2 shadow-lg"
              >
                <Upload className="w-4 h-4" />
                <span>+ UPLOAD IMAGES</span>
              </button>
              <button
                onClick={() => setShowUploadVideoModal(true)}
                className="py-2 px-4 rounded-xl bg-purple-600 text-white text-xs font-bold flex items-center gap-2 shadow-lg"
              >
                <VideoIcon className="w-4 h-4" />
                <span>+ UPLOAD VIDEO</span>
              </button>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#1C2541] border border-white/10 flex flex-wrap items-center justify-between gap-4">
            <div className="relative w-full max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                placeholder="Search media..."
                value={mediaSearch}
                onChange={(e) => setMediaSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-[#0B132B] border border-white/10 rounded-xl text-xs text-white focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white/50">Type:</span>
              {['ALL', 'IMAGE', 'VIDEO'].map((type) => (
                <button
                  key={type}
                  onClick={() => setMediaTypeFilter(type)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                    mediaTypeFilter === type ? 'bg-[#00B4D8] text-white' : 'text-white/60 hover:bg-[#243054]'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {loadingMedia ? (
            <div className="text-center py-16 text-white/50 font-bold">Loading media...</div>
          ) : filteredMedia.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-[#1C2541] border border-white/10">
              <ImageIcon className="w-12 h-12 mx-auto text-white/30 mb-3" />
              <h3 className="text-lg font-bold text-white">No media in this folder</h3>
              <p className="text-xs text-white/50 mt-1 mb-4">Upload photographs or videos.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {filteredMedia.map((item, index) => {
                const isVideo = item.mediaType === 'video';
                return (
                  <div
                    key={item._id}
                    className="rounded-2xl bg-[#1C2541] border border-white/10 overflow-hidden shadow-lg flex flex-col justify-between hover:border-[#F0441D]/40 transition-all"
                  >
                    <div className="relative aspect-[4/3] bg-black overflow-hidden">
                      {isVideo ? (
                        item.thumbnailUrl ? (
                          <img src={item.thumbnailUrl} alt={item.title} className="w-full h-full object-cover" />
                        ) : (
                          <video src={item.url} className="w-full h-full object-cover" />
                        )
                      ) : (
                        <img src={item.url} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
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
                          className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase ${
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
                            item.status === 'published' ? 'bg-emerald-500/80 text-white' : 'bg-amber-500/80 text-white'
                          }`}
                        >
                          {item.status === 'published' ? 'PUB' : 'DRAFT'}
                        </span>
                      </div>
                    </div>

                    <div className="p-3.5 flex-grow flex flex-col justify-between">
                      <div>
                        {item.tag && (
                          <span className="text-[10px] font-bold text-[#F0441D] block mb-1">
                            {item.tag}
                          </span>
                        )}
                        <h4 className="text-xs font-bold text-white line-clamp-1 mb-1">
                          {item.title || 'Untitled Media'}
                        </h4>
                        <p className="text-[11px] text-white/50 line-clamp-2">
                          {item.description || 'No description.'}
                        </p>
                      </div>
                    </div>

                    <div className="p-2 bg-[#0B132B] border-t border-white/10 flex items-center justify-between gap-1">
                      <div className="flex items-center gap-0.5">
                        <button
                          onClick={() => handleMoveMedia(index, 'up')}
                          disabled={index === 0}
                          className="p-1.5 rounded-lg bg-[#1C2541] border border-white/10 text-white/60 hover:text-white disabled:opacity-30"
                          title="Move up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleMoveMedia(index, 'down')}
                          disabled={index === folderMedia.length - 1}
                          className="p-1.5 rounded-lg bg-[#1C2541] border border-white/10 text-white/60 hover:text-white disabled:opacity-30"
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
                          className="p-1.5 rounded-lg bg-[#1C2541] border border-white/10 text-white hover:bg-[#243054]"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenEditMedia(item)}
                          className="p-1.5 rounded-lg bg-[#1C2541] border border-white/10 text-white hover:bg-[#243054]"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setDeletingMedia(item);
                            setShowDeleteMediaModal(true);
                          }}
                          className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20"
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
          <div className="w-full max-w-lg rounded-3xl bg-[#1C2541] border border-white/10 shadow-2xl p-6 overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="text-xl font-black text-white">Create Gallery Folder</h3>
              <button onClick={() => setShowCreateFolderModal(false)} className="text-white/60 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateFolderSubmit} className="space-y-4 pt-4">
              <div>
                <label className="text-xs font-bold text-white block mb-1">Folder Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maha Shivaratri 2026"
                  value={folderForm.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setFolderForm({ ...folderForm, name, slug: autoSlug(name) });
                  }}
                  className="w-full p-3 bg-[#0B132B] border border-white/10 rounded-xl text-xs text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-white block mb-1">Slug</label>
                <input
                  type="text"
                  value={folderForm.slug}
                  onChange={(e) => setFolderForm({ ...folderForm, slug: autoSlug(e.target.value) })}
                  className="w-full p-3 bg-[#0B132B] border border-white/10 rounded-xl text-xs font-mono text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-white block mb-1">Cover Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFolderForm({ ...folderForm, coverFile: e.target.files[0] || null })}
                  className="w-full p-2 bg-[#0B132B] border border-white/10 rounded-xl text-xs text-white file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-[#00B4D8] file:text-white file:font-bold file:text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-white block mb-1">Status</label>
                  <select
                    value={folderForm.status}
                    onChange={(e) => setFolderForm({ ...folderForm, status: e.target.value })}
                    className="w-full p-3 bg-[#0B132B] border border-white/10 rounded-xl text-xs text-white focus:outline-none"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-white block mb-1">Display Order</label>
                  <input
                    type="number"
                    value={folderForm.displayOrder}
                    onChange={(e) => setFolderForm({ ...folderForm, displayOrder: Number(e.target.value) || 0 })}
                    className="w-full p-3 bg-[#0B132B] border border-white/10 rounded-xl text-xs text-white focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowCreateFolderModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-white/10 text-xs font-bold text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-[#F0441D] text-white text-xs font-bold shadow-lg disabled:opacity-50"
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
          <div className="w-full max-w-lg rounded-3xl bg-[#1C2541] border border-white/10 shadow-2xl p-6 overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="text-xl font-black text-white">Edit Folder Details</h3>
              <button onClick={() => setShowEditFolderModal(false)} className="text-white/60 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleEditFolderSubmit} className="space-y-4 pt-4">
              <div>
                <label className="text-xs font-bold text-white block mb-1">Folder Name *</label>
                <input
                  type="text"
                  required
                  value={folderForm.name}
                  onChange={(e) => setFolderForm({ ...folderForm, name: e.target.value })}
                  className="w-full p-3 bg-[#0B132B] border border-white/10 rounded-xl text-xs text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-white block mb-1">Slug</label>
                <input
                  type="text"
                  value={folderForm.slug}
                  onChange={(e) => setFolderForm({ ...folderForm, slug: autoSlug(e.target.value) })}
                  className="w-full p-3 bg-[#0B132B] border border-white/10 rounded-xl text-xs font-mono text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-white block mb-1">Cover Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFolderForm({ ...folderForm, coverFile: e.target.files[0] || null })}
                  className="w-full p-2 bg-[#0B132B] border border-white/10 rounded-xl text-xs text-white file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-[#00B4D8] file:text-white file:font-bold file:text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-white block mb-1">Status</label>
                  <select
                    value={folderForm.status}
                    onChange={(e) => setFolderForm({ ...folderForm, status: e.target.value })}
                    className="w-full p-3 bg-[#0B132B] border border-white/10 rounded-xl text-xs text-white focus:outline-none"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-white block mb-1">Display Order</label>
                  <input
                    type="number"
                    value={folderForm.displayOrder}
                    onChange={(e) => setFolderForm({ ...folderForm, displayOrder: Number(e.target.value) || 0 })}
                    className="w-full p-3 bg-[#0B132B] border border-white/10 rounded-xl text-xs text-white focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowEditFolderModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-white/10 text-xs font-bold text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-[#F0441D] text-white text-xs font-bold shadow-lg disabled:opacity-50"
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
          <div className="w-full max-w-md rounded-3xl bg-[#1C2541] border border-red-500/30 shadow-2xl p-6 text-center">
            <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-black text-white mb-2">Delete Collection?</h3>
            <p className="text-xs text-white/60 mb-6">
              Delete "{deletingFolder.name}" and all {deletingFolder.totalMedia || 0} media items?
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setShowDeleteFolderModal(false)}
                className="px-5 py-2.5 rounded-xl border border-white/10 text-xs font-bold text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteFolderSubmit}
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold shadow-lg disabled:opacity-50"
              >
                {submitting ? 'Deleting...' : 'Delete Folder'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showUploadImageModal && selectedFolder && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-[#1C2541] border border-white/10 shadow-2xl p-6 overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="text-xl font-black text-white">Upload Images</h3>
              <button onClick={() => setShowUploadImageModal(false)} className="text-white/60 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleImageUploadSubmit} className="space-y-4 pt-4">
              <div>
                <label className="text-xs font-bold text-white block mb-1">Select Images *</label>
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
                  className="w-full p-3 bg-[#0B132B] border border-white/10 rounded-xl text-xs text-white file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-[#F0441D] file:text-white file:font-bold file:text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-white block mb-1">Title (Optional for bulk)</label>
                <input
                  type="text"
                  value={imageUploadForm.title}
                  onChange={(e) => setImageUploadForm({ ...imageUploadForm, title: e.target.value })}
                  className="w-full p-3 bg-[#0B132B] border border-white/10 rounded-xl text-xs text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-white block mb-1">Tag / Label</label>
                <input
                  type="text"
                  placeholder="Optional tag (e.g. Sanctum, Silver Jubilee)"
                  value={imageUploadForm.tag}
                  onChange={(e) => setImageUploadForm({ ...imageUploadForm, tag: e.target.value })}
                  className="w-full p-3 bg-[#0B132B] border border-white/10 rounded-xl text-xs text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-white block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={imageUploadForm.description}
                  onChange={(e) => setImageUploadForm({ ...imageUploadForm, description: e.target.value })}
                  className="w-full p-3 bg-[#0B132B] border border-white/10 rounded-xl text-xs text-white focus:outline-none"
                />
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowUploadImageModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-white/10 text-xs font-bold text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-[#F0441D] text-white text-xs font-bold shadow-lg disabled:opacity-50"
                >
                  {submitting ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showUploadVideoModal && selectedFolder && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-[#1C2541] border border-white/10 shadow-2xl p-6 overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="text-xl font-black text-white">Add Video</h3>
              <button onClick={() => setShowUploadVideoModal(false)} className="text-white/60 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleVideoUploadSubmit} className="space-y-4 pt-4">
              <div>
                <label className="text-xs font-bold text-white block mb-1">Video File</label>
                <input
                  type="file"
                  accept="video/mp4,video/webm"
                  onChange={(e) => setVideoUploadForm({ ...videoUploadForm, file: e.target.files[0] || null })}
                  className="w-full p-2 bg-[#0B132B] border border-white/10 rounded-xl text-xs text-white file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-purple-600 file:text-white file:font-bold file:text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-white block mb-1">OR Video URL</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={videoUploadForm.url}
                  onChange={(e) => setVideoUploadForm({ ...videoUploadForm, url: e.target.value })}
                  className="w-full p-3 bg-[#0B132B] border border-white/10 rounded-xl text-xs text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-white block mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={videoUploadForm.title}
                  onChange={(e) => setVideoUploadForm({ ...videoUploadForm, title: e.target.value })}
                  className="w-full p-3 bg-[#0B132B] border border-white/10 rounded-xl text-xs text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-white block mb-1">Thumbnail URL</label>
                <input
                  type="text"
                  value={videoUploadForm.thumbnailUrl}
                  onChange={(e) => setVideoUploadForm({ ...videoUploadForm, thumbnailUrl: e.target.value })}
                  className="w-full p-3 bg-[#0B132B] border border-white/10 rounded-xl text-xs text-white focus:outline-none"
                />
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowUploadVideoModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-white/10 text-xs font-bold text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-purple-600 text-white text-xs font-bold shadow-lg disabled:opacity-50"
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
          <div className="w-full max-w-lg rounded-3xl bg-[#1C2541] border border-white/10 shadow-2xl p-6 overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="text-xl font-black text-white">Edit Media Details</h3>
              <button onClick={() => setShowEditMediaModal(false)} className="text-white/60 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleEditMediaSubmit} className="space-y-4 pt-4">
              <div>
                <label className="text-xs font-bold text-white block mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={mediaEditForm.title}
                  onChange={(e) => setMediaEditForm({ ...mediaEditForm, title: e.target.value })}
                  className="w-full p-3 bg-[#0B132B] border border-white/10 rounded-xl text-xs text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-white block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={mediaEditForm.description}
                  onChange={(e) => setMediaEditForm({ ...mediaEditForm, description: e.target.value })}
                  className="w-full p-3 bg-[#0B132B] border border-white/10 rounded-xl text-xs text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-white block mb-1">Status</label>
                <select
                  value={mediaEditForm.status}
                  onChange={(e) => setMediaEditForm({ ...mediaEditForm, status: e.target.value })}
                  className="w-full p-3 bg-[#0B132B] border border-white/10 rounded-xl text-xs text-white focus:outline-none"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowEditMediaModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-white/10 text-xs font-bold text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-[#F0441D] text-white text-xs font-bold shadow-lg disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteMediaModal && deletingMedia && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-[#1C2541] border border-red-500/30 shadow-2xl p-6 text-center">
            <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-black text-white mb-2">Remove Media?</h3>
            <p className="text-xs text-white/60 mb-6">
              Delete "{deletingMedia.title || 'this item'}"?
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setShowDeleteMediaModal(false)}
                className="px-5 py-2.5 rounded-xl border border-white/10 text-xs font-bold text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteMediaSubmit}
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold shadow-lg disabled:opacity-50"
              >
                {submitting ? 'Deleting...' : 'Delete'}
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
              <h3 className="text-base font-black text-white line-clamp-1">{previewItem.title}</h3>
              <button onClick={() => setShowPreviewModal(false)} className="text-white/60 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-grow flex items-center justify-center max-h-[65vh] bg-black/50 rounded-2xl overflow-hidden">
              {previewItem.mediaType === 'video' ? (
                previewItem.url.includes('youtube.com') || previewItem.url.includes('youtu.be') ? (
                  <iframe
                    src={previewItem.url.replace('watch?v=', 'embed/')}
                    title={previewItem.title}
                    className="w-full h-[55vh] rounded-2xl"
                    allowFullScreen
                  />
                ) : (
                  <video src={previewItem.url} controls autoPlay className="max-h-[60vh] max-w-full rounded-2xl" />
                )
              ) : (
                <img src={previewItem.url} alt={previewItem.title} className="max-h-[60vh] max-w-full object-contain rounded-2xl" />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryManagementPage;
