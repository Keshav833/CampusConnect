const express = require("express");
const router = express.Router();
const { getEvents, createEvent, getOrganizerEvents, getEventDetail, updateEvent, getOrganizerStats, getEventParticipants } = require("../controllers/event.controller");
const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

// Public routes
// Organizer routes (Protected)
router.post("/", authMiddleware, roleMiddleware("organizer"), createEvent);
router.get("/my-events", authMiddleware, roleMiddleware("organizer"), getOrganizerEvents);
router.get("/organizer/stats", authMiddleware, roleMiddleware("organizer"), getOrganizerStats);
router.put("/:id", authMiddleware, roleMiddleware("organizer"), updateEvent);

// Public / General routes
router.get("/", getEvents);
router.get("/:id/participants", authMiddleware, roleMiddleware("organizer"), getEventParticipants);
router.get("/:id", getEventDetail);

module.exports = router;
