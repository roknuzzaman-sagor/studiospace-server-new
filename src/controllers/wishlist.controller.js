const Wishlist = require('../models/Wishlist');
const Studio = require('../models/Studio');

exports.addToWishlist = async (req, res) => {
  try {
    const { studioId } = req.body;
    const studio = await Studio.findById(studioId);
    if (!studio) return res.status(404).json({ message: 'Studio not found' });

    const existing = await Wishlist.findOne({ userEmail: req.user.email, studioId });
    if (existing) return res.status(400).json({ message: 'Already in wishlist' });

    await Wishlist.create({ userEmail: req.user.email, studioId });
    res.status(201).json({ message: 'Added to wishlist' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.removeFromWishlist = async (req, res) => {
  try {
    await Wishlist.findOneAndDelete({
      userEmail: req.user.email,
      studioId: req.params.studioId,
    });
    res.json({ message: 'Removed from wishlist' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyWishlist = async (req, res) => {
  try {
    const items = await Wishlist.find({ userEmail: req.user.email }).populate('studioId');
    res.json({ wishlist: items });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.isInWishlist = async (req, res) => {
  try {
    const item = await Wishlist.findOne({
      userEmail: req.user.email,
      studioId: req.params.studioId,
    });
    res.json({ inWishlist: !!item });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};