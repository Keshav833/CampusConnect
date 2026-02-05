const express = require("express");
const router = express.Router();
const { getNotifications, markAsRead, markAllAsRead } = require("../controllers/notification.controller");
const authMiddleware = require("../middleware/auth.middleware");

// All notification routes require authentication
router.use(authMiddleware);

router.get("/", getNotifications);
router.patch("/:id/read", markAsRead);
router.patch("/read-all", markAllAsRead);

module.exports = router;
