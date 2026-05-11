const bcrypt = require('bcrypt');
const UserFactory = require('../../../domain/factories/UserFactory');
const WelcomeEmailService = require('../../../infrastructure/services/WelcomeEmailService');

class RegisterUserCommandHandler {
  constructor(userRepository) {
    this.userRepository = userRepository;
    this.userFactory = new UserFactory(userRepository);
    this.emailService = new WelcomeEmailService();
  }

  async execute(command) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(command.password, saltRounds);
    const userEntity = await this.userFactory.createUser(
      command.email,
      hashedPassword,
      command.role || 'user' 
    );
    const savedUser = await this.userRepository.save(userEntity);
    await this.emailService.sendWelcomeEmail(command.email);
    return savedUser.id;
  }
}

module.exports = RegisterUserCommandHandler;