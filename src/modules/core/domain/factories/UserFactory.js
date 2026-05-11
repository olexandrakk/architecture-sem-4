const User = require('../entities/User');
const Email = require('../ValueObjects/Email');
const DomainError = require('../errors/DomainError');

class UserFactory {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async createNewUser(emailStr, passwordHash, role = 'user') {
    const email = new Email(emailStr);
    const existingUser = await this.userRepository.findByEmail(email.getValue());
    if (existingUser) {
      throw new DomainError('User with this email already exists');
    }
    return new User({
      email: email.getValue(),
      passwordHash: passwordHash,
      role: role
    });
  }
}

module.exports = UserFactory;