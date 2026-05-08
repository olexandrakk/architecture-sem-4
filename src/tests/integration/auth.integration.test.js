const request = require('supertest');
const app = require('../../app'); 

describe('Інтеграційні тести: Захист маршрутів (Middlewares)', () => {
  
  it('Повинен блокувати доступ і повертати 401, якщо запит без токена', async () => {
    const response = await request(app).get('/api/bookings/user/123'); 
    
    expect(response.statusCode).toBe(401);
    expect(response.body.error).toBe('Неавторизований доступ. Токен відсутній.');
  });

  it('Повинен повертати 401, якщо токен підроблений/недійсний', async () => {
    const response = await request(app)
      .get('/api/bookings/user/123')
      .set('Authorization', 'Bearer fake_and_invalid_token_123'); 

    expect(response.statusCode).toBe(401);
    expect(response.body.error).toBe('Токен недійсний або прострочений.');
  });
});