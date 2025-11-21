import request from 'supertest';
import app from '../app.js';
import User from '../models/User.model.js';
import Report from '../models/Report.model.js';
import { describe, it, expect } from 'vitest';

describe('Admin actions', () => {
  it('allows admin to update report status and awards points', async () => {
    // Reporter
    const regReporter = await request(app).post('/api/auth/register').send({ name: 'Reporter', email: 'rep2@example.com', password: 'password' });
    const reporterId = regReporter.body.data.user.id;

    // Create a report as reporter
    const createRes = await request(app)
      .post('/api/reports')
      .set('Authorization', `Bearer ${regReporter.body.data.token}`)
      .field('title', 'Admin Test Report')
      .field('description', 'Desc')
      .field('location[coordinates][0]', '36.8219')
      .field('location[coordinates][1]', '-1.2921');

    expect(createRes.status).toBe(201);
    const reportId = createRes.body.data.report._id;

    // Register an admin user
    const regAdmin = await request(app).post('/api/auth/register').send({ name: 'Admin', email: 'admin@example.com', password: 'adminpass' });
    const adminId = regAdmin.body.data.user.id;

    // Promote to admin directly in DB
    await User.findByIdAndUpdate(adminId, { $set: { role: 'admin' } });

    // Admin updates status to verified
    const res = await request(app)
      .patch(`/api/reports/${reportId}/status`)
      .set('Authorization', `Bearer ${regAdmin.body.data.token}`)
      .send({ status: 'verified' });

    expect(res.status).toBe(200);
    expect(res.body.data.report.status).toBe('verified');

    // Reporter should have received verification points (initial 10 from creation + 20)
    const reporter = await User.findById(reporterId);
    expect(reporter.ecoPoints).toBeGreaterThanOrEqual(30);
  });
});
