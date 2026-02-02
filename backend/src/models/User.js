const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,

  role: {
    type: String,
    enum: ["student", "organizer", "admin"],
    required: true,
  },

  // Student specific fields
  regNo: String,
  branch: String,
  year: String,

  // Organizer specific fields
  organization: String,
  orgRole: String,

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
