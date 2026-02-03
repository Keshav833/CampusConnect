const express = require("express");
const router = express.Router();
const { signup, login, googleAuth, githubAuth, githubCallback } = require("../controllers/auth.controller");

router.post("/signup", signup);
router.post("/login", login);
router.post("/google", googleAuth);

// GitHub OAuth
router.get("/github", githubAuth);
router.get("/github/callback", githubCallback);

module.exports = router;
