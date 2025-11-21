import express from 'express';
import {
  createReport,
  getReports,
  getReport,
  updateReportStatus,
  deleteReport,
  getUserReports,
  getDashboardStats
} from '../controllers/report.controller.js';
import { protect } from '../middleware/auth.js';
import requireAdmin from '../middleware/adminAuth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.get('/', getReports);
router.get('/stats/dashboard', getDashboardStats);
router.get('/user/:userId', getUserReports);
router.get('/:id', getReport);

// Protected routes
router.post('/', protect, upload.array('images', 5), createReport);
router.patch('/:id/status', protect, requireAdmin, updateReportStatus);
router.delete('/:id', protect, deleteReport);

export default router;
