import Report from '../models/Report.model.js';
import User from '../models/User.model.js';
import cloudinary from '../config/cloudinary.js';
import {
  sendReportStatusUpdate,
  sendEcoPointsMilestone,
  sendNewReportNotification,
  getAdminEmails
} from '../services/email.service.js';

/**
 * @desc    Create new report
 * @route   POST /api/reports
 * @access  Private
 */
export const createReport = async (req, res, next) => {
  try {
    // Debug: Log what we're receiving
    console.log('req.body:', req.body);
    console.log('req.files:', req.files);

    const { title, description, wasteType, severity } = req.body;

    // Validate required fields
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
        details: {
          title: !title ? 'Title is required' : null,
          description: !description ? 'Description is required' : null
        }
      });
    }

    // Parse location from form data
    // Multer creates a nested structure, so access it accordingly
    let longitude, latitude;

    if (req.body.location && req.body.location.coordinates) {
      // If multer already nested it
      longitude = parseFloat(req.body.location.coordinates[0]);
      latitude = parseFloat(req.body.location.coordinates[1]);
    } else {
      // Fallback to bracket notation
      longitude = parseFloat(req.body['location[coordinates][0]']);
      latitude = parseFloat(req.body['location[coordinates][1]']);
    }

    console.log('Parsed coordinates:', { longitude, latitude });

    if (isNaN(longitude) || isNaN(latitude) || (longitude === 0 && latitude === 0)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide valid location coordinates',
        debug: {
          receivedLocation: req.body.location,
          parsedLongitude: longitude,
          parsedLatitude: latitude
        }
      });
    }

    const location = {
      type: (req.body.location && req.body.location.type) || req.body['location[type]'] || 'Point',
      coordinates: [longitude, latitude]
    };

    if ((req.body.location && req.body.location.address) || req.body['location[address]']) {
      location.address = (req.body.location && req.body.location.address) || req.body['location[address]'];
    }

    // Handle image uploads to Cloudinary
    const imageUploads = [];
    if (req.files && req.files.length > 0) {
      // Check if Cloudinary is configured
      const cloudinaryConfig = cloudinary.config();
      if (!cloudinaryConfig.cloud_name || !cloudinaryConfig.api_key || !cloudinaryConfig.api_secret) {
        console.warn('⚠️  Cloudinary not configured. Skipping image uploads.');
        console.log('Set CLOUDINARY_URL in .env to enable image uploads');
      } else {
        for (const file of req.files) {
          try {
            // Check file size
            const fileSizeMB = file.size / (1024 * 1024);
            console.log(`Processing image: ${file.originalname} (${fileSizeMB.toFixed(2)}MB)`);

            // Upload to Cloudinary with aggressive compression for large files
            const result = await new Promise((resolve, reject) => {
              const uploadStream = cloudinary.uploader.upload_stream(
                {
                  folder: 'reviwa/reports',
                  transformation: [
                    { width: 1920, height: 1920, crop: 'limit' }, // Max 1920px
                    { quality: 'auto:low' }, // Aggressive quality reduction
                    { fetch_format: 'auto' } // Use best format (WebP, AVIF)
                  ],
                  resource_type: 'auto'
                },
                (error, result) => {
                  if (error) reject(error);
                  else resolve(result);
                }
              );
              uploadStream.end(file.buffer);
            });

            console.log(`✓ Image uploaded: ${result.secure_url} (${(result.bytes / (1024 * 1024)).toFixed(2)}MB)`);

            imageUploads.push({
              url: result.secure_url,
              publicId: result.public_id
            });
          } catch (uploadError) {
            console.error('Image upload error:', uploadError.message);
            // Continue with other images even if one fails
          }
        }
      }
    }

    // Create report
    const report = await Report.create({
      title,
      description,
      location,
      wasteType,
      severity,
      images: imageUploads,
      reportedBy: req.user.id
    });

    // Award eco-points for reporting (only to non-admin users)
    if (req.user.role !== 'admin') {
      await User.findByIdAndUpdate(req.user.id, { $inc: { ecoPoints: 10 } });
    }

    // Maintain reportsCount on the user profile
    try {
      await User.findByIdAndUpdate(req.user.id, { $inc: { reportsCount: 1 } });
    } catch (err) {
      console.warn('Failed to increment reportsCount for user', req.user.id, err.message);
    }

    // Populate user info
    await report.populate('reportedBy', 'name email avatar');

    // Send notification to admins (asynchronously)
    getAdminEmails(User).then(adminEmails => {
      if (adminEmails.length > 0) {
        const locationStr = location.address ||
          `${location.coordinates[1].toFixed(4)}, ${location.coordinates[0].toFixed(4)}`;

        adminEmails.forEach(adminEmail => {
          sendNewReportNotification(
            adminEmail,
            title,
            report.reportedBy.name,
            wasteType,
            severity,
            report._id,
            locationStr
          ).catch(err => {
            console.error('Failed to send admin notification:', err.message);
          });
        });
      }
    }).catch(err => {
      console.error('Failed to get admin emails:', err.message);
    });

    res.status(201).json({
      success: true,
      message: 'Report created successfully',
      data: { report }
    });

    // Emit socket events: notify admins only until report is verified
    try {
      const io = req.app?.locals?.io;
      if (io) {
        // Notify admins with the full report payload
        io.to('admins').emit('report:created', report);

        // Emit updated ecoPoints for the reporting user (if non-admin)
        if (req.user.role !== 'admin') {
          const updatedUser = await User.findById(req.user.id).select('ecoPoints');
          io.to(`user:${req.user.id}`).emit('user:points', {
            userId: req.user.id,
            ecoPoints: updatedUser?.ecoPoints || 0
          });
        }
      }
    } catch (emitErr) {
      console.warn('Socket emit error (createReport):', emitErr.message);
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all reports with filters
 * @route   GET /api/reports
 * @access  Public
 */
export const getReports = async (req, res, next) => {
  try {
    const { status, wasteType, severity, limit = 50, page = 1 } = req.query;

    // Build query
    const query = {};
    if (status) query.status = status;
    if (wasteType) query.wasteType = wasteType;
    if (severity) query.severity = severity;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get reports
    const reports = await Report.find(query)
      .populate('reportedBy', 'name email avatar')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    // Get total count
    const total = await Report.countDocuments(query);

    res.json({
      success: true,
      data: {
        reports,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single report
 * @route   GET /api/reports/:id
 * @access  Public
 */
export const getReport = async (req, res, next) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('reportedBy', 'name email avatar ecoPoints')
      .populate('verifiedBy', 'name email');

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    res.json({
      success: true,
      data: { report }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update report status
 * @route   PATCH /api/reports/:id/status
 * @access  Private (Admin or Report Owner)
 */
export const updateReportStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const report = await Report.findById(req.params.id)
      .populate('reportedBy', 'name email ecoPoints role');

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    // Store old status for email notification
    const oldStatus = report.status;

    // Only admins can update report status (enforced by requireAdmin middleware)
    // No need for additional authorization checks here

    // Update status
    report.status = status;

    let pointsAwarded = 0;
    let newEcoPoints = report.reportedBy.ecoPoints;

    if (status === 'verified' && !report.verifiedBy) {
      report.verifiedBy = req.user.id;
      // Award bonus points for verification (only to non-admin users)
      if (report.reportedBy.role !== 'admin') {
        pointsAwarded = 20;
        await User.findByIdAndUpdate(report.reportedBy._id, {
          $inc: { ecoPoints: pointsAwarded }
        });
        newEcoPoints += pointsAwarded;
      }
    }

    if (status === 'resolved') {
      report.resolvedAt = new Date();
      // Award completion points (only to non-admin users)
      if (report.reportedBy.role !== 'admin') {
        pointsAwarded = 50;
        await User.findByIdAndUpdate(report.reportedBy._id, {
          $inc: { ecoPoints: pointsAwarded }
        });
        newEcoPoints += pointsAwarded;
      }
    }

    await report.save();

    // Send email notification to report owner (if not admin)
    if (report.reportedBy.role !== 'admin' && oldStatus !== status) {
      try {
        await sendReportStatusUpdate(
          report.reportedBy.email,
          report.reportedBy.name,
          report.title,
          oldStatus,
          status,
          report._id,
          report.adminNotes || ''
        );
      } catch (emailError) {
        console.error('Failed to send status update email:', emailError.message);
        // Don't fail the request if email fails
      }
    }

    // Check for eco-points milestones and send celebration email
    if (pointsAwarded > 0 && report.reportedBy.role !== 'admin') {
      const milestones = [10, 50, 100, 250, 500];
      const reachedMilestone = milestones.find(
        m => newEcoPoints >= m && (newEcoPoints - pointsAwarded) < m
      );

      if (reachedMilestone) {
        try {
          await sendEcoPointsMilestone(
            report.reportedBy.email,
            report.reportedBy.name,
            newEcoPoints,
            reachedMilestone
          );
        } catch (emailError) {
          console.error('Failed to send milestone email:', emailError.message);
        }
      }
    }

    // Refresh populated data
    await report.populate('reportedBy', 'name email avatar');

    res.json({
      success: true,
      message: 'Report status updated',
      data: { report }
    });

    // Emit socket events for report update and user points
    try {
      const io = req.app?.locals?.io;
      if (io) {
        // Always notify clients viewing the specific report
        io.to(`report:${report._id}`).emit('report:updated', report);

        // If the report is now public (verified/resolved) broadcast full update to everyone,
        // otherwise notify admins only so they can take action.
        if (['verified', 'resolved'].includes(report.status)) {
          io.emit('report:updated', report);
        } else {
          io.to('admins').emit('report:updated', report);
        }

        // If points were awarded, notify the user of new ecoPoints
        if (pointsAwarded > 0 && report.reportedBy && report.reportedBy._id) {
          io.to(`user:${report.reportedBy._id}`).emit('user:points', {
            userId: report.reportedBy._id,
            ecoPoints: newEcoPoints
          });
        }
      }
    } catch (emitErr) {
      console.warn('Socket emit error (updateReportStatus):', emitErr.message);
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete report
 * @route   DELETE /api/reports/:id
 * @access  Private (Admin or Report Owner)
 */
export const deleteReport = async (req, res, next) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    // Check authorization
    const isOwner = report.reportedBy.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this report'
      });
    }

    // Delete images from cloudinary if any
    if (report.images && report.images.length > 0) {
      for (const image of report.images) {
        if (image.publicId) {
          await cloudinary.uploader.destroy(image.publicId);
        }
      }
    }

    await Report.findByIdAndDelete(req.params.id);

    // Update user's report count (ensure it doesn't become negative)
    try {
      const updated = await User.findByIdAndUpdate(report.reportedBy, { $inc: { reportsCount: -1 } }, { new: true });
      if (updated && typeof updated.reportsCount === 'number' && updated.reportsCount < 0) {
        // Clamp to zero if a negative value was produced
        await User.findByIdAndUpdate(report.reportedBy, { $set: { reportsCount: 0 } });
        console.warn(`Clamped negative reportsCount for user ${report.reportedBy} to 0`);
      }
    } catch (err) {
      console.warn('Failed to decrement reportsCount for user', report.reportedBy, err.message);
    }

    res.json({
      success: true,
      message: 'Report deleted successfully'
    });
    // Emit socket event for deletion
    try {
      const io = req.app?.locals?.io;
      if (io) {
        io.emit('report:deleted', { id: req.params.id });
        io.to(`report:${req.params.id}`).emit('report:deleted', { id: req.params.id });
      }
    } catch (emitErr) {
      console.warn('Socket emit error (deleteReport):', emitErr.message);
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get reports by user
 * @route   GET /api/reports/user/:userId
 * @access  Public
 */
export const getUserReports = async (req, res, next) => {
  try {
    const reports = await Report.find({ reportedBy: req.params.userId })
      .populate('reportedBy', 'name email avatar')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { reports }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get dashboard statistics
 * @route   GET /api/reports/stats/dashboard
 * @access  Public
 */
export const getDashboardStats = async (req, res, next) => {
  try {
    const totalReports = await Report.countDocuments();
    const pendingReports = await Report.countDocuments({ status: 'pending' });
    const resolvedReports = await Report.countDocuments({ status: 'resolved' });
    const inProgressReports = await Report.countDocuments({ status: 'in-progress' });
    const totalUsers = await User.countDocuments();

    // Get reports by waste type
    const reportsByType = await Report.aggregate([
      { $group: { _id: '$wasteType', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      data: {
        stats: {
          total: totalReports,
          pending: pendingReports,
          resolved: resolvedReports,
          inProgress: inProgressReports,
          totalUsers: totalUsers
        },
        reportsByType
      }
    });
  } catch (error) {
    next(error);
  }
};
