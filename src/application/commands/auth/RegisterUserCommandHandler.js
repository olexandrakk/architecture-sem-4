const bcrypt = require('bcrypt');
const UserFactory = require('../../domain/factories/UserFactory');
const eventBus = require('../../infrastructure/events/EventBus');
const UserRegisteredEvent = require('../../domain/events/UserRegisteredEvent');

class RegisterUserCommandHandler {
  constructor(userRepository) {
    this.userRepository = userRepository;
    this.userFactory = new UserFactory(userRepository);
  }

  async execute(command) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(command.password, saltRounds);
    
    const userEntity = await this.userFactory.createNewUser(
      command.email,
      hashedPassword,
      command.role || 'user' 
    );

    const savedUser = await this.userRepository.save(userEntity);
    const event = new UserRegisteredEvent(savedUser.id, command.email);
    eventBus.emit('UserRegisteredEvent', event);
    
    return savedUser.id;
  }
}

module.exports = RegisterUserCommandHandler;