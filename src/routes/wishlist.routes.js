const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlist.controller');
const { verifyToken } = require('../middleware/auth');

router.post('/', verifyToken, wishlistController.addToWishlist);
router.get('/', verifyToken, wishlistController.getMyWishlist);
router.get('/check/:studioId', verifyToken, wishlistController.isInWishlist);
router.delete('/:studioId', verifyToken, wishlistController.removeFromWishlist);

module.exports = router;