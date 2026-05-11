class CreateBookingCommand {
  constructor({ sessionId, userId, seatNumber, sessionStartTime }) {
    this.sessionId = sessionId;
    this.userId = userId;
    this.seatNumber = seatNumber;
    this.sessionStartTime = sessionStartTime;
  }
}

module.exports = CreateBookingCommand;