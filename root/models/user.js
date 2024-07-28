const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    // Add fields for Google and Facebook OAuth credentials if needed
});

module.exports = mongoose.model('User', userSchema);