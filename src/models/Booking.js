const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    studioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Studio', required: true },
    studioTitle: String,
    userEmail: { type: String, required: true },
    userName: String,
    date: { type: String, required: true },        // YYYY-MM-DD
    startTime: { type: String, required: true },   // HH:mm
    endTime: { type: String, required: true },     // HH:mm
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);