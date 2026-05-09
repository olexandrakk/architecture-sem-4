const PostgresBookingRepository = require('../../infrastructure/repositories/PostgresBookingRepository');
const CreateBookingUseCase = require('../../application/use-cases/CreateBookingUseCase');
const DomainError = require('../../domain/errors/DomainError');
const pool = require('../../infrastructure/config/db');

const bookingRepository = new PostgresBookingRepository();
const createBookingUseCase = new CreateBookingUseCase(bookingRepository);

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
    const sessionStartTime = sessionResult.rows[0].start_time;

    const newBooking = await createBookingUseCase.execute(
      session_id, 
      user_id, 
      seat_number, 
      sessionStartTime
    );

    res.status(201).json(newBooking);
  } catch (err) {
    if (err instanceof DomainError) {
      if (err.message.includes('already booked')) {
        return res.status(409).json({ error: err.message });
      }
      return res.status(400).json({ error: err.message });
    }
    next(err);
  }
};

const getUserBookings = async (req, res, next) => {
  try {
    const user_id = req.user ? req.user.id : req.params.userId;
    const bookings = await bookingRepository.findByUserId(user_id);
    res.status(200).json(bookings);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createBooking,
  getUserBookings
};