const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');
const Event = require('../models/Event');

describe('Events API', () => {
  let token;
  let userId;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/testdb');
    // Create a test user
    const user = new User({ name: 'Organizer', email: 'org@example.com', password: 'password', role: 'organizer' });
    await user.save();
    userId = user._id;
    // Login to get token
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'org@example.com', password: 'password' });
    token = res.body.token;
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should create an event', async () => {
    const res = await request(app)
      .post('/api/events')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Event',
        description: 'A test event',
        date: '2025-12-01',
        time: '10:00',
        location: 'Test Venue',
        capacity: 100,
        price: 10
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.title).toBe('Test Event');
  });

  it('should get all events', async () => {
    const res = await request(app)
      .get('/api/events');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});