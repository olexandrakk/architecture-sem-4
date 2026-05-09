const BookingRepositoryInterface = require('../../domain/repositories/BookingRepositoryInterface');
const Booking = require('../../domain/entities/Booking');
const pool = require('../../config/db');

class PostgresBookingRepository extends BookingRepositoryInterface {
  async isSeatTaken(sessionId, seatNumber) {
    const result = await pool.query(
      'SELECT id FROM bookings WHERE session_id = $1 AND seat_number = $2',
      [sessionId, seatNumber]
    );
    return result.rows.length > 0;
  }

  async save(bookingEntity) {
    const result = await pool.query(
      'INSERT INTO bookings (session_id, user_id, seat_number, created_at) VALUES ($1, $2, $3, $4) RETURNING *',
      [bookingEntity.sessionId, bookingEntity.userId, bookingEntity.seatNumber, bookingEntity.createdAt]
    );
    
    const row = result.rows[0];
    return new Booking({
      id: row.id,
      sessionId: row.session_id,
      userId: row.user_id,
      seatNumber: row.seat_number,
      createdAt: row.created_at
    });
  }

  async findByUserId(userId) {
    const result = await pool.query(
      `SELECT b.*, s.start_time, m.title FROM bookings b 
       JOIN sessions s ON b.session_id = s.id 
       JOIN movies m ON s.movie_id = m.id 
       WHERE b.user_id = $1`,
      [userId]
    );
    return result.rows;
  }
}

module.exports = PostgresBookingRepository;