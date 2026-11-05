const mongoose = require('mongoose');
const Review = require('../models/Review');
const Studio = require('../models/Studio');

function isValidId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

async function refreshStudioRating(studioId) {
  const stats = await Review.aggregate([
    { $match: { studioId: new mongoose.Types.ObjectId(studioId) } },
    {
      $group: {
        _id: null,
        rating: { $avg: '$rating' },
        reviewCount: { $sum: 1 },
      },
    },
  ]);

  const summary = stats[0];
  await Studio.findByIdAndUpdate(studioId, {
    rating: summary ? Math.round(summary.rating * 10) / 10 : 0,
    reviewCount: summary ? summary.reviewCount : 0,
  });
}

// GET /api/studios/:studioId/reviews
exports.getReviews = async (req, res) => {
  try {
    if (!isValidId(req.params.studioId)) {
      return res.status(400).json({ message: 'Invalid studio id' });
    }

    const reviews = await Review.find({ studioId: req.params.studioId }).sort({
      createdAt: -1,
    });
    res.json({ reviews });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/studios/:studioId/reviews  (protected)
exports.createReview = async (req, res) => {
  try {
    if (!isValidId(req.params.studioId)) {
      return res.status(400).json({ message: 'Invalid studio id' });
    }

    const rating = Number(req.body.rating);
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: 'Rating must be an integer between 1 and 5' });
    }

    const comment = String(req.body.comment || '').trim();
    if (comment.length < 3) {
      return res
        .status(400)
        .json({ message: 'Comment must be at least 3 characters' });
    }

    const studio = await Studio.findById(req.params.studioId);
    if (!studio) {
      return res.status(404).json({ message: 'Studio not found' });
    }

    const review = await Review.create({
      studioId: studio._id,
      userEmail: req.user.email,
      authorName: req.user.name,
      authorAvatar: req.body.authorAvatar || '',
      rating,
      comment,
    });

    await refreshStudioRating(studio._id);
    res.status(201).json({ message: 'Review added', review });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
