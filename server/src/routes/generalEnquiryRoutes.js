import express from 'express';
import {
  submitGeneralEnquiry,
  getGeneralEnquiriesAdmin,
  updateGeneralEnquiryStatus,
  deleteGeneralEnquiry,
} from '../controllers/generalEnquiryController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';
import { formSubmissionLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Public: submit general enquiry
router.post('/', formSubmissionLimiter, submitGeneralEnquiry);

// Admin: list all general enquiries
router.get('/', protect, requireAdmin, getGeneralEnquiriesAdmin);
router.get('/admin/all', protect, requireAdmin, getGeneralEnquiriesAdmin);

// Admin: update status and delete
router.patch('/:id/status', protect, requireAdmin, updateGeneralEnquiryStatus);
router.delete('/:id', protect, requireAdmin, deleteGeneralEnquiry);

export default router;
