const Pattern = require('../models/Pattern');

/**
 * GET /api/patterns
 */
const getAllPatterns = async (req, res, next) => {
  try {
    const { category, search, page = 1, limit = 50 } = req.query;

    const filter = { isActive: true };
    if (category) filter.category = category;
    if (search) filter.name = { $regex: search, $options: 'i' };

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const [patterns, total] = await Promise.all([
      Pattern.find(filter)
        .sort({ name: 1 })
        .skip(skip)
        .limit(parseInt(limit, 10)),
      Pattern.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: {
        patterns,
        pagination: {
          total,
          page: parseInt(page, 10),
          limit: parseInt(limit, 10),
          pages: Math.ceil(total / parseInt(limit, 10)),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/patterns/:id
 */
const getPatternById = async (req, res, next) => {
  try {
    const pattern = await Pattern.findById(req.params.id);
    if (!pattern || !pattern.isActive) {
      return res
        .status(404)
        .json({ success: false, message: 'Pattern not found.' });
    }
    res.json({ success: true, data: { pattern } });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/patterns (admin, with image upload)
 */
const createPattern = async (req, res, next) => {
  try {
    const { name, description, category, style, scale } = req.body;

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: 'Pattern image is required.' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    const pattern = await Pattern.create({
      name,
      description,
      category,
      imageUrl,
      style,
      scale: scale || 1,
    });

    res.status(201).json({
      success: true,
      message: 'Pattern created successfully.',
      data: { pattern },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/patterns/:id (admin)
 */
const updatePattern = async (req, res, next) => {
  try {
    const updates = { ...req.body };

    // If a new image was uploaded, update the imageUrl
    if (req.file) {
      updates.imageUrl = `/uploads/${req.file.filename}`;
    }

    const pattern = await Pattern.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!pattern) {
      return res
        .status(404)
        .json({ success: false, message: 'Pattern not found.' });
    }

    res.json({
      success: true,
      message: 'Pattern updated successfully.',
      data: { pattern },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/patterns/:id (admin) — soft delete
 */
const deletePattern = async (req, res, next) => {
  try {
    const pattern = await Pattern.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!pattern) {
      return res
        .status(404)
        .json({ success: false, message: 'Pattern not found.' });
    }

    res.json({ success: true, message: 'Pattern deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllPatterns,
  getPatternById,
  createPattern,
  updatePattern,
  deletePattern,
};
