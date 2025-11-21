import express from 'express';
import { getUserProfile, updateUserProfile, getLeaderboard } from '../controllers/user.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/leaderboard', getLeaderboard);
router.get('/:id', getUserProfile);

// Protected routes
router.patch('/:id', protect, updateUserProfile);

export default router;
