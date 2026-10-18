const express = require('express');
const router = express.Router();
const {
  createProject,
  getUserProjects,
  getProjectById,
  updateProject,
  saveDesign,
  deleteProject,
  getPublicProjects,
} = require('../controllers/projectController');
const { auth } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Handle both 'roomImage' and 'image' field names gracefully
const uploadRoomImage = (req, res, next) => {
  upload.single('roomImage')(req, res, (err) => {
    if (err) return next(err);
    if (!req.file) {
      return upload.single('image')(req, res, next);
    }
    next();
  });
};

router.get('/public', getPublicProjects);
router.post('/', auth, uploadRoomImage, createProject);
router.get('/', auth, getUserProjects);
router.get('/:id', auth, getProjectById);
router.put('/:id', auth, updateProject);
router.put('/:id/design', auth, saveDesign);
router.delete('/:id', auth, deleteProject);

module.exports = router;
