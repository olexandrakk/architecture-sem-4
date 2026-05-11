const PostgresBookingRepository = require('../../infrastructure/repositories/PostgresBookingRepository');
const CreateBookingCommand = require('../../application/commands/bookings/CreateBookingCommand');
const CreateBookingCommandHandler = require('../../application/commands/CreateBookingCommandHandler');
const GetUserBookingsQuery = require('../../application/queries/bookings/GetUserBookingsQuery');
const GetUserBookingsQueryHandler = require('../../application/queries/bookings/GetUserBookingsQueryHandler');
const DomainError = require('../../domain/errors/DomainError');
const pool = require('../../infrastructure/config/db');
const NotificationService = require('../../infrastructure/services/NotificationService');

const bookingRepository = new PostgresBookingRepository();
const notificationService = new NotificationService();
const createBookingHandler = new CreateBookingCommandHandler(bookingRepository, notificationService);
const getUserBookingsHandler = new GetUserBookingsQueryHandler();

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

    const command = new CreateBookingCommand({
      sessionId: session_id,
      userId: user_id,
      seatNumber: seat_number,
      sessionStartTime: sessionStartTime
    });

    const bookingId = await createBookingHandler.execute(command);

    res.status(201).json({ 
      message: 'Booking created successfully', 
      bookingId: bookingId 
    });
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

    const query = new GetUserBookingsQuery({ userId: user_id });

    const bookings = await getUserBookingsHandler.execute(query);

    res.status(200).json(bookings);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createBooking,
  getUserBookings
};