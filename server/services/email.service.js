import { transporter, EMAIL_FROM } from '../config/email.js';
import {
  welcomeEmail,
  reportStatusEmail,
  newReportAdminEmail,
  ecoPointsMilestoneEmail
} from '../utils/emailTemplates.js';

/**
 * Send email using configured transporter
 * Falls back to console logging if email not configured
 */
const sendEmail = async (to, subject, html) => {
  try {
    // If no transporter (dev mode without config), just log
    if (!transporter) {
      console.log('\n📧 EMAIL (not sent - no config):');
      console.log('To:', to);
      console.log('Subject:', subject);
      console.log('---\n');
      return { success: true, mode: 'console' };
    }

    const mailOptions = {
      from: EMAIL_FROM,
      to,
      subject,
      html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent:', info.messageId, '| From:', EMAIL_FROM);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Send welcome email to new users
 */
export const sendWelcomeEmail = async (userEmail, userName) => {
  const subject = 'Welcome to Reviwa! 🌱';
  const html = welcomeEmail(userName);
  return await sendEmail(userEmail, subject, html);
};

/**
 * Send report status update to report owner
 */
export const sendReportStatusUpdate = async (
  userEmail,
  userName,
  reportTitle,
  oldStatus,
  newStatus,
  reportId,
  adminNotes = ''
) => {
  const subject = `Report Update: ${reportTitle}`;
  const html = reportStatusEmail(userName, reportTitle, oldStatus, newStatus, reportId, adminNotes);
  return await sendEmail(userEmail, subject, html);
};

/**
 * Send new report notification to admins
 */
export const sendNewReportNotification = async (
  adminEmail,
  reportTitle,
  reportedBy,
  wasteType,
  severity,
  reportId,
  location = ''
) => {
  const subject = `New Report Submitted: ${reportTitle}`;
  const html = newReportAdminEmail(reportTitle, reportedBy, wasteType, severity, reportId, location);
  return await sendEmail(adminEmail, subject, html);
};

/**
 * Send eco-points milestone achievement email
 */
export const sendEcoPointsMilestone = async (userEmail, userName, currentPoints, milestone) => {
  const subject = `Milestone Reached: ${currentPoints} Eco-Points! 🎉`;
  const html = ecoPointsMilestoneEmail(userName, currentPoints, milestone);
  return await sendEmail(userEmail, subject, html);
};

/**
 * Get all admin emails for notifications
 */
export const getAdminEmails = async (User) => {
  try {
    const admins = await User.find({ role: 'admin' }).select('email');
    return admins.map(admin => admin.email);
  } catch (error) {
    console.error('Error fetching admin emails:', error);
    return [];
  }
};

export default {
  sendWelcomeEmail,
  sendReportStatusUpdate,
  sendNewReportNotification,
  sendEcoPointsMilestone,
  getAdminEmails
};
