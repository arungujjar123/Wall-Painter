const Color = require('../models/Color');

/**
 * GET /api/colors
 * Supports query params: category, brand, finish, search, page, limit
 */
const getAllColors = async (req, res, next) => {
  try {
    const {
      category,
      brand,
      finish,
      search,
      page = 1,
      limit = 50,
    } = req.query;

    const filter = { isActive: true };

    if (category) filter.category = category;
    if (brand) filter.brand = brand;
    if (finish) filter.finish = finish;
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const [colors, total] = await Promise.all([
      Color.find(filter)
        .sort({ name: 1 })
        .skip(skip)
        .limit(parseInt(limit, 10)),
      Color.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: {
        colors,
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
 * GET /api/colors/:id
 */
const getColorById = async (req, res, next) => {
  try {
    const color = await Color.findById(req.params.id);
    if (!color || !color.isActive) {
      return res
        .status(404)
        .json({ success: false, message: 'Color not found.' });
    }
    res.json({ success: true, data: { color } });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/colors (admin)
 */
const createColor = async (req, res, next) => {
  try {
    const { name, hex, rgb, brand, finish, category, description } = req.body;
    const color = await Color.create({
      name,
      hex,
      rgb,
      brand,
      finish,
      category,
      description,
    });
    res.status(201).json({
      success: true,
      message: 'Color created successfully.',
      data: { color },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/colors/:id (admin)
 */
const updateColor = async (req, res, next) => {
  try {
    const color = await Color.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!color) {
      return res
        .status(404)
        .json({ success: false, message: 'Color not found.' });
    }
    res.json({
      success: true,
      message: 'Color updated successfully.',
      data: { color },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/colors/:id (admin) — soft delete
 */
const deleteColor = async (req, res, next) => {
  try {
    const color = await Color.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!color) {
      return res
        .status(404)
        .json({ success: false, message: 'Color not found.' });
    }
    res.json({ success: true, message: 'Color deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/colors/categories
 */
const getColorCategories = async (req, res, next) => {
  try {
    const categories = await Color.distinct('category', { isActive: true });
    res.json({ success: true, data: { categories: categories.sort() } });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/colors/brands
 */
const getColorBrands = async (req, res, next) => {
  try {
    const brands = await Color.distinct('brand', { isActive: true });
    res.json({ success: true, data: { brands: brands.sort() } });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllColors,
  getColorById,
  createColor,
  updateColor,
  deleteColor,
  getColorCategories,
  getColorBrands,
};
