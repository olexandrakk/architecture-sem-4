const BookingFactory = require('../../domain/factories/BookingFactory');

class CreateBookingCommandHandler {
  constructor(bookingRepository) {
    this.bookingRepository = bookingRepository;
    this.bookingFactory = new BookingFactory(bookingRepository);
  }

  async execute(command) {
    const bookingEntity = await this.bookingFactory.createBooking(
      command.sessionId, 
      command.userId, 
      command.seatNumber, 
      command.sessionStartTime
    );

    const savedBooking = await this.bookingRepository.save(bookingEntity);

    return savedBooking.id; 
  }
}

module.exports = CreateBookingCommandHandler;