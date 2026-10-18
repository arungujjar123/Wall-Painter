const express = require('express');
const router = express.Router();
const {
  getAllColors,
  getColorById,
  createColor,
  updateColor,
  deleteColor,
  getColorCategories,
  getColorBrands,
} = require('../controllers/colorController');
const { auth, adminOnly } = require('../middleware/auth');

router.get('/', getAllColors);
router.get('/categories', getColorCategories);
router.get('/brands', getColorBrands);
router.get('/:id', getColorById);
router.post('/', auth, adminOnly, createColor);
router.put('/:id', auth, adminOnly, updateColor);
router.delete('/:id', auth, adminOnly, deleteColor);

module.exports = router;
