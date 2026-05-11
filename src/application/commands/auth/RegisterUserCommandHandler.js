const bcrypt = require('bcryptjs');

class RegisterUserCommandHandler {
  constructor(userRepository, userFactory) {
    this.userRepository = userRepository;
    this.userFactory = userFactory;
  }

  async execute(command) {
    const userEntity = await this.userFactory.createUser(command.email);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(command.password, salt);
    userEntity.password = hashedPassword;
    const savedUser = await this.userRepository.save(userEntity);
    return { id: savedUser.id }; 
  }
}

module.exports = RegisterUserCommandHandler;