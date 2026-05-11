const BookingFactory = require('../../../domain/factories/BookingFactory');
const eventBus = require('../../../infrastructure/events/EventBus'); 

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

    console.log(`[Handler] Публікуємо подію BookingCreated...`);
    eventBus.emit('BookingCreated', {
      email: 'user@example.com',
      bookingId: savedBooking.id,
      movieTitle: 'Обраний фільм'
    });

    return savedBooking.id; 
  }
}

module.exports = CreateBookingCommandHandler;