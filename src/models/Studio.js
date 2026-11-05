const mongoose = require('mongoose');

const studioSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    hourlyRate: { type: Number, required: true },
    securityDeposit: { type: Number, default: 0 },
    maxCapacity: { type: Number, required: true },
    location: { type: String, required: true },
    imageURL: { type: String, required: true },
    gallery: [{ type: String }],
    amenities: [{ type: String }],
    overview: { type: String, required: true },
    ownerEmail: { type: String, required: true },
    ownerName: { type: String, required: true },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Studio', studioSchema);