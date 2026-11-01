import express from 'express';
import {
  getVideos,
  createVideo,
  updateVideo,
  deleteVideo,
} from '../controllers/videoController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

// Public route to fetch videos for Marathon website
router.get('/', getVideos);

// Protected admin routes for adding, updating, deleting videos
router.post('/', protect, requireAdmin, createVideo);
router.put('/:id', protect, requireAdmin, updateVideo);
router.delete('/:id', protect, requireAdmin, deleteVideo);

export default router;

