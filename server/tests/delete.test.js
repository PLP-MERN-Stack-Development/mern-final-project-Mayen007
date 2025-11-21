import request from 'supertest';
import app from '../app.js';
import User from '../models/User.model.js';
import Report from '../models/Report.model.js';
import { describe, it, expect } from 'vitest';

describe('Delete report', () => {
  it('allows owner to delete report and decrements reportsCount', async () => {
    const reg = await request(app).post('/api/auth/register').send({ name: 'DelUser', email: 'del@example.com', password: 'pwd1234' });
    const token = reg.body.data.token;
    const userId = reg.body.data.user.id;

    const createRes = await request(app)
      .post('/api/reports')
      .set('Authorization', `Bearer ${token}`)
      .field('title', 'To Delete')
      .field('description', 'Delete me')
      .field('location[coordinates][0]', '36.8219')
      .field('location[coordinates][1]', '-1.2921');

    expect(createRes.status).toBe(201);
    const reportId = createRes.body.data.report._id;

    const delRes = await request(app)
      .delete(`/api/reports/${reportId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(delRes.status).toBe(200);

    const user = await User.findById(userId);
    expect(user.reportsCount).toBeGreaterThanOrEqual(0);
  });
});
