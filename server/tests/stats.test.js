import request from 'supertest';
import app from '../app.js';
import User from '../models/User.model.js';
import Report from '../models/Report.model.js';
import { describe, it, expect } from 'vitest';

describe('Dashboard stats', () => {
  it('returns aggregated stats', async () => {
    // Create users
    const u1 = await User.create({ name: 'S1', email: 's1@example.com', password: 'pass123' });
    const u2 = await User.create({ name: 'S2', email: 's2@example.com', password: 'pass456' });

    // Seed reports
    await Report.create({ title: 'A', description: 'a', location: { type: 'Point', coordinates: [0, 0] }, reportedBy: u1._id, status: 'pending' });
    await Report.create({ title: 'B', description: 'b', location: { type: 'Point', coordinates: [0, 0] }, reportedBy: u2._id, status: 'resolved' });

    const res = await request(app).get('/api/reports/stats/dashboard');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data.stats).toHaveProperty('total');
    expect(res.body.data.stats.total).toBeGreaterThanOrEqual(2);
  });
});
