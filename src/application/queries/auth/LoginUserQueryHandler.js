const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class LoginUserQueryHandler {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(query) {
    const user = await this.userRepository.findByEmail(query.email);

    if (!user) {
      throw new Error('Invalid email or password'); 
    }

    const isMatch = await bcrypt.compare(query.password, user.password);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    // 3. Формуємо корисне навантаження та генеруємо токен
    const payload = {
      user: {
        id: user.id
      }
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'super-secret-key-for-cinema-api',
      { expiresIn: '1h' } // Токен живе 1 годину
    );

    // CQS правило: Query повертає плоский результат (Read Model)
    return { token };
  }
}

module.exports = LoginUserQueryHandler;