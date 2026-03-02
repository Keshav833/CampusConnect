const express = require("express");
const router = express.Router();
const ChatMessage = require("../models/ChatMessage");
const User = require("../models/User");
const authMiddleware = require("../middleware/auth.middleware");

// GET /api/chat/:eventId — fetch last 100 messages
router.get("/:eventId", async (req, res) => {
  try {
    const messages = await ChatMessage.find({ eventId: req.params.eventId })
      .sort({ createdAt: 1 })
      .limit(100);
    res.json(messages);
  } catch (err) {
    console.error("Error fetching chat messages:", err);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// POST /api/chat/:eventId — send a message
router.post("/:eventId", authMiddleware, async (req, res) => {
  const { text } = req.body;
  if (!text || !text.trim()) return res.status(400).json({ error: "Message cannot be empty" });

  try {
    // If name is missing from JWT, fetch it from DB
    let name = req.user.name || req.user.email;
    if (!name && req.user.id) {
      const user = await User.findById(req.user.id);
      if (user) {
        name = user.name || user.email;
      }
    }

    const message = await ChatMessage.create({
      eventId: req.params.eventId,
      senderId: req.user.id,
      senderName: name || "Anonymous User",
      senderRole: req.user.role || "student",
      text: text.trim(),
    });

    // Broadcast to all clients in the event room via Socket.IO
    if (global.io) {
      global.io.to(`event-chat-${req.params.eventId}`).emit("chat-message", message);
    }

    res.status(201).json(message);
  } catch (err) {
    console.error("Chat message creation error:", err);
    res.status(500).json({ error: "Failed to send message", details: err.message });
  }
});

module.exports = router;
