const express = require('express');
const { 
    createProduct, 
    getProducts, 
    updateProduct, 
    deleteProduct 
} = require('../controllers/productController');
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

// @route   PUT /api/products/:id
// @desc    Update a product
// @access  Private (Admin only)
router.put('/:id', protect, authorizeRoles('admin'), updateProduct);

// @route   DELETE /api/products/:id
// @desc    Delete a product
// @access  Private (Admin only)
router.delete('/:id', protect, authorizeRoles('admin'), deleteProduct);

module.exports = router;