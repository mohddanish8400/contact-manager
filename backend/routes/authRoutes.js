const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// =========================
// SIGNUP
// =========================
router.post("/signup", async (req, res) => {
  try {
    const { name, username, password, email, address } = req.body;

    // Check all fields
    if (!name || !username || !password || !email || !address) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Check if username already exists
    const existingUsername = await User.findOne({ username });

    if (existingUsername) {
      return res.status(400).json({
        message: "Username already exists",
      });
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ email });

    if (existingEmail) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = new User({
      name,
      username,
      password: hashedPassword,
      email,
      address,
      role: "user",
    });

    await newUser.save();

    res.status(201).json({
      message: "Signup successful",
    });
  } catch (error) {
    console.error("Signup error:", error);

    res.status(500).json({
      message: "Server error during signup",
    });
  }
});

// =========================
// LOGIN
// =========================
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check fields
    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required",
      });
    }

    // Find user
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({
        message: "Invalid username or password",
      });
    }

    // Compare password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid username or password",
      });
    }

    // Create JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      message: "Server error during login",
    });
  }
});

module.exports = router;