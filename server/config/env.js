import dotenv from 'dotenv';

// Load environment variables as early as possible
dotenv.config();

// Log for debugging
console.log('Environment loaded:', {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  CLOUDINARY_URL: process.env.CLOUDINARY_URL ? 'SET ✓' : 'NOT SET ✗',
  EMAIL_CONFIG: process.env.EMAIL_USER ? 'SET ✓' : 'NOT SET ✗',
  EMAIL_FROM: process.env.EMAIL_FROM ? `SET: ${process.env.EMAIL_FROM}` : 'NOT SET (will use EMAIL_USER)'
});

export const NODE_ENV = process.env.NODE_ENV || 'development';
export const PORT = process.env.PORT || 5000;
export const MONGODB_URI = process.env.MONGODB_URI;
export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
export const EMAIL_USER = process.env.EMAIL_USER;
export const EMAIL_PASS = process.env.EMAIL_PASS;
export const EMAIL_FROM = process.env.EMAIL_FROM || process.env.EMAIL_USER;
export const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

export default process.env;
