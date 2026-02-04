const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    required: true,
    enum: ["Tech", "Cultural", "Sports", "Workshops", "Hackathons", "Clubs"]
  },
  date: { type: String, required: true },
  time: { type: String },
  location: { type: String, required: true },
  image: { type: String },
  organizer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",
    required: true
  },
  status: { 
    type: String, 
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending"
  },
  rejectionReason: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Event", eventSchema);
