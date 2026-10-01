const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config(); // this lets us use variables from our .env file

// Importing our routes file (we will create this next)
const contactRoutes = require("./routes/contactRoutes");
// for authentication(login,signup)
const authRoutes = require("./routes/authRoutes");

const app = express();

// ---------- Middlewares ----------
app.use(cors()); // allows our frontend (running on a different port) to talk to this backend
app.use(express.json()); // allows us to read JSON data sent in requests (req.body)

// ---------- Routes ----------
// Any request that starts with /api/contacts will be handled in contactRoutes.js
app.use("/api/contacts", contactRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Contact Manager API is running...");
});

// ---------- Connecting to MongoDB ----------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB successfully!");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB:", error);
  });

// ---------- Starting the server ----------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});