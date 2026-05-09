const BookingFactory = require('../../../domain/factories/BookingFactory');
const DomainError = require('../../../domain/errors/DomainError');

const mockRepository = {
  isSeatTaken: jest.fn()
};

describe('Домен: BookingFactory (Чиста бізнес-логіка)', () => {
  let factory;

  beforeEach(() => {
    factory = new BookingFactory(mockRepository);
    jest.clearAllMocks();
  });

  it('Повинен викидати DomainError, якщо номер місця некоректний', async () => {
    await expect(factory.createBooking(1, 2, 0, new Date('2030-01-01')))
      .rejects.toThrow(DomainError);
  });

  it('Повинен викидати DomainError, якщо сеанс у минулому', async () => {
    await expect(factory.createBooking(1, 2, 15, new Date('2020-01-01')))
      .rejects.toThrow(DomainError);
  });

  it('Повинен викидати DomainError, якщо місце вже зайняте', async () => {
    mockRepository.isSeatTaken.mockResolvedValue(true);

    await expect(factory.createBooking(1, 2, 15, new Date('2030-01-01')))
      .rejects.toThrow('This seat is already booked');
  });

  it('Повинен успішно створювати сутність Booking, якщо дані валідні', async () => {
    mockRepository.isSeatTaken.mockResolvedValue(false);

    const booking = await factory.createBooking(1, 2, 15, new Date('2030-01-01'));
    
    expect(booking.sessionId).toBe(1);
    expect(booking.seatNumber).toBe(15);
    expect(mockRepository.isSeatTaken).toHaveBeenCalledWith(1, 15);
  });
});