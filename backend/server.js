const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');

// backend ফোল্ডারের ভেতর থেকেই .env ফাইলটি সঠিকভাবে লোড করার কনফিগারেশন
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();

app.use(express.json());
app.use(cors());

// পরিবেশ ভেরিয়েবল থেকে ডাটাবেজ কানেকশন স্ট্রিং লোড করা
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected Successfully!'))
  .catch((err) => console.log('❌ Database Connection Error: ', err));

app.get('/', (req, res) => {
  res.send('Smart Inventory & POS Backend is Running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});