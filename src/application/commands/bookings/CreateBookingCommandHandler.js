const BookingFactory = require('../../../domain/factories/BookingFactory');

class CreateBookingCommandHandler {
  constructor(bookingRepository, notificationService) {
    this.bookingRepository = bookingRepository;
    this.notificationService = notificationService;
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

    try {
      await this.notificationService.sendTicketConfirmation(
        'user@example.com', 
        savedBooking.id, 
        'Обраний фільм'
      );
    } catch (error) {
      console.warn(`[Warning] Основна операція успішна, але побічна впала: ${error.message}`);
    }

    return savedBooking.id; 
  }
}

module.exports = CreateBookingCommandHandler;