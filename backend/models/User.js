const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    btcBalance: { type: Number, default: 0.10735616 },
    usdBalance: { type: Number, default: 100000 },
    walletAddress: { type: String, default: "0x" + Math.random().toString(16).substring(2, 42) }
});

module.exports = mongoose.model('User', UserSchema);

