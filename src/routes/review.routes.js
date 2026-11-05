const express = require('express');
const router = express.Router({ mergeParams: true });
const reviewController = require('../controllers/review.controller');
const { verifyToken } = require('../middleware/auth');

router.get('/', reviewController.getReviews);
router.post('/', verifyToken, reviewController.createReview);

module.exports = router;
