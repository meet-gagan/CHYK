import express from 'express';
import {
  submitSevaBooking,
  getSevaBookingByRefId,
  getMySevaBookings,
  getSevaBookingsAdmin,
  updateSevaBookingStatus,
  deleteSevaBooking,
  bulkDeleteSevaBookings,
} from '../controllers/sevaBookingController.js';
import { protect, optionalAuth } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';
import { formSubmissionLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Public / Semi-authenticated Submission
router.post('/', formSubmissionLimiter, optionalAuth, submitSevaBooking);

// Public Receipt Verification
router.get('/verify/:refId', getSevaBookingByRefId);

// Devotee's own bookings
router.get('/my-bookings', protect, getMySevaBookings);

// Admin Management
router.get('/admin/all', protect, requireAdmin, getSevaBookingsAdmin);
router.post('/admin/bulk-delete', protect, requireAdmin, bulkDeleteSevaBookings);
router.patch('/admin/:id/status', protect, requireAdmin, updateSevaBookingStatus);
router.delete('/admin/:id', protect, requireAdmin, deleteSevaBooking);

export default router;
