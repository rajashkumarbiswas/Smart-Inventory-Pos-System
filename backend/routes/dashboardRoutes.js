const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/dashboardController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// শুধুমাত্র অ্যাডমিন যেন ড্যাশবোর্ড স্ট্যাটস দেখতে পারে
router.get('/stats', protect, authorizeRoles('admin'), getDashboardStats);

module.exports = router;