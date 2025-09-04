// Load environment variables from .env
require("dotenv").config({ path: "./config/.env" });

const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/User"); // Import the User model

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON
app.use(express.json());

// ----------------- MongoDB Connection -----------------
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB Connected"))
.catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ----------------- CRUD Routes -----------------

// GET: Return all users
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST: Add a new user
app.post("/users", async (req, res) => {
  try {
    const newUser = new User(req.body); // Create a user from request body
    const savedUser = await newUser.save(); // Save to DB
    res.status(201).json(savedUser);      // Return saved user
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
// PUT: Update a user by ID
app.put("/users/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,   // ID from URL
      req.body,        // Updated fields
      { new: true }    // Return updated user
    );
    if (!updatedUser) return res.status(404).json({ message: "User not found" });
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE: Remove a user by ID
app.delete("/users/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted successfully", deletedUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------- Start Server -----------------
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));