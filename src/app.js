const express = require('express');
const bookingRoutes = require('./presentation/routes/bookingRoutes');
const authRoutes = require('./presentation/routes/authRoutes');
const errorHandler = require('./presentation/middlewares/errorHandler');

const app = express();

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Cinema API is running' });
});

app.use(errorHandler);

module.exports = app;