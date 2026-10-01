const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("../models/User");

const createDemoUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);

    console.log("Connected to MongoDB");

    // Check if demo user already exists
    const existingUser = await User.findOne({
      username: "admin",
    });

    if (existingUser) {
      console.log("Demo user already exists.");
      await mongoose.connection.close();
      return;
    }

    // Hash demo password
    const hashedPassword = await bcrypt.hash("admin123", 10);

    // Create demo user
    const demoUser = new User({
      name: "Demo Admin",
      username: "admin",
      password: hashedPassword,
      email: "demo@example.com",
      address: "Demo Account",
      role: "demo",
    });

    await demoUser.save();

    console.log("Demo user created successfully.");

    await mongoose.connection.close();
  } catch (error) {
    console.error("Error creating demo user:", error);
    await mongoose.connection.close();
  }
};

createDemoUser();