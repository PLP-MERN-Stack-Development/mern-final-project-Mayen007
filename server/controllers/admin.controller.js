import User from '../models/User.model.js';
import Report from '../models/Report.model.js';

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getAdminStats = async (req, res) => {
  try {
    // Get date ranges
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      totalReports,
      reportsByStatus,
      reportsBySeverity,
      reportsThisMonth,
      newUsersThisMonth,
      activeUsers
    ] = await Promise.all([
      User.countDocuments(),
      Report.countDocuments(),
      Report.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]),
      Report.aggregate([
        {
          $group: {
            _id: '$severity',
            count: { $sum: 1 }
          }
        }
      ]),
      Report.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      User.countDocuments({ updatedAt: { $gte: sevenDaysAgo } })
    ]);

    // Format report status data
    const statusData = reportsByStatus.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {
      pending: 0,
      verified: 0,
      'in-progress': 0,
      resolved: 0,
      rejected: 0
    });

    // Format severity data
    const severityData = reportsBySeverity.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {
      low: 0,
      medium: 0,
      high: 0,
      critical: 0
    });

    res.json({
      success: true,
      data: {
        totalUsers,
        totalReports,
        reportsByStatus: statusData,
        reportsBySeverity: severityData,
        recentActivity: {
          reportsThisMonth,
          newUsersThisMonth,
          activeUsers
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admin statistics',
      error: error.message
    });
  }
};

// @desc    Get all users with filters
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
  try {
    const { role, search, sort = '-createdAt', limit = 100, page = 1 } = req.query;

    // Build query
    const query = {};
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const users = await User.find(query)
      .select('-password')
      .sort(sort)
      .limit(parseInt(limit))
      .skip(skip)
      .lean(); // Use lean() for better performance

    // Get actual report counts for each user
    const userIds = users.map(u => u._id);
    const reportCounts = await Report.aggregate([
      { $match: { reportedBy: { $in: userIds } } },
      { $group: { _id: '$reportedBy', count: { $sum: 1 } } }
    ]);

    // Create a map of userId -> reportCount
    const countMap = {};
    reportCounts.forEach(rc => {
      countMap[rc._id.toString()] = rc.count;
    });

    // Add actual report counts to users
    const usersWithCounts = users.map(user => ({
      ...user,
      reportsCount: countMap[user._id.toString()] || 0
    }));

    res.json({
      success: true,
      data: usersWithCounts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message
    });
  }
};

