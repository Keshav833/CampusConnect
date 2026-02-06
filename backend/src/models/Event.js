const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: mongoose.Schema.Types.Mixed, required: true },
  category: { 
    type: String, 
    required: true,
    enum: ["Tech", "Cultural", "Sports", "Workshops", "Hackathons", "Clubs"]
  },
  date: { type: String, required: true },
  time: { type: String, required: true },
  venue: { type: String, required: true },
  image: { type: String },
  organizerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",
    required: true
  },
  organizerName: String,
  status: { 
    type: String, 
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },
  rejectionReason: { type: String, default: null },
  totalSeats: { type: Number, default: 100 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Event", eventSchema);
