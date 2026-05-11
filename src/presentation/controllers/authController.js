const PostgresUserRepository = require('../../infrastructure/repositories/PostgresUserRepository');
const UserFactory = require('../../domain/factories/UserFactory');
const DomainError = require('../../domain/errors/DomainError');

const RegisterUserCommand = require('../../application/commands/auth/RegisterUserCommand');
const RegisterUserCommandHandler = require('../../application/commands/auth/RegisterUserCommandHandler');
const LoginUserQuery = require('../../application/queries/auth/LoginUserQuery');
const LoginUserQueryHandler = require('../../application/queries/auth/LoginUserQueryHandler');

const userRepository = new PostgresUserRepository();
const userFactory = new UserFactory(userRepository);

const registerHandler = new RegisterUserCommandHandler(userRepository, userFactory);
const loginHandler = new LoginUserQueryHandler(userRepository);

const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const command = new RegisterUserCommand({ email, password });

    const result = await registerHandler.execute(command);

    res.status(201).json({ message: 'User registered successfully', userId: result.id });
  } catch (err) {
    if (err instanceof DomainError) {
      return res.status(400).json({ error: err.message });
    }
    // Перехоплення помилки унікальності (якщо БД кидає помилку)
    if (err.message.includes('already exists') || err.message.includes('duplicate key')) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const query = new LoginUserQuery({ email, password });

    const result = await loginHandler.execute(query);

    res.status(200).json(result);
  } catch (err) {
    if (err.message === 'Invalid email or password') {
      return res.status(401).json({ error: err.message });
    }
    next(err);
  }
};

module.exports = {
  register,
  login
};