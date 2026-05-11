const authRoutes = require('./presentation/routes/authRoutes');
const bookingRoutes = require('./presentation/routes/bookingRoutes');
const { authenticateToken, isAdmin } = require('./presentation/middlewares/auth');
const errorHandler = require('./presentation/middlewares/errorHandler');
const eventBus = require('../../infrastructure/events/EventBus');

module.exports = {
  routes: {
    auth: authRoutes,
    bookings: bookingRoutes
  },
  middlewares: {
    authenticateToken,
    isAdmin,
    errorHandler
  },
  eventBus
};