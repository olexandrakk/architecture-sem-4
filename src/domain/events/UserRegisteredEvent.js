class UserRegisteredEvent {
  constructor(userId, email) {
    this.userId = userId;
    this.email = email;
    this.occurredOn = new Date();
  }
}

module.exports = UserRegisteredEvent;