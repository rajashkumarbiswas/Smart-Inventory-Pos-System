const Sale = require('../models/Sale');
const Product = require('../models/Product');

// @desc    Create a new sale & update stock
// @route   POST /api/sales
// @access  Private (Admin / User)
const createSale = async (req, res) => {
    try {
        const { orderItems, paymentMethod } = req.body;

        if (!orderItems || orderItems.length === 0) {
            return res.status(400).json({ message: 'No order items provided' });
        }

        let totalAmount = 0;
        const verifiedOrderItems = [];

        // প্রতিটি প্রোডাক্টের স্টক চেক ও টোটাল অ্যামাউন্ট হিসাব করা
        for (const item of orderItems) {
            const product = await Product.findById(item.product);

            if (!product) {
                return res.status(404).json({ message: `Product not found: ${item.product}` });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({ 
                    message: `Insufficient stock for product: \({product.name}. Available:\){product.stock}` 
                });
            }

            // স্টক কমিয়ে দেওয়া
            product.stock -= item.quantity;
            await product.save();

            totalAmount += product.price * item.quantity;

            verifiedOrderItems.push({
                product: product._id,
                name: product.name,
                quantity: item.quantity,
                price: product.price
            });
        }

        // নতুন সেল রেকর্ড তৈরি করা
        const sale = await Sale.create({
            user: req.user.id,
            orderItems: verifiedOrderItems,
            totalAmount,
            paymentMethod: paymentMethod || 'Cash'
        });

        res.status(201).json({
            message: 'Checkout successful, sale recorded and stock updated',
            sale
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get all sales history
// @route   GET /api/sales
// @access  Private
const getSalesHistory = async (req, res) => {
    try {
        const sales = await Sale.find({}).populate('user', 'name email').populate('orderItems.product', 'name category');
        res.status(200).json({
            count: sales.length,
            sales
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    createSale,
    getSalesHistory
};