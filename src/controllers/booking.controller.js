const Booking = require('../models/Booking');
const Studio = require('../models/Studio');

const toMinutes = (time) => {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
};

// POST /api/bookings  (protected) — challenge 2: double-booking prevention
exports.createBooking = async (req, res) => {
  try {
    const { studioId, date, startTime, endTime, userName } = req.body;
    if (!studioId || !date || !startTime || !endTime)
      return res.status(400).json({ message: 'All fields are required' });

    const studio = await Studio.findById(studioId);
    if (!studio) return res.status(404).json({ message: 'Studio not found' });

    const startMin = toMinutes(startTime);
    const endMin = toMinutes(endTime);
    if (endMin <= startMin)
      return res.status(400).json({ message: 'End time must be after start time' });

    // Prevent double-booking: overlap against CONFIRMED bookings only
    const existing = await Booking.find({ studioId, date, status: 'Confirmed' });
    const overlap = existing.find((b) => {
      const bStart = toMinutes(b.startTime);
      const bEnd = toMinutes(b.endTime);
      return startMin < bEnd && endMin > bStart;
    });
    if (overlap) {
      return res.status(409).json({
        message: `This slot overlaps an existing confirmed booking (${overlap.startTime}–${overlap.endTime}). Please choose a different time.`,
      });
    }

    const hours = (endMin - startMin) / 60;
    const totalPrice =
      hours * studio.hourlyRate + (studio.securityDeposit || 0);

    const booking = await Booking.create({
      studioId,
      studioTitle: studio.title,
      userEmail: req.user.email,
      userName: userName || req.user.name,
      date,
      startTime,
      endTime,
      totalPrice,
      status: 'Pending',
    });

    res.status(201).json({ message: 'Booking placed', booking });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// GET /api/bookings/my-bookings
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userEmail: req.user.email }).sort({ createdAt: -1 });
    res.json({ bookings });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/bookings/studio/:studioId  (owner only)
exports.getStudioBookings = async (req, res) => {
  try {
    const studio = await Studio.findById(req.params.studioId);
    if (!studio) return res.status(404).json({ message: 'Studio not found' });
    if (studio.ownerEmail !== req.user.email)
      return res.status(403).json({ message: 'Forbidden' });

    const bookings = await Booking.find({ studioId: req.params.studioId }).sort({ createdAt: -1 });
    res.json({ bookings });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/bookings/:id/cancel  (user own booking, only if Pending)
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.userEmail !== req.user.email)
      return res.status(403).json({ message: 'Forbidden' });
    if (booking.status !== 'Pending')
      return res.status(400).json({ message: 'Only pending bookings can be cancelled' });

    booking.status = 'Cancelled';
    await booking.save();
    res.json({ message: 'Booking cancelled', booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/bookings/:id/status  (owner only)
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const valid = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];
    if (!valid.includes(status))
      return res.status(400).json({ message: 'Invalid status' });

    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    const studio = await Studio.findById(booking.studioId);
    if (!studio || studio.ownerEmail !== req.user.email)
      return res.status(403).json({ message: 'Forbidden: only studio owner' });

    // Re-check overlap when confirming
    if (status === 'Confirmed') {
      const others = await Booking.find({
        studioId: booking.studioId,
        date: booking.date,
        status: 'Confirmed',
        _id: { $ne: booking._id },
      });
      const sMin = toMinutes(booking.startTime);
      const eMin = toMinutes(booking.endTime);
      const conflict = others.find((b) => {
        const bS = toMinutes(b.startTime);
        const bE = toMinutes(b.endTime);
        return sMin < bE && eMin > bS;
      });
      if (conflict) {
        return res.status(409).json({
          message: `Cannot confirm: conflicts with an existing booking (${conflict.startTime}–${conflict.endTime}).`,
        });
      }
    }

    booking.status = status;
    await booking.save();
    res.json({ message: 'Booking updated', booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};