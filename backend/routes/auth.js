const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User.js");

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ fullName, email, password: hashedPassword, role });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Login
// Login
// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Find user by email AND role
    const user = await User.findOne({ email, role });
    if (!user) 
      return res.status(400).json({ message: "User not registered with this role, please register or check credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) 
      return res.status(400).json({ message: "Incorrect password, please try again" });

    // ✅ FIXED: Now returning _id along with other user data
    res.json({ 
      _id: user._id,           // MongoDB's default ID field
      id: user._id.toString(), // Alternative string format
      name: user.fullName, 
      email: user.email,
      role: user.role 
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});



module.exports = router;
