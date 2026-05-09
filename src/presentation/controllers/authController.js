const PostgresUserRepository = require('../../infrastructure/repositories/PostgresUserRepository');
const UserFactory = require('../../domain/factories/UserFactory');
const RegisterUserUseCase = require('../../application/use-cases/RegisterUserUseCase');
const LoginUserUseCase = require('../../application/use-cases/LoginUserUseCase');
const DomainError = require('../../domain/errors/DomainError');

const userRepository = new PostgresUserRepository();
const userFactory = new UserFactory(userRepository);

const registerUseCase = new RegisterUserUseCase(userFactory, userRepository);
const loginUseCase = new LoginUserUseCase(userRepository);

const authController = {
  register: async (req, res) => {
    try {
      const { email, password } = req.body;
      const result = await registerUseCase.execute(email, password);
      
      res.status(201).json(result);
    } catch (error) {
      if (error instanceof DomainError) {
        if (error.message === 'User with this email already exists') {
          return res.status(409).json({ error: error.message });
        }
        return res.status(400).json({ error: error.message });
      }
      
      console.error('Unexpected error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const result = await loginUseCase.execute(email, password);
      
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof DomainError) {
        return res.status(401).json({ error: error.message });
      }
      
      console.error('Unexpected error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};

module.exports = authController;