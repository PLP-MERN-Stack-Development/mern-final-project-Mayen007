import './env.js'; // Load environment variables first
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
// The CLOUDINARY_URL environment variable is automatically parsed by the SDK
// Format: CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
cloudinary.config();

// Verify configuration
const config = cloudinary.config();
console.log('Cloudinary config check:', {
  cloud_name: config.cloud_name,
  api_key: config.api_key ? '***' + config.api_key.slice(-4) : undefined,
  has_secret: !!config.api_secret
});

if (!config.cloud_name || !config.api_key || !config.api_secret) {
  console.warn('⚠️  Cloudinary is not properly configured. Image uploads will fail.');
  console.log('Please set CLOUDINARY_URL in .env');
  console.log('Format: CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name');
} else {
  console.log('✓ Cloudinary configured successfully:', config.cloud_name);
}

export default cloudinary;
