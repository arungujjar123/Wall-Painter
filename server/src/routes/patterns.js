const express = require('express');
const router = express.Router();
const {
  getAllPatterns,
  getPatternById,
  createPattern,
  updatePattern,
  deletePattern,
} = require('../controllers/patternController');
const { auth, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', getAllPatterns);
router.get('/:id', getPatternById);
router.post('/', auth, adminOnly, upload.single('image'), createPattern);
router.put('/:id', auth, adminOnly, updatePattern);
router.delete('/:id', auth, adminOnly, deletePattern);

module.exports = router;
