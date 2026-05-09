const UserRepositoryInterface = require('../../domain/repositories/UserRepositoryInterface');
const User = require('../../domain/entities/User');
const pool = require('../config/db');

class PostgresUserRepository extends UserRepositoryInterface {
  async findByEmail(email) {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return new User({
      id: row.id,
      email: row.email,
      passwordHash: row.password_hash,
      role: row.role,
      createdAt: row.created_at
    });
  }

  async save(user) {
    const result = await pool.query(
      'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING id, created_at',
      [user.email, user.passwordHash, user.role]
    );

    const row = result.rows[0];
    user.id = row.id;
    user.createdAt = row.created_at;
    
    return user;
  }
}

module.exports = PostgresUserRepository;