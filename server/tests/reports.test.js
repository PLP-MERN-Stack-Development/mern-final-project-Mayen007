import request from 'supertest';
import app from '../app.js';
import User from '../models/User.model.js';
import Report from '../models/Report.model.js';
import { describe, it, expect } from 'vitest';

describe('Reports endpoints', () => {
  it('returns reports with pagination', async () => {
    const user = await User.create({ name: 'Reporter', email: 'rep@example.com', password: 'pass1234' });

    // Seed a few reports
    const seed = [];
    for (let i = 0; i < 5; i++) {
      seed.push({
        title: `Report ${i}`,
        description: 'Test',
        location: { type: 'Point', coordinates: [36.8219, -1.2921] },
        reportedBy: user._id
      });
    }
    await Report.insertMany(seed);

    const res = await request(app).get('/api/reports').query({ limit: 2, page: 1 });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body.data.reports).toBeInstanceOf(Array);
    expect(res.body.data.pagination).toHaveProperty('page');
    expect(res.body.data.pagination).toHaveProperty('limit');
  });

  it('creates a report (protected) and increments user ecoPoints', async () => {
    // Register user via API to receive token
    const reg = await request(app).post('/api/auth/register').send({ name: 'CR User', email: 'cr@example.com', password: 'create123' });
    const token = reg.body.data.token;

    const res = await request(app)
      .post('/api/reports')
      .set('Authorization', `Bearer ${token}`)
      .field('title', 'New Report')
      .field('description', 'Some desc')
      .field('wasteType', 'mixed')
      .field('severity', 'low')
      .field('location[coordinates][0]', '36.8219')
      .field('location[coordinates][1]', '-1.2921');

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body.data.report).toHaveProperty('title', 'New Report');

    // Check that user ecoPoints incremented
    const userId = reg.body.data.user.id;
    const user = await User.findById(userId);
    expect(user.ecoPoints).toBeGreaterThanOrEqual(10);
  });
});
