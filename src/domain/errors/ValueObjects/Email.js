const DomainError = require('../errors/DomainError');

class Email {
  constructor(address) {
    if (!address) {
      throw new DomainError('Email is required');
    }
    if (!this._validate(address)) {
      throw new DomainError('Invalid email format');
    }
    this.address = address;
  }

  _validate(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  getValue() {
    return this.address;
  }
}

module.exports = Email;