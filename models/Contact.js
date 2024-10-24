// models/Contact.js
const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        match: /.+\@.+\..+/
    },
    country: {
        type: String,
        required: false,
    },
    mobile: {
        type: String,
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('Contact', contactSchema);
