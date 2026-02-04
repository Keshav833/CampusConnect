const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");
const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

// All routes here are protected and require admin role
router.use(authMiddleware);
router.use(roleMiddleware("admin"));

router.get("/stats", adminController.getDashboardStats);
router.get("/pending", adminController.getPendingEvents);
router.get("/all", adminController.getAllEvents);
router.get("/organizers", adminController.getOrganizers);
router.get("/event/:id", adminController.getEventDetail);
router.patch("/approve/:id", adminController.approveEvent);
router.patch("/reject/:id", adminController.rejectEvent);

module.exports = router;
