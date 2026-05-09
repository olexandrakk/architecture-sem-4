const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const DomainError = require('../../domain/errors/DomainError');

class LoginUserUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(email, plainPassword) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new DomainError('Invalid email or password');
    }
    const isValidPassword = await bcrypt.compare(plainPassword, user.passwordHash);
    if (!isValidPassword) {
      throw new DomainError('Invalid email or password');
    }
    const secretKey = process.env.JWT_SECRET || 'secret-key-fallback';
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      secretKey,
      { expiresIn: '2h' }
    );

    return {
      token,
      user: { id: user.id, email: user.email, role: user.role }
    };
  }
}

module.exports = LoginUserUseCase;