const request = require('supertest');
const app = require('../../app');
const pool = require('../../infrastructure/config/db');

jest.mock('../../presentation/middlewares/auth', () => ({
  authenticateToken: (req, res, next) => {
    req.user = { id: 1, role: 'user' }; 
    next();
  }
}));

describe('Integration: GET /api/bookings/user/:userId (CQS Query)', () => {
  afterAll(async () => {
    await pool.end();
  });

  it('Повинен повертати оптимізований список квитків (Read Model)', async () => {
    const response = await request(app).get('/api/bookings/user/1');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);

    if (response.body.length > 0) {
      const booking = response.body[0];
      
      expect(booking).toHaveProperty('bookingId');
      expect(booking).toHaveProperty('movieTitle');
      expect(booking).toHaveProperty('seat');
      expect(booking).toHaveProperty('sessionTime');
      
      expect(booking).not.toHaveProperty('user_id');
      expect(booking).not.toHaveProperty('created_at');
    }
  });
});