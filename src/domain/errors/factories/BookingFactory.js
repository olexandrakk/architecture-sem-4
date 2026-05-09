const Booking = require('../entities/Booking');
const DomainError = require('../errors/DomainError');

class BookingFactory {
  constructor(bookingRepository) {
    this.bookingRepository = bookingRepository;
  }

  async createBooking(sessionId, userId, seatNumber, sessionStartTime) {
    if (!seatNumber || seatNumber < 1 || seatNumber > 100) {
      throw new DomainError('Seat number must be between 1 and 100');
    }

    if (sessionStartTime) {
      const currentTime = new Date();
      const sessionTime = new Date(sessionStartTime);
      if (sessionTime <= currentTime) {
        throw new DomainError('Cannot book a ticket for a session that has already started or passed');
      }
    }

    const isBooked = await this.bookingRepository.isSeatTaken(sessionId, seatNumber);
    if (isBooked) {
      throw new DomainError('This seat is already booked for this session');
    }

    return new Booking({ sessionId, userId, seatNumber });
  }
}

module.exports = BookingFactory;