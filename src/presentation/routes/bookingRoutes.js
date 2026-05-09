const express = require('express');
const router = express.Router();

const { authenticateToken } = require('../../../middlewares/auth');
const bookingController = require('../bookingController');

router.post('/', authenticateToken, bookingController.createBooking);
router.get('/user/:userId', authenticateToken, bookingController.getUserBookings);

module.exports = router;