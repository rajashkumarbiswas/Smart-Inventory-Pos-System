const Product = require('../models/Product');

// @desc    Create a new product
// @route   POST /api/products
// @access  Private (Admin / Authorized User)
const createProduct = async (req, res) => {
    try {
        const { name, category, price, stock, description } = req.body;

        if (!name || !category || !price || stock === undefined) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const product = await Product.create({
            name,
            category,
            price,
            stock,
            description,
            createdBy: req.user.id // মিডলওয়্যার থেকে প্রাপ্ত লগইন করা ইউজারের আইডি
        });

        res.status(201).json({
            message: 'Product created successfully',
            product
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get all products
// @route   GET /api/products
// @access  Private
const getProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json({
            count: products.length,
            products
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    createProduct,
    getProducts
};