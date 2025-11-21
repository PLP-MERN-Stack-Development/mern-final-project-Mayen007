import { createTransport } from 'nodemailer';
import { EMAIL_USER, EMAIL_PASS, EMAIL_FROM, NODE_ENV } from './env.js';

// Create reusable transporter
const createTransporter = () => {
  // If no credentials provided, return null
  if (!EMAIL_USER || !EMAIL_PASS) {
    console.log('⚠️  Email credentials not configured. Emails will be logged to console only.');
    return null;
  }

  // Get email configuration from environment variables
  const emailHost = process.env.EMAIL_HOST || 'smtp.gmail.com';
  const emailPort = parseInt(process.env.EMAIL_PORT) || 465; // Default to 465 for production
  const emailSecure = process.env.EMAIL_SECURE !== 'false'; // Default to true for port 465

  const config = {
    host: emailHost,
    port: emailPort,
    secure: emailSecure, // true for 465 (SSL), false for 587 (TLS)
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
    // Additional options for better production reliability
    connectionTimeout: 10000, // 10 seconds
    greetingTimeout: 10000,
    socketTimeout: 10000,
    logger: NODE_ENV === 'development', // Enable logging in dev
    debug: NODE_ENV === 'development', // Enable debug in dev
  };

  // For Gmail specifically, add additional options
  if (emailHost.includes('gmail')) {
    config.tls = {
      rejectUnauthorized: true,
      minVersion: "TLSv1.2"
    };
  }

  console.log(`📧 Email config: ${emailHost}:${emailPort} (secure: ${emailSecure})`);

  return createTransport(config);
};

const transporter = createTransporter();

// Verify connection configuration with timeout
if (transporter) {
  const verifyTimeout = setTimeout(() => {
    console.log('⚠️  Email verification taking too long, continuing anyway...');
  }, 5000);

  transporter.verify((error, success) => {
    clearTimeout(verifyTimeout);
    if (error) {
      console.log('❌ Email configuration error:', error.message);
      if (error.code === 'ETIMEDOUT' || error.code === 'ECONNECTION') {
        console.log('💡 Tip: Check if your hosting provider blocks SMTP ports.');
        console.log('💡 For Gmail: Use port 465 with SSL or port 587 with TLS');
        console.log('💡 Consider using an App Password instead of your regular password');
      }
    } else {
      console.log('✅ Email server is ready to send messages');
    }
  });
}

export { transporter, EMAIL_FROM };
