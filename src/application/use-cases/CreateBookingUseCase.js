const BookingFactory = require('../../domain/factories/BookingFactory');

class CreateBookingUseCase {
  constructor(bookingRepository) {
    this.bookingRepository = bookingRepository;
    this.bookingFactory = new BookingFactory(bookingRepository);
  }

  async execute(sessionId, userId, seatNumber, sessionStartTime) {
    const bookingEntity = await this.bookingFactory.createBooking(
      sessionId, 
      userId, 
      seatNumber, 
      sessionStartTime
    );

    const savedBooking = await this.bookingRepository.save(bookingEntity);

    return savedBooking;
  }
}

module.exports = CreateBookingUseCase;