const express = require('express');
const router = express.Router();
const studioController = require('../controllers/studio.controller');
const reviewRoutes = require('./review.routes');
const { verifyToken } = require('../middleware/auth');

router.get('/', studioController.getStudios);
router.get('/featured', studioController.getFeaturedStudios);
router.get('/my-listings', verifyToken, studioController.getMyStudios);
router.use('/:studioId/reviews', reviewRoutes);
router.get('/:id', studioController.getStudioById);
router.post('/', verifyToken, studioController.createStudio);
router.put('/:id', verifyToken, studioController.updateStudio);
router.patch('/:id', verifyToken, studioController.updateStudio);
router.delete('/:id', verifyToken, studioController.deleteStudio);

module.exports = router;