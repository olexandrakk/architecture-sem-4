const express = require('express');
const bookingRoutes = require('./routes/bookingRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(express.json());

app.use('/api/bookings', bookingRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Cinema API is running' });
});

app.use(errorHandler);

module.exports = app;