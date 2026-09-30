const Product = require('../models/Product');
const Sale = require('../models/Sale');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private (Admin)
const getDashboardStats = async (req, res) => {
    try {
        // ১. টোটাল প্রোডাক্ট সংখ্যা গণনা করা
        const totalProducts = await Product.countDocuments({});

        // ২. সব সেলস ডাটা ফেচ করা এবং মোট সেলস অ্যামাউন্ট হিসাব করা
        const sales = await Sale.find({});
        const totalSalesCount = sales.length;
        
        const totalRevenue = sales.reduce((acc, sale) => acc + sale.totalAmount, 0);

        // ৩. লো স্টক প্রোডাক্ট কাউন্ট (যেমন স্টক ৫ এর কম বা সমান হলে)
        const lowStockProducts = await Product.countDocuments({ stock: { $lte: 5 } });

        res.status(200).json({
            success: true,
            stats: {
                totalProducts,
                totalSalesCount,
                totalRevenue,
                lowStockProducts
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    getDashboardStats
};