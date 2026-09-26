const express = require('express');
const { createProduct, getProducts } = require('../controllers/productController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

// @route   POST /api/products
// @desc    Create a product
// @access  Private (Admin only)
router.post('/', protect, authorizeRoles('admin'), createProduct);

// @route   GET /api/products
// @desc    Get all products
// @access  Private
router.get('/', protect, getProducts);

module.exports = router;