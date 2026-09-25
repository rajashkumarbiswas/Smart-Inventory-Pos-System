const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

// সরাসরি ক্লাউড ডাটাবেজ কানেকশন স্ট্রিং
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://admin_user:pos12345@cluster0.z1k2l.mongodb.net/smart_pos?retryWrites=true&w=majority";

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