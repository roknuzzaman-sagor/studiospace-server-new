const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking.controller');
const { verifyToken } = require('../middleware/auth');

router.post('/', verifyToken, bookingController.createBooking);
router.get('/my-bookings', verifyToken, bookingController.getMyBookings);
router.get('/studio/:studioId', verifyToken, bookingController.getStudioBookings);
router.patch('/:id/cancel', verifyToken, bookingController.cancelBooking);
router.patch('/:id/status', verifyToken, bookingController.updateBookingStatus);

module.exports = router;