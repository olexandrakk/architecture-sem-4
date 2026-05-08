const pool = require('../config/db');
const { validateBookingData } = require('../utils/validators');

const createBooking = async (req, res, next) => {
  try {
    const { session_id, seat_number } = req.body;
    
    const user_id = req.user ? req.user.id : req.body.user_id;

    if (!user_id) {
      return res.status(401).json({ error: 'Unauthorized: User ID is missing' });
    }

    const sessionResult = await pool.query('SELECT start_time FROM sessions WHERE id = $1', [session_id]);
    if (sessionResult.rows.length === 0) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const errors = validateBookingData({ seat_number }, sessionResult.rows[0].start_time);
    if (errors.length > 0) {
      return res.status(400).json({ error: 'Validation failed', details: errors });
    }

    const existingBooking = await pool.query(
      'SELECT id FROM bookings WHERE session_id = $1 AND seat_number = $2',
      [session_id, seat_number]
    );
    if (existingBooking.rows.length > 0) {
      return res.status(409).json({ error: 'This seat is already booked for this session' });
    }

    const newBooking = await pool.query(
      'INSERT INTO bookings (session_id, user_id, seat_number) VALUES ($1, $2, $3) RETURNING *',
      [session_id, user_id, seat_number]
    );

    res.status(201).json(newBooking.rows[0]);
  } catch (err) {
    next(err);
  }
};

const getUserBookings = async (req, res, next) => {
  try {
    const user_id = req.user ? req.user.id : req.params.userId;
    const bookings = await pool.query(
      'SELECT b.*, s.start_time, m.title FROM bookings b ' +
      'JOIN sessions s ON b.session_id = s.id ' +
      'JOIN movies m ON s.movie_id = m.id ' +
      'WHERE b.user_id = $1',
      [user_id]
    );
    res.status(200).json(bookings.rows);
  } catch (err) {
    next(err);
  }
};

module.exports = { createBooking, getUserBookings };