import express from 'express';
import {
  getAdminStats,
  bulkUpdateReports,
  getAllUsers,
  updateUserRole,
  getSystemOverview,
  updateReportNotes,
  getAllReportsAdmin
} from '../controllers/admin.controller.js';
import { protect } from '../middleware/auth.js';
import requireAdmin from '../middleware/adminAuth.js';

const router = express.Router();

// Apply authentication and admin middleware to all routes
router.use(protect);
router.use(requireAdmin);

// Admin statistics
router.get('/stats', getAdminStats);

// System overview
router.get('/system', getSystemOverview);

// User management
router.get('/users', getAllUsers);
router.patch('/users/:userId/role', updateUserRole);

// Report management
router.get('/reports', getAllReportsAdmin);
router.patch('/reports/bulk', bulkUpdateReports);
router.patch('/reports/:id/notes', updateReportNotes);

export default router;
