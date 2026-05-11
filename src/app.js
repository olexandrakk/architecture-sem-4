const express = require('express');
const app = express();

app.use(express.json());

const coreModule = require('./modules/core');
const analyticsModule = require('./modules/analytics');

require('./infrastructure/events/WelcomeEmailSubscriber').init();
require('./infrastructure/events/BookingSubscribers');
app.use('/api/auth', coreModule.routes.auth);
app.use('/api/bookings', coreModule.routes.bookings);
app.use('/api/analytics', analyticsModule.routes.analytics);
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Cinema API is running' });
});

app.use(coreModule.middlewares.errorHandler);

module.exports = app;