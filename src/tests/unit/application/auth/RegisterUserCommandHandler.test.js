const RegisterUserCommand = require('../../../../../application/commands/auth/RegisterUserCommand');
const RegisterUserCommandHandler = require('../../../../../application/commands/auth/RegisterUserCommandHandler');
const DomainError = require('../../../../../domain/errors/DomainError');
const mockUserRepository = {
  save: jest.fn()
};

const mockUserFactory = {
  createUser: jest.fn()
};

describe('Application: RegisterUserCommandHandler (CQS Command)', () => {
  let handler;

  beforeEach(() => {
    handler = new RegisterUserCommandHandler(mockUserRepository, mockUserFactory);
    jest.clearAllMocks();
  });

  it('Повинен успішно зареєструвати користувача і повернути його ID', async () => {
    const fakeUserEntity = { email: 'test@example.com', password: '' };
    mockUserFactory.createUser.mockResolvedValue(fakeUserEntity);
    
    mockUserRepository.save.mockResolvedValue({ id: 1, ...fakeUserEntity });

    const command = new RegisterUserCommand({ email: 'test@example.com', password: 'password123' });
    const result = await handler.execute(command);

    expect(mockUserFactory.createUser).toHaveBeenCalledWith('test@example.com');
    expect(mockUserRepository.save).toHaveBeenCalled();
    
    expect(result).toEqual({ id: 1 });
  });

  it('Повинен прокинути помилку, якщо фабрика відмовила у створенні (наприклад, email зайнятий)', async () => {
    mockUserFactory.createUser.mockRejectedValue(new DomainError('Email already exists'));

    const command = new RegisterUserCommand({ email: 'taken@example.com', password: '123' });

    await expect(handler.execute(command)).rejects.toThrow(DomainError);
    await expect(handler.execute(command)).rejects.toThrow('Email already exists');
    
    expect(mockUserRepository.save).not.toHaveBeenCalled();
  });
});