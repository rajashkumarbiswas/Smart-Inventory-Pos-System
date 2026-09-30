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
            createdBy: req.user.id // মিডলওয়্যার থেকে প্রাপ্ত লগইন করা ইউজারের আইডি
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

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        product.name = req.body.name || product.name;
        product.category = req.body.category || product.category;
        product.price = req.body.price || product.price;
        product.stock = req.body.stock !== undefined ? req.body.stock : product.stock;
        product.description = req.body.description || product.description;

        const updatedProduct = await product.save();
        res.status(200).json({
            message: 'Product updated successfully',
            product: updatedProduct
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        await product.deleteOne();
        res.status(200).json({ message: 'Product removed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    createProduct,
    getProducts,
    updateProduct,
    deleteProduct
};