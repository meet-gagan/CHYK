import express from 'express';
import {
  getLegalDoc,
  updateLegalDoc,
  resetLegalDoc,
  getAllLegalDocs,
} from '../controllers/legalController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

// Admin: fetch all 4 documents
router.get('/all', protect, requireAdmin, getAllLegalDocs);

// Public: fetch specific legal doc (chinmaya/terms, chinmaya/privacy, marathon/terms, marathon/privacy)
router.get('/:website/:type', getLegalDoc);

// Admin: update specific legal doc
router.put('/:website/:type', protect, requireAdmin, updateLegalDoc);

// Admin: reset specific legal doc to default
router.post('/:website/:type/reset', protect, requireAdmin, resetLegalDoc);

export default router;
