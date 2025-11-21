import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { beforeAll, afterAll, beforeEach, vi } from 'vitest';

let mongo;

process.env.NODE_ENV = process.env.NODE_ENV || 'test';
// Ensure a JWT secret is available for tests
process.env.JWT_SECRET = process.env.JWT_SECRET || 'vitest-test-secret';

// Mock external services to avoid network calls
vi.mock('../services/email.service.js', () => ({
  sendWelcomeEmail: vi.fn().mockResolvedValue({ success: true }),
  sendReportStatusUpdate: vi.fn().mockResolvedValue({ success: true }),
  sendNewReportNotification: vi.fn().mockResolvedValue({ success: true }),
  sendEcoPointsMilestone: vi.fn().mockResolvedValue({ success: true }),
  getAdminEmails: vi.fn().mockResolvedValue([]),
  default: {}
}));

// Mock cloudinary to return empty config so uploads are skipped
vi.mock('../config/cloudinary.js', () => ({
  default: {
    config: () => ({}),
    uploader: {
      upload_stream: () => ({ end: () => { } }),
      destroy: vi.fn()
    }
  }
}));

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  // Connect without deprecated options
  await mongoose.connect(uri);
});

afterAll(async () => {
  if (mongoose.connection.readyState) {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  }
  if (mongo) await mongo.stop();
});

beforeEach(async () => {
  const collections = Object.keys(mongoose.connection.collections);
  for (const key of collections) {
    await mongoose.connection.collections[key].deleteMany({});
  }
});
