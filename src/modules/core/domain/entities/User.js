class User {
  constructor({ id, email, passwordHash, role = 'user', createdAt = new Date() }) {
    this.id = id;
    this.email = email; 
    this.passwordHash = passwordHash;
    this.role = role;
    this.createdAt = createdAt;
  }
}

module.exports = User;