const { validateAuth } = require('../../middlewares/validate');
const httpMocks = require('node-mocks-http');

describe('Middleware Валідації: validateAuth', () => {
  let req, res, next;
  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn(); 
  });

  it('Повинен пропускати далі, якщо email та пароль валідні', () => {
    // 1. Готуємо дані (ніби юзер ввів їх на сайті)
    req.body = { email: 'yurochka@test.com', password: 'supersecret123' };
    validateAuth(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('Повинен повертати статус 400, якщо email некоректний', () => {
    req.body = { email: 'not-an-email', password: 'supersecret123' };

    validateAuth(req, res, next);
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ error: 'Некоректний формат email адреси.' });
    expect(next).not.toHaveBeenCalled();
  });
});