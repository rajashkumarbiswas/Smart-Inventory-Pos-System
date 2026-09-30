const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' // যে ক্যাশিয়ার বা অ্যাডমিন সেলটি সম্পন্ন করেছে
    },
    orderItems: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Product'
            },
            name: { type: String, required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true }
        }
    ],
    totalAmount: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        required: true,
        default: 'Cash'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Sale', saleSchema);