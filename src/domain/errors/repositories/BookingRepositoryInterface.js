class BookingRepositoryInterface {
  async isSeatTaken(sessionId, seatNumber) {
    throw new Error('Method not implemented');
  }
  
  async save(bookingEntity) {
    throw new Error('Method not implemented');
  }

  async findByUserId(userId) {
    throw new Error('Method not implemented');
  }
}

module.exports = BookingRepositoryInterface;