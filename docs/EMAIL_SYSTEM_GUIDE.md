# Email Notification System

## Overview

Reviwa now includes a comprehensive email notification system that keeps users and admins informed about important events.

## Email Types

### 1. **Welcome Email**

Sent when a new user registers on the platform.

- Greeting message
- Overview of platform features
- Call-to-action to create first report

### 2. **Report Status Update**

Sent to report owners when their report status changes.

- Status change notification (pending → verified → in-progress → resolved)
- Eco-points earned (if applicable)
- Admin notes (if any)
- Link to view report details

### 3. **Eco-Points Milestone**

Sent when users reach eco-points milestones (10, 50, 100, 250, 500).

- Celebration message
- Achievement badge
- Current points total

### 4. **New Report Notification** (Admin Only)

Sent to admins when a new report is submitted.

- Report details (title, type, severity, location)
- Reporter information
- Link to review report

## Configuration

### Using Gmail (Recommended for Development)

1. **Enable 2-Factor Authentication** on your Gmail account

2. **Create an App Password**:

   - Go to Google Account → Security
   - Under "Signing in to Google", select "App passwords"
   - Generate a new app password for "Mail"

3. **Add to `.env` file**:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password-here
EMAIL_FROM=Reviwa <your-email@gmail.com>
CLIENT_URL=http://localhost:5173
```

### Using Other SMTP Providers

For SendGrid, Mailgun, or custom SMTP:

```env
EMAIL_HOST=smtp.yourdomain.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-smtp-username
EMAIL_PASS=your-smtp-password
EMAIL_FROM=noreply@yourdomain.com
CLIENT_URL=https://reviwa.netlify.app
```

### Production Environment Variables

For Render.com deployment:

1. Go to your Render dashboard
2. Select your web service
3. Go to "Environment" tab
4. Add the following variables:

```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=465
EMAIL_SECURE=true
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=Reviwa <your-email@gmail.com>
CLIENT_URL=https://reviwa.netlify.app
```

**Important Notes:**

- Use **port 465** for production (more reliable)
- The `render.yaml` file includes these variables by default
- You still need to set the actual values (especially EMAIL_USER and EMAIL_PASS) in Render dashboard
- After adding variables, **redeploy** your service

## Development Mode

If email credentials are not configured, the system will:

- Log email details to console instead of sending
- Continue normal operation without errors
- Display message: "Email credentials not configured. Emails will be logged to console only."

This allows development without email setup.

## Testing

### Test Welcome Email

Register a new user account:

```bash
POST /api/auth/register
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123"
}
```

### Test Status Update Email

Update a report status (as admin):

```bash
PATCH /api/reports/:id/status
{
  "status": "verified"
}
```

### Test Milestone Email

The system automatically sends when users reach milestones (10, 50, 100, 250, 500 points).

### Test Admin Notification

Create a new report (as regular user):

```bash
POST /api/reports
{
  "title": "Waste Site",
  "description": "Test report",
  ...
}
```

## Email Templates

All email templates are located in `server/utils/emailTemplates.js` and include:

- Responsive HTML design
- Branded header with Reviwa logo
- Color-coded status badges
- Call-to-action buttons
- Professional footer

## Troubleshooting

### Emails Not Sending

1. **Check credentials**: Verify EMAIL_USER and EMAIL_PASS are correct
2. **Check console**: Look for email error messages
3. **Test SMTP connection**: The server logs "✅ Email server is ready" on startup
4. **Gmail blocking**: Make sure you're using an App Password, not your regular password
5. **Firewall**: Ensure port 587 (or 465) is not blocked

### Production: "Connection timeout" Error

If emails work in development but not production (Render, Heroku, etc.):

**Common Causes:**

- Hosting providers often **block port 587** (TLS) for security
- Port 465 (SSL) is usually allowed

**Solution:**
Add these environment variables on Render:

```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=465
EMAIL_SECURE=true
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=Reviwa <your-email@gmail.com>
```

**Port Comparison:**

- **Port 465** (SSL): More reliable in production, works on most hosts
- **Port 587** (TLS/STARTTLS): Often blocked by hosting providers

**Alternative Solutions:**

1. **Use a dedicated email service** (recommended for production):

   - SendGrid (free tier: 100 emails/day)
   - Mailgun (free tier: 5000 emails/month)
   - AWS SES (very affordable)

2. **Contact your hosting provider** to unblock port 587

### Gmail "Less Secure App" Error

Gmail no longer supports "less secure apps". You MUST use:

- 2-Factor Authentication enabled
- App Password (not your regular Gmail password)

### Emails in Spam

- Add your domain to SPF/DKIM records (for production)
- Use a verified sending domain
- Consider using a dedicated email service (SendGrid, Mailgun)

### Environment Variables Not Loading

On Render.com:

1. Go to Dashboard → Your Service → Environment
2. Ensure all EMAIL\_\* variables are set
3. **Important**: After adding variables, manually trigger a new deployment
4. Check logs for "Email config: smtp.gmail.com:465"

## Future Enhancements

Potential improvements for Phase 3:

- Email preferences (allow users to opt-out of certain notifications)
- Daily/weekly digest emails
- HTML email previews in admin panel
- Email analytics (open rates, click rates)
- Custom email templates per organization

## Dependencies

- `nodemailer` - ^6.9.0 (handles email sending)

## Security Notes

- Never commit EMAIL_PASS to version control
- Use environment variables for all sensitive data
- Consider rate limiting for email sends
- Use App Passwords or API keys, never plain passwords
