// routes/auth.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/Users");
const Notification = require("../models/Notification");

const router = express.Router();

// Signup Route
router.post("/signup", async (req, res) => {
  const { username, password, confirmPassword, role } = req.body;

  // Validate passwords
  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user with a role
    const user = new User({ username, password: hashedPassword, role });
    await user.save();

    // Create notification for signup
    const notification = new Notification({
      userId: user._id,
      type: "signup",
      message: `User ${username} has signed up as ${role}.`,
    });
    await notification.save();

    res
      .status(201)
      .json({ message: "User created successfully", role: user.role });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Update last login date
    user.lastLoginDate = new Date();
    await user.save();

    // Generate JWT token with user ID and role
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Create notification for login
    const notification = new Notification({
      userId: user._id,
      type: "login",
      message: `User ${username} logged in as ${user.role}.`,
    });
    await notification.save();

    res.status(200).json({ token, role: user.role });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

router.get("/users/list", async (req, res) => {
  try {
    // Find all relevant notifications and populate user data
    const notifications = await Notification.find({
      type: { $in: ["signup", "login"] },
    }).populate("userId", "username role lastLoginDate isActive");

    // Use a Map to ensure each user appears only once
    const userMap = new Map();

    notifications?.forEach((notification) => {
      const userId = notification.userId?._id;

      // If user is already in the map, skip; otherwise, add them
      if (!userMap.has(userId)) {
        userMap.set(userId, {
          id: userId,
          username: notification.userId.username,
          role: notification.userId.role,
          isActive: notification.userId.isActive,
          lastLoginDate: notification.userId.lastLoginDate,
        });
      }
    });

    // Convert map values to an array
    const userList = Array.from(userMap.values());

    res.status(200).json({ users: userList });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Update User Route (including activation and deactivation)
router.put("/update/:id", async (req, res) => {
  const { username, password, role, isActive } = req.body;
  const { id } = req.params;

  try {
    // Find the user by ID
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the fields if provided
    if (username) user.username = username;
    if (password) user.password = await bcrypt.hash(password, 10); // Hash the new password
    if (role) user.role = role;
    if (typeof isActive === "boolean") user.isActive = isActive; // Toggle isActive if provided

    // Save the updated user details
    await user.save();

    // Create notification for update or activation/deactivation
    const notificationType =
      typeof isActive === "boolean"
        ? isActive
          ? "activate"
          : "deactivate"
        : "update";
    const notification = new Notification({
      userId: user._id,
      type: notificationType,
      message: `User ${user.username}'s details have been ${
        notificationType === "update"
          ? "updated"
          : isActive
          ? "activated"
          : "deactivated"
      }.`,
    });
    await notification.save();

    res.status(200).json({
      message: `User ${
        notificationType === "update"
          ? "updated"
          : isActive
          ? "activated"
          : "deactivated"
      } successfully`,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Delete User Route
router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Find the user by ID
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete the user
    await User.findByIdAndDelete(id);

    // Create notification for deletion
    const notification = new Notification({
      userId: id,
      type: "delete",
      message: `User ${user.username} has been deleted.`,
    });
    await notification.save();

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