// @desc    Update user role
// @route   PATCH /api/admin/users/:userId/role
// @access  Private/Admin
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be "user" or "admin"'
      });
    }

    // Prevent admin from demoting themselves
    if (req.params.userId === req.user.id && role === 'user') {
      return res.status(400).json({
        success: false,
        message: 'You cannot demote yourself from admin'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update user role',
      error: error.message
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
  try {
    // Prevent admin from deleting themselves
    if (req.params.id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account'
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Delete all reports by this user
    await Report.deleteMany({ reportedBy: req.params.id });

    await user.deleteOne();

    res.json({
      success: true,
      message: 'User and associated reports deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete user',
      error: error.message
    });
  }
};

// @desc    Bulk update report status
// @route   PATCH /api/admin/reports/bulk
// @access  Private/Admin
export const bulkUpdateReports = async (req, res) => {
  try {
    const { reportIds, status, adminNotes } = req.body;

    if (!reportIds || !Array.isArray(reportIds) || reportIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of report IDs'
      });
    }

    if (!['pending', 'verified', 'in-progress', 'resolved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const updateData = { status };
    if (adminNotes) {
      updateData.adminNotes = adminNotes;
    }

    const result = await Report.updateMany(
      { _id: { $in: reportIds } },
      { $set: updateData }
    );

    res.json({
      success: true,
      message: `${result.modifiedCount} reports updated successfully`,
      data: {
        matched: result.matchedCount,
        modified: result.modifiedCount
      }
    });
    // Emit a bulk update event so clients can refresh or patch state
    try {
      const io = req.app?.locals?.io;
      if (io) {
        io.emit('reports:bulkUpdated', { ids: reportIds, status });
      }
    } catch (emitErr) {
      console.warn('Socket emit error (bulkUpdateReports):', emitErr.message);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update reports',
      error: error.message
    });
  }
};

// @desc    Get pending reports for admin review
// @route   GET /api/admin/reports/pending
// @access  Private/Admin
export const getPendingReports = async (req, res) => {
  try {
    const { limit = 50, page = 1 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [reports, total] = await Promise.all([
      Report.find({ status: 'pending' })
        .populate('reportedBy', 'name email ecoPoints')
        .sort('-createdAt')
        .limit(parseInt(limit))
        .skip(skip),
      Report.countDocuments({ status: 'pending' })
    ]);

    res.json({
      success: true,
      data: {
        reports,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pending reports',
      error: error.message
    });
  }
};

// @desc    Get all reports with admin details
// @route   GET /api/admin/reports
// @access  Private/Admin
export const getAllReportsAdmin = async (req, res) => {
  try {
    const { status, wasteType, severity, search, sort = '-createdAt', limit = 20, page = 1 } = req.query;

    // Build query
    const query = {};
    if (status) query.status = status;
    if (wasteType) query.wasteType = wasteType;
    if (severity) query.severity = severity;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [reports, total] = await Promise.all([
      Report.find(query)
        .populate('reportedBy', 'name email ecoPoints role')
        .sort(sort)
        .limit(parseInt(limit))
        .skip(skip),
      Report.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: {
        reports,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reports',
      error: error.message
    });
  }
};

// @desc    Get system overview and statistics
// @route   GET /api/admin/system
// @access  Private/Admin
export const getSystemOverview = async (req, res) => {
  try {
    // Get date ranges
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      totalReports,
      reportsByStatus,
      reportsBySeverity,
      reportsThisMonth,
      newUsersThisMonth,
      activeUsers
    ] = await Promise.all([
      User.countDocuments(),
      Report.countDocuments(),
      Report.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]),
      Report.aggregate([
        {
          $group: {
            _id: '$severity',
            count: { $sum: 1 }
          }
        }
      ]),
      Report.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      User.countDocuments({ updatedAt: { $gte: sevenDaysAgo } })
    ]);

    // Format report status data
    const statusData = reportsByStatus.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {
      pending: 0,
      verified: 0,
      'in-progress': 0,
      resolved: 0,
      rejected: 0
    });

    // Format severity data
    const severityData = reportsBySeverity.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {
      low: 0,
      medium: 0,
      high: 0,
      critical: 0
    });

    res.json({
      success: true,
      data: {
        totalUsers,
        totalReports,
        reportsByStatus: statusData,
        reportsBySeverity: severityData,
        recentActivity: {
          reportsThisMonth,
          newUsersThisMonth,
          activeUsers
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch system overview',
      error: error.message
    });
  }
};

// @desc    Update admin notes on a report
// @route   PATCH /api/admin/reports/:id/notes
// @access  Private/Admin
export const updateReportNotes = async (req, res) => {
  try {
    const { adminNotes } = req.body;
    const reportId = req.params.id;

    const report = await Report.findById(reportId);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    report.adminNotes = adminNotes;
    await report.save();

    await report.populate('reportedBy', 'name email avatar role');

    res.json({
      success: true,
      message: 'Admin notes updated successfully',
      data: { report }
    });
    // Emit socket event for updated report notes
    try {
      const io = req.app?.locals?.io;
      if (io) {
        io.to(`report:${report._id}`).emit('report:updated', report);
        io.emit('report:updated', report);
      }
    } catch (emitErr) {
      console.warn('Socket emit error (updateReportNotes):', emitErr.message);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update admin notes',
      error: error.message
    });
  }
};
