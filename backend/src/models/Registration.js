const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true
  },
  status: {
    type: String,
    enum: ["registered", "waitlist"],
    default: "registered"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure a user can only register once for an event
registrationSchema.index({ userId: 1, eventId: 1 }, { unique: true });

module.exports = mongoose.model("Registration", registrationSchema);
