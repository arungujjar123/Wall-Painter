const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
  getSystemInfo,
} = require('../controllers/adminController');
const { auth, adminOnly } = require('../middleware/auth');

// All admin routes require authentication and admin privileges
router.use(auth, adminOnly);

router.get('/dashboard', getDashboardStats);
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);
router.get('/system', getSystemInfo);

module.exports = router;
