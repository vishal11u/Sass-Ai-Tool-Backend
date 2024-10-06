// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['superAdmin', 'user'],
        default: 'user'
    },
    signupDate: {
        type: Date,
        default: Date.now
    },
    lastLoginDate: {
        type: Date
    }
});

module.exports = mongoose.model('User', userSchema);
