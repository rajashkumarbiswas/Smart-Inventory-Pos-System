const express = require('express');
const router = express.Router();
const { createSale, getSalesHistory } = require('../controllers/saleController');
const { protect } = require('../middleware/authMiddleware');

// সব সেলস রাউট সুরক্ষিত রাখতে `protect` মিডলওয়্যার ব্যবহার করা হয়েছে
router.route('/')
    .post(protect, createSale)
    .get(protect, getSalesHistory);

module.exports = router;