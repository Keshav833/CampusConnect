const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// GOOGLE AUTH
exports.googleAuth = async (req, res) => {
  try {
    const { token: googleToken } = req.body;
    const idToken = googleToken; // Support both names for safety

    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, sub: googleId } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      // New User: Return needsRole flag and Google Info
      return res.status(200).json({
        needsRole: true,
        user: { email, name, googleId },
      });
    }

    // Existing User: Log them in
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const userResponse = { ...user._doc };
    delete userResponse.password;

    res.json({
      token,
      user: userResponse,
      role: user.role,
    });
  } catch (error) {
    console.error("Google Auth error:", error);
    res.status(500).json({ error: "Authentication failed" });
  }
};

// SIGNUP
exports.signup = async (req, res) => {
  try {
    const { name, email, password, role, regNo, branch, year, organization, orgRole } = req.body;

    console.log("Signup attempt:", { name, email, role });

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Handle OAuth signup if no password is provided
    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      regNo: role === "student" ? regNo : null,
      branch: role === "student" ? branch : null,
      year: role === "student" ? year : null,
      organization: role === "organizer" ? organization : null,
      orgRole: role === "organizer" ? orgRole : null,
    });

    // If Google Auth signup, return token immediately
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({ 
      message: "Account created", 
      token,
      user: user
    });
  } catch (error) {
    console.error("Signup error details:", error);
    res.status(500).json({ error: error.message });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    console.log("Login attempt:", { email, role });

    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ error: "User not found" });

    // Ensure the role matches what they selected on frontend
    if (user.role !== role) {
      return res.status(403).json({ error: `Account exists but role is ${user.role}, not ${role}` });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Return user without password
    const userResponse = { ...user._doc };
    delete userResponse.password;

    res.json({ 
      token, 
      user: userResponse,
      role: user.role 
    });
  } catch (error) {
    console.error("Login error details:", error);
    res.status(500).json({ error: error.message });
  }
};
