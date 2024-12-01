const express = require("express");
const AITool = require("../models/AiToolCard");
const router = express.Router();
const Notification = require("../models/Notification");
const { authenticateToken, authorizeRoles } = require("../middleware/auth");
const mongoose = require("mongoose");

// Create a new AI tool (only accessible by 'superAdmin')
router.post(
  "/save",
  authenticateToken,
  authorizeRoles("superAdmin", "user"),
  async (req, res) => {
    try {
      const newTool = new AITool(req.body);
      await newTool.save();

      // Create notification for AI tool creation
      const notification = new Notification({
        userId: req.user._id,
        type: "createAI",
        message: `New AI tool "${newTool.productName}" created.`,
      });
      await notification.save();

      res
        .status(201)
        .json({ message: "Ai toll Create successfully!", newTool: newTool });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

// Get all AI tools (accessible by both 'superAdmin' and 'user')
router.get(
  "/",
  // authenticateToken,
  // authorizeRoles("superAdmin", "user"),
  async (req, res) => {
    try {
      const tools = await AITool.find();
      res.status(200).json(tools);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.get(
  "/getbyId/:id",
  // authenticateToken,
  // authorizeRoles("superAdmin", "user"),
  async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    try {
      const tool = await AITool.findById(id);

      if (!tool) {
        return res.status(404).json({ error: "Tool not found" });
      }

      res.status(200).json(tool);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Update an AI tool by ID (only accessible by 'superAdmin')
router.put(
  "/update/:id",
  authenticateToken,
  authorizeRoles("superAdmin"),
  async (req, res) => {
    try {
      const updatedTool = await AITool.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      if (!updatedTool)
        return res.status(404).json({ error: "Tool not found" });
      res.status(200).json(updatedTool);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

// Delete an AI tool by ID (only accessible by 'superAdmin')
router.delete(
  "/delete/:id",
  authenticateToken,
  authorizeRoles("superAdmin"),
  async (req, res) => {
    try {
      const deletedTool = await AITool.findByIdAndDelete(req.params.id);
      if (!deletedTool)
        return res.status(404).json({ error: "Tool not found" });
      res.status(200).json({ message: "Tool deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Search Route (accessible by both 'superAdmin' and 'user')
router.get(
  "/search",
  // authenticateToken,
  // authorizeRoles("superAdmin", "user"),
  async (req, res) => {
    const { query, page = 1, limit = 10 } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Query parameter is required." });
    }

    try {
      const results = await AITool.find({
        $or: [
          { productName: { $regex: query, $options: "i" } },
          { category: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } },
        ],
      })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

      const totalResults = await AITool.countDocuments({
        $or: [
          { productName: { $regex: query, $options: "i" } },
          { category: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } },
        ],
      });

      res.status(200).json({
        totalResults,
        totalPages: Math.ceil(totalResults / limit),
        currentPage: parseInt(page),
        results,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error fetching search results",
        error: error.message,
      });
    }
  }
);

// Filter Route (accessible by both 'superAdmin' and 'user')
router.get(
  "/filter",
  // authenticateToken,
  // authorizeRoles("superAdmin", "user"),
  async (req, res) => {
    const { category } = req.query;

    if (!category) {
      return res
        .status(400)
        .json({ message: "Category parameter is required." });
    }

    try {
      const filteredTools = await AITool.find({
        category: { $regex: category, $options: "i" },
      });

      if (filteredTools.length === 0) {
        return res
          .status(404)
          .json({ message: "No tools found for this category." });
      }

      res.status(200).json(filteredTools);
    } catch (error) {
      res.status(500).json({
        message: "Error fetching filtered tools",
        error: error.message,
      });
    }
  }
);

module.exports = router;
