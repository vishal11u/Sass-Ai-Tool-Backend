const mongoose = require("mongoose");

const aiToolSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  tagline: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  url: {
    type: String,
    required: true,
    trim: true,
  },
  imageUrl: {
    type: String,
    required: true,
    trim: true,
  },
  pricing: {
    type: String,
    required: true,
    trim: true,
  },
  keyFeatures: {
    type: [String],
    required: true,
  },
  howToUse: {
    type: String,
    required: true,
  },
  videoUrl: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const AITool = mongoose.model("AITool", aiToolSchema);

module.exports = AITool;
