const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");
const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

// All routes here are protected and require admin role
router.use(authMiddleware);
router.use(roleMiddleware("admin"));

router.get("/stats", adminController.getDashboardStats);
router.get("/events/pending", adminController.getPendingEvents);
router.get("/all", adminController.getAllEvents);
router.get("/organizers", adminController.getOrganizers);
router.get("/event/:eventId", adminController.getEventDetail);
router.patch("/events/:eventId/approve", adminController.approveEvent);
router.patch("/events/:eventId/reject", adminController.rejectEvent);

module.exports = router;
