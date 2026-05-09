class Booking {
  constructor({ id, sessionId, userId, seatNumber, createdAt }) {
    this.id = id;
    this.sessionId = sessionId;
    this.userId = userId;
    this.seatNumber = seatNumber;
    this.createdAt = createdAt || new Date();
  }
}

module.exports = Booking;