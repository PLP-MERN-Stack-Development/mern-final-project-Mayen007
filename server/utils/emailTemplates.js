import { CLIENT_URL } from '../config/env.js';

// Base email template
const emailWrapper = (content, title) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .header {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      padding: 30px;
      text-align: center;
      color: #ffffff;
    }
    .logo {
      width: 60px;
      height: 60px;
      margin-bottom: 15px;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 600;
    }
    .content {
      padding: 30px;
    }
    .button {
      display: inline-block;
      padding: 12px 24px;
      background-color: #10b981;
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 500;
      margin: 20px 0;
    }
    .button:hover {
      background-color: #059669;
    }
    .footer {
      background-color: #f9fafb;
      padding: 20px;
      text-align: center;
      color: #6b7280;
      font-size: 14px;
      border-top: 1px solid #e5e7eb;
    }
    .badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
    }
    .badge-pending { background-color: #fef3c7; color: #92400e; }
    .badge-verified { background-color: #dbeafe; color: #1e40af; }
    .badge-in-progress { background-color: #fce7f3; color: #831843; }
    .badge-resolved { background-color: #d1fae5; color: #065f46; }
    .badge-rejected { background-color: #fee2e2; color: #991b1b; }
    .highlight {
      background-color: #f0fdf4;
      border-left: 4px solid #10b981;
      padding: 15px;
      margin: 15px 0;
      border-radius: 4px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="${CLIENT_URL}/logo.png" alt="Reviwa Logo" class="logo" />
      <h1>Reviwa</h1>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p>This is an automated message from Reviwa Waste Management Platform.</p>
      <p>© ${new Date().getFullYear()} Reviwa. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

// Welcome email
export const welcomeEmail = (userName) => {
  const content = `
    <h2>Welcome to Reviwa! 🎉</h2>
    <p>Hi <strong>${userName}</strong>,</p>
    <p>Thank you for joining Reviwa! We're excited to have you as part of our community working towards a cleaner, greener environment.</p>
    
    <div class="highlight">
      <p><strong>What you can do:</strong></p>
      <ul>
        <li>📸 Report waste sites in your community</li>
        <li>🗺️ View reports on an interactive map</li>
        <li>🌟 Earn eco-points for contributing</li>
        <li>📊 Track your environmental impact</li>
      </ul>
    </div>

    <p>Ready to make a difference? Start by reporting your first waste site!</p>
    <a href="${CLIENT_URL}/create-report" class="button">Report Waste Site</a>
    
    <p>If you have any questions, feel free to explore our platform or contact our support team.</p>
    <p>Together, we can build a cleaner future! 🌍</p>
    <p>Best regards,<br><strong>The Reviwa Team</strong></p>
  `;
  return emailWrapper(content, 'Welcome to Reviwa');
};

// Report status update email
export const reportStatusEmail = (userName, reportTitle, oldStatus, newStatus, reportId, adminNotes = '') => {
  const statusMessages = {
    verified: '✅ Your report has been verified by our admin team and is now visible to the community.',
    'in-progress': '🔄 Great news! Cleanup work has started on this waste site.',
    resolved: '🎉 Fantastic! This waste site has been cleaned up. Thank you for your contribution!',
    rejected: '❌ Unfortunately, this report could not be accepted.'
  };

  const content = `
    <h2>Report Status Update</h2>
    <p>Hi <strong>${userName}</strong>,</p>
    <p>Your report "<strong>${reportTitle}</strong>" has been updated.</p>
    
    <div class="highlight">
      <p>
        <strong>Status changed:</strong> 
        <span class="badge badge-${oldStatus}">${oldStatus}</span> → 
        <span class="badge badge-${newStatus}">${newStatus}</span>
      </p>
      <p>${statusMessages[newStatus] || 'Your report status has been updated.'}</p>
    </div>

    ${newStatus === 'resolved' ? `
      <p style="color: #10b981; font-weight: 600;">🌟 You've earned eco-points for this successful report!</p>
    ` : ''}

    ${adminNotes ? `
      <div style="background-color: #f3f4f6; padding: 15px; border-radius: 6px; margin: 15px 0;">
        <p style="margin: 0;"><strong>Admin Notes:</strong></p>
        <p style="margin: 5px 0 0 0;">${adminNotes}</p>
      </div>
    ` : ''}

    <a href="${CLIENT_URL}/reports/${reportId}" class="button">View Report Details</a>
    
    <p>Thank you for helping keep our environment clean!</p>
    <p>Best regards,<br><strong>The Reviwa Team</strong></p>
  `;
  return emailWrapper(content, `Report Update: ${reportTitle}`);
};

// New report notification for admins
export const newReportAdminEmail = (reportTitle, reportedBy, wasteType, severity, reportId, location) => {
  const content = `
    <h2>New Waste Report Submitted 📋</h2>
    <p>A new waste report has been submitted and requires verification.</p>
    
    <div class="highlight">
      <p><strong>Report Title:</strong> ${reportTitle}</p>
      <p><strong>Reported By:</strong> ${reportedBy}</p>
      <p><strong>Waste Type:</strong> <span style="text-transform: capitalize;">${wasteType}</span></p>
      <p><strong>Severity:</strong> <span class="badge badge-${severity}">${severity}</span></p>
      ${location ? `<p><strong>Location:</strong> ${location}</p>` : ''}
    </div>

    <a href="${CLIENT_URL}/reports/${reportId}" class="button">Review Report</a>
    
    <p>Please review and verify this report at your earliest convenience.</p>
    <p>Best regards,<br><strong>Reviwa System</strong></p>
  `;
  return emailWrapper(content, 'New Report: ' + reportTitle);
};

// Eco-points milestone email
export const ecoPointsMilestoneEmail = (userName, currentPoints, milestone) => {
  const milestones = {
    10: { emoji: '🌱', title: 'Seedling', message: 'Great start!' },
    50: { emoji: '🌿', title: 'Green Warrior', message: 'You\'re making a real difference!' },
    100: { emoji: '🌳', title: 'Eco Champion', message: 'Amazing contribution!' },
    250: { emoji: '🏆', title: 'Environmental Hero', message: 'Outstanding impact!' },
    500: { emoji: '⭐', title: 'Sustainability Legend', message: 'You\'re an inspiration!' }
  };

  const achievement = milestones[milestone] || { emoji: '🎯', title: 'Milestone Reached', message: 'Keep up the great work!' };

  const content = `
    <h2>Congratulations! ${achievement.emoji}</h2>
    <p>Hi <strong>${userName}</strong>,</p>
    <p style="font-size: 18px; color: #10b981;">You've reached <strong>${currentPoints} eco-points!</strong></p>
    
    <div class="highlight">
      <p style="font-size: 24px; margin: 10px 0;">${achievement.emoji} <strong>${achievement.title}</strong></p>
      <p style="font-size: 16px; margin: 5px 0;">${achievement.message}</p>
    </div>

    <p>Your contributions are helping make our communities cleaner and greener. Every report matters!</p>
    <a href="${CLIENT_URL}/profile" class="button">View Your Profile</a>
    
    <p>Keep up the fantastic work! 🌍</p>
    <p>Best regards,<br><strong>The Reviwa Team</strong></p>
  `;
  return emailWrapper(content, `Milestone Reached: ${currentPoints} Eco-Points!`);
};

export default {
  welcomeEmail,
  reportStatusEmail,
  newReportAdminEmail,
  ecoPointsMilestoneEmail
};
