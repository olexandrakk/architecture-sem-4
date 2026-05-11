const CreateBookingCommandHandler = require('../../../application/commands/CreateBookingCommandHandler');
const CreateBookingCommand = require('../../../application/commands/bookings/CreateBookingCommand');
const DomainError = require('../../../domain/errors/DomainError');

const mockRepository = {
  isSeatTaken: jest.fn(),
  save: jest.fn()
};

describe('Application: CreateBookingCommandHandler (CQS Command)', () => {
  let handler;

  beforeEach(() => {
    handler = new CreateBookingCommandHandler(mockRepository);
    jest.clearAllMocks();
  });

  it('Повинен успішно створити бронювання і повернути ТІЛЬКИ ID', async () => {
    mockRepository.isSeatTaken.mockResolvedValue(false);
    mockRepository.save.mockResolvedValue({ id: 101, sessionId: 1, userId: 2, seatNumber: 15 });

    const command = new CreateBookingCommand({
      sessionId: 1,
      userId: 2,
      seatNumber: 15,
      sessionStartTime: new Date('2030-01-01')
    });

    const result = await handler.execute(command);

    expect(result).toBe(101);
    expect(mockRepository.save).toHaveBeenCalledTimes(1);
  });

  it('Повинен викидати помилку, якщо місце зайняте (перевірка інваріанту)', async () => {
    mockRepository.isSeatTaken.mockResolvedValue(true);

    const command = new CreateBookingCommand({
      sessionId: 1,
      userId: 2,
      seatNumber: 15,
      sessionStartTime: new Date('2030-01-01')
    });

    await expect(handler.execute(command)).rejects.toThrow(DomainError);
    
    expect(mockRepository.save).not.toHaveBeenCalled();
  });
});