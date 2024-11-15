const jwt = require("jsonwebtoken");
const User = require("../models/Users");

// Middleware to authenticate user by token
const authenticateToken = async (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; // Expect Bearer token

  if (!token)
    return res.status(401).json({ message: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify JWT

    // Attach the user to the request object for later use
    req.user = await User.findById(decoded.id).select("-password");
    next(); // Proceed to the next middleware/route handler
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

// Middleware to check if the user has the required role
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Access denied: insufficient permissions" });
    }
    next(); // Proceed if user has the required role
  };
};

module.exports = { authenticateToken, authorizeRoles };
