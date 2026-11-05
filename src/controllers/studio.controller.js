const Studio = require('../models/Studio');

// GET /api/studios?category=&search=&sort=&limit=&minRate=&maxRate=
exports.getStudios = async (req, res) => {
  try {
    const { category, search, sort, limit, minRate, maxRate } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }
    if (minRate || maxRate) {
      filter.hourlyRate = {};
      if (minRate) filter.hourlyRate.$gte = Number(minRate);
      if (maxRate) filter.hourlyRate.$lte = Number(maxRate);
    }

    let query = Studio.find(filter);
    if (sort === 'newest') query = query.sort({ createdAt: -1 });
    else if (sort === 'price-asc') query = query.sort({ hourlyRate: 1 });
    else if (sort === 'price-desc') query = query.sort({ hourlyRate: -1 });
    else if (sort === 'rating') query = query.sort({ rating: -1 });
    else query = query.sort({ createdAt: -1 });

    if (limit) query = query.limit(Number(limit));

    const studios = await query;
    res.json({ studios });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/studios/featured
exports.getFeaturedStudios = async (req, res) => {
  try {
    const studios = await Studio.find()
      .sort({ rating: -1, createdAt: -1 })
      .limit(6);
    res.json({ studios });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/studios/:id
exports.getStudioById = async (req, res) => {
  try {
    const studio = await Studio.findById(req.params.id);
    if (!studio) return res.status(404).json({ message: 'Studio not found' });
    res.json({ studio });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/studios/my-listings  (protected)
exports.getMyStudios = async (req, res) => {
  try {
    const studios = await Studio.find({ ownerEmail: req.user.email }).sort({ createdAt: -1 });
    res.json({ studios });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/studios  (protected)
exports.createStudio = async (req, res) => {
  try {
    const studio = await Studio.create({
      ...req.body,
      ownerEmail: req.user.email,
      ownerName: req.user.name,
    });
    res.status(201).json({ message: 'Studio added', studio });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// PUT /api/studios/:id  (protected, owner only)
exports.updateStudio = async (req, res) => {
  try {
    const studio = await Studio.findById(req.params.id);
    if (!studio) return res.status(404).json({ message: 'Studio not found' });
    if (studio.ownerEmail !== req.user.email)
      return res.status(403).json({ message: 'Forbidden: not the owner' });

    const updated = await Studio.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    res.json({ message: 'Studio updated', studio: updated });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE /api/studios/:id  (protected, owner only)
exports.deleteStudio = async (req, res) => {
  try {
    const studio = await Studio.findById(req.params.id);
    if (!studio) return res.status(404).json({ message: 'Studio not found' });
    if (studio.ownerEmail !== req.user.email)
      return res.status(403).json({ message: 'Forbidden: not the owner' });

    await Studio.findByIdAndDelete(req.params.id);
    res.json({ message: 'Studio deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};