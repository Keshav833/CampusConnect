const express = require("express");
const router = express.Router();
const ChatMessage = require("../models/ChatMessage");
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
};

// GET /api/chat/:eventId — fetch last 100 messages
router.get("/:eventId", async (req, res) => {
  try {
    const messages = await ChatMessage.find({ eventId: req.params.eventId })
      .sort({ createdAt: 1 })
      .limit(100);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// POST /api/chat/:eventId — send a message
router.post("/:eventId", authMiddleware, async (req, res) => {
  const { text } = req.body;
  if (!text || !text.trim()) return res.status(400).json({ error: "Message cannot be empty" });

  try {
    const message = await ChatMessage.create({
      eventId: req.params.eventId,
      senderId: req.user.id,
      senderName: req.user.name || req.user.email,
      senderRole: req.user.role,
      text: text.trim(),
    });

    // Broadcast to all clients in the event room via Socket.IO
    if (global.io) {
      global.io.to(`event-chat-${req.params.eventId}`).emit("chat-message", message);
    }

    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: "Failed to send message" });
  }
});

module.exports = router;
