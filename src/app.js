const express = require('express');

const bookingRoutes = require('./modules/core/presentation/routes/bookingRoutes');
const authRoutes = require('./modules/core/presentation/routes/authRoutes');
const errorHandler = require('./modules/core/presentation/middlewares/errorHandler');

const app = express();

require('./infrastructure/events/WelcomeEmailSubscriber').init();
require('./infrastructure/events/BookingSubscribers');

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Cinema API is running' });
});

app.use(errorHandler);

module.exports = app;