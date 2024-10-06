const mongoose = require('mongoose');

const aiToolSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    tagline: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    url: {
        type: String,
        required: true,
        trim: true
    },
    imageUrl: {
        type: String,
        required: true,
        trim: true
    },
    pricing: {
        type: String, // Free, Paid, Freemium
        required: true,
        trim: true
    },
    keyFeatures: {
        type: [String], // Array of features
        required: true
    },
    howToUse: {
        type: String, // Use case or guide text
        required: true
    },
    videoUrl: {
        type: String, // Optional video tutorial link
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const AITool = mongoose.model('AITool', aiToolSchema);

module.exports = AITool;
