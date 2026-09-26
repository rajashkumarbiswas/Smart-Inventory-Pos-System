const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', registerUser);

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', loginUser);

// @route   GET /api/auth/profile
// @desc    Get user profile (Protected Route)
// @access  Private (Requires JWT Token)
router.get('/profile', protect, (req, res) => {
    res.status(200).json({
        message: 'This is a protected profile route',
        user: req.user
    });
});

// @route   GET /api/auth/admin-dashboard
// @desc    Admin only route (Protected & RBAC)
// @access  Private (Admin Role Required)
router.get('/admin-dashboard', protect, authorizeRoles('admin'), (req, res) => {
    res.status(200).json({
        message: 'Welcome to the Admin Dashboard! You have admin access.'
    });
});

module.exports = router;