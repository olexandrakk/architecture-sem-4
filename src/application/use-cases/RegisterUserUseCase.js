const bcrypt = require('bcryptjs');

class RegisterUserUseCase {
  constructor(userFactory, userRepository) {
    this.userFactory = userFactory;
    this.userRepository = userRepository;
  }

  async execute(email, plainPassword) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(plainPassword, salt);
    const newUser = await this.userFactory.createNewUser(email, passwordHash);
    const savedUser = await this.userRepository.save(newUser);
    return {
      id: savedUser.id,
      email: savedUser.email,
      role: savedUser.role
    };
  }
}

module.exports = RegisterUserUseCase;