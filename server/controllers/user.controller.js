import User from '../models/User.model.js';
import Report from '../models/Report.model.js';

/**
 * @desc    Get user profile
 * @route   GET /api/users/:id
 * @access  Public
 */
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get actual report count from Report collection
    const reportsCount = await Report.countDocuments({ reportedBy: user._id });

    // Return user with dynamic report count
    const userProfile = {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      ecoPoints: user.ecoPoints,
      role: user.role,
      reportsCount,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    res.json({
      success: true,
      data: { user: userProfile }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user profile
 * @route   PATCH /api/users/:id
 * @access  Private
 */
export const updateUserProfile = async (req, res, next) => {
  try {
    // Only allow user to update their own profile
    if (req.params.id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this profile'
      });
    }

    const { name, avatar } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, avatar },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get leaderboard (top users by eco points)
 * @route   GET /api/users/leaderboard
 * @access  Public
 */
export const getLeaderboard = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    // Exclude admins from leaderboard
    const users = await User.find({ role: { $ne: 'admin' } })
      .select('name email avatar ecoPoints')
      .sort({ ecoPoints: -1 })
      .limit(limit);

    // Get actual report count from Report collection for each user
    const usersWithReportCount = await Promise.all(
      users.map(async (user) => {
        const reportsCount = await Report.countDocuments({ reportedBy: user._id });
        return {
          _id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          ecoPoints: user.ecoPoints,
          reportsCount
        };
      })
    );

    res.json({
      success: true,
      data: { users: usersWithReportCount }
    });
  } catch (error) {
    next(error);
  }
};
