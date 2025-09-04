const mongoose = require("mongoose");

// Define a schema for User
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },      // User's name
  email: { type: String, required: true, unique: true }, // User's email
  age: { type: Number, required: true }        // User's age
});

// Export the model to use in server.js
module.exports = mongoose.model("User", userSchema);