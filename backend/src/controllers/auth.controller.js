const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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

    const hashedPassword = await bcrypt.hash(password, 10);

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

    res.status(201).json({ message: "Account created", userId: user._id });
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
