const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");
const { 
  registerForEvent, 
  checkRegistration, 
  getMyRegistrations 
} = require("../controllers/registration.controller");

// All registration routes are protected and for students
router.use(authMiddleware);
router.use(roleMiddleware("student"));

router.post("/", registerForEvent);
router.get("/my", getMyRegistrations);
router.get("/:eventId/status", checkRegistrationStatus);

module.exports = router;
