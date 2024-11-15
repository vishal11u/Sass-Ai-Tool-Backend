const express = require("express");
const User = require("../models/Users");
const AITool = require("../models/AiToolCard");
const Contact = require("../models/Contact");

const router = express.Router();

// Utility functions to calculate timeframes
const getStartOfDay = () => new Date().setHours(0, 0, 0, 0);
const getStartOfWeek = () => {
  const now = new Date();
  const firstDay = now.getDate() - now.getDay();
  return new Date(now.setDate(firstDay)).setHours(0, 0, 0, 0);
};
const getStartOfMonth = () =>
  new Date(new Date().getFullYear(), new Date().getMonth(), 1);

// Get Login/Signup Count by Day, Week, Month
router.get("/login-signup/:timeframe", async (req, res) => {
  const { timeframe } = req.params;
  let startDate;

  switch (timeframe) {
    case "day":
      startDate = new Date(getStartOfDay());
      break;
    case "week":
      startDate = new Date(getStartOfWeek());
      break;
    case "month":
      startDate = new Date(getStartOfMonth());
      break;
    default:
      return res.status(400).json({ message: "Invalid timeframe" });
  }

  try {
    const signupCount = await User.countDocuments({
      signupDate: { $gte: startDate },
    });
    const loginCount = await User.countDocuments({
      lastLoginDate: { $gte: startDate },
    });

    res.json({ signupCount, loginCount });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching login/signup data", error });
  }
});

// Get AI Tools Created by Day, Week, Month
router.get("/ai-tools/:timeframe", async (req, res) => {
  const { timeframe } = req.params;
  let startDate;

  switch (timeframe) {
    case "day":
      startDate = new Date(getStartOfDay());
      break;
    case "week":
      startDate = new Date(getStartOfWeek());
      break;
    case "month":
      startDate = new Date(getStartOfMonth());
      break;
    default:
      return res.status(400).json({ message: "Invalid timeframe" });
  }

  try {
    const aiToolCount = await AITool.countDocuments({
      createdAt: { $gte: startDate },
    });
    const aiTools = await AITool.find({ createdAt: { $gte: startDate } });

    res.json({ aiToolCount, aiTools });
  } catch (error) {
    res.status(500).json({ message: "Error fetching AI tool data", error });
  }
});

// Get Contact Submissions by Day, Week, Month
router.get("/contacts/:timeframe", async (req, res) => {
  const { timeframe } = req.params;
  let startDate;

  switch (timeframe) {
    case "day":
      startDate = new Date(getStartOfDay());
      break;
    case "week":
      startDate = new Date(getStartOfWeek());
      break;
    case "month":
      startDate = new Date(getStartOfMonth());
      break;
    default:
      return res.status(400).json({ message: "Invalid timeframe" });
  }

  try {
    const contacts = await Contact.find({ createdAt: { $gte: startDate } });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching contacts", error });
  }
});

module.exports = router;
