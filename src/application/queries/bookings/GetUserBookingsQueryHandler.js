const pool = require('../../../infrastructure/config/db'); 

class GetUserBookingsQueryHandler {
  async execute(query) {
    const result = await pool.query(
      `SELECT 
         b.id as booking_id, 
         b.seat_number, 
         s.start_time, 
         m.title as movie_title
       FROM bookings b 
       JOIN sessions s ON b.session_id = s.id 
       JOIN movies m ON s.movie_id = m.id 
       WHERE b.user_id = $1
       ORDER BY s.start_time DESC`,
      [query.userId]
    );

    return result.rows.map(row => ({
      bookingId: row.booking_id,
      movieTitle: row.movie_title,
      seat: row.seat_number,
      sessionTime: row.start_time
    }));
  }
}

module.exports = GetUserBookingsQueryHandler;