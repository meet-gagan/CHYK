import express from 'express';
import {
  getPublicFolders,
  getPublicFolder,
  getPublicFolderMedia,
  getAdminFolders,
  getAdminFolderById,
  createFolder,
  updateFolder,
  toggleFolderStatus,
  deleteFolder,
  getAdminFolderMedia,
  uploadFolderMedia,
  updateMediaItem,
  deleteMediaItem,
  reorderFolderMedia,
} from '../controllers/galleryController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';
import { uploadSingleMedia, uploadMultipleMedia } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// ── Public Routes ─────────────────────────────────────────────────────────────
router.get('/folders/public', getPublicFolders);
router.get('/folders/public/:idOrSlug', getPublicFolder);
router.get('/folders/public/:idOrSlug/media', getPublicFolderMedia);

// ── Admin Folder Routes ───────────────────────────────────────────────────────
router.get('/folders', protect, requireAdmin, getAdminFolders);
router.get('/folders/:id', protect, requireAdmin, getAdminFolderById);
router.post('/folders', protect, requireAdmin, uploadSingleMedia, createFolder);
router.put('/folders/:id', protect, requireAdmin, uploadSingleMedia, updateFolder);
router.patch('/folders/:id/publish', protect, requireAdmin, toggleFolderStatus);
router.delete('/folders/:id', protect, requireAdmin, deleteFolder);

// ── Admin Media Routes ────────────────────────────────────────────────────────
router.get('/folders/:folderId/media', protect, requireAdmin, getAdminFolderMedia);
router.post('/folders/:folderId/media', protect, requireAdmin, uploadMultipleMedia, uploadFolderMedia);
router.put('/folders/:folderId/reorder', protect, requireAdmin, reorderFolderMedia);
router.put('/media/:id', protect, requireAdmin, updateMediaItem);
router.delete('/media/:id', protect, requireAdmin, deleteMediaItem);

export default router;
