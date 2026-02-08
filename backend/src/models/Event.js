const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: {
    en: { type: String, required: true },
    hi: String,
    bn: String,
    gu: String,
    mr: String,
    ta: String,
  },
  description: {
    en: { type: String, required: true },
    hi: String,
    bn: String,
    gu: String,
    mr: String,
    ta: String,
  },
  category: { 
    type: String, 
    required: true,
    enum: ["Tech", "Cultural", "Sports", "Workshops", "Hackathons", "Clubs"]
  },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  date: { type: String }, // Legacy field
  time: { type: String, required: true },
  endTime: { type: String },
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
