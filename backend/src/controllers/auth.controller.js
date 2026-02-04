const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const axios = require("axios");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const checkAdminRole = (email, requestedRole) => {
  const adminEmails = process.env.ADMIN_EMAILS 
    ? process.env.ADMIN_EMAILS.split(',').map(e => e.trim().toLowerCase()) 
    : [];
  if (email && adminEmails.includes(email.toLowerCase())) {
    return 'admin';
  }
  // Prevent manual 'admin' role request if not whitelisted
  return requestedRole === 'admin' ? 'student' : requestedRole;
};

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
    user.role = checkAdminRole(user.email, user.role);
    await user.save();

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

// GITHUB AUTH - Redirect to GitHub
exports.githubAuth = (req, res) => {
  const rootUrl = "https://github.com/login/oauth/authorize";
  const options = {
    client_id: process.env.GITHUB_CLIENT_ID,
    redirect_uri: process.env.GITHUB_CALLBACK_URL,
    scope: "user:email",
    state: "github_auth_state", // In production, use a dynamic secure state
  };

  const qs = new URLSearchParams(options);
  res.redirect(`${rootUrl}?${qs.toString()}`);
};

// GITHUB CALLBACK - Handle GitHub response
exports.githubCallback = async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.redirect(`${process.env.FRONTEND_URL}/login?error=No code provided`);
  }

  try {
    // 1. Exchange code for access token
    const tokenResponse = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      { headers: { Accept: "application/json" } }
    );

    const accessToken = tokenResponse.data.access_token;

    if (!accessToken) {
      throw new Error("GitHub access token not found");
    }

    // 2. Fetch user profile
    const userRes = await axios.get("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const { login: username, name, id: githubId, avatar_url } = userRes.data;

    // 3. Fetch primary email
    const emailsRes = await axios.get("https://api.github.com/user/emails", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const primaryEmail = emailsRes.data.find((e) => e.primary && e.verified)?.email || emailsRes.data[0]?.email;

    if (!primaryEmail) {
      throw new Error("GitHub primary email not found");
    }

    // 4. Check if user exists
    let user = await User.findOne({ email: primaryEmail });

    if (!user) {
      // New User: Redirect to frontend role selection with temp info
      const tempUser = encodeURIComponent(JSON.stringify({ 
        email: primaryEmail, 
        name: name || username, 
        githubId 
      }));
      return res.redirect(`${process.env.FRONTEND_URL}/auth?tempUser=${tempUser}`);
    }

    // Existing User: Generate JWT and redirect to dashboard
    user.role = checkAdminRole(user.email, user.role);
    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Encode user data for frontend
    const userData = encodeURIComponent(JSON.stringify({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: avatar_url
      }
    }));

    res.redirect(`${process.env.FRONTEND_URL}/login?success=true&data=${userData}`);

  } catch (error) {
    console.error("GitHub Auth error:", error.message);
    res.redirect(`${process.env.FRONTEND_URL}/login?error=GitHub authentication failed`);
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
      role: checkAdminRole(email, role),
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
    let { email, password } = req.body;
    email = email?.trim();
    password = password?.trim();

    console.log("Login attempt:", { email });

    // MASTER ADMIN CHECK
    const masterEmail = process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(',')[0].trim() : null;
    const masterPassword = process.env.ADMIN_PASSWORD ? process.env.ADMIN_PASSWORD.trim() : null;

    console.log("Master check attempt:", { 
      inputEmail: email?.toLowerCase(), 
      masterEmail: masterEmail?.toLowerCase(),
      pwMatch: password === masterPassword,
      hasMasterPw: !!masterPassword
    });

    if (email && masterEmail && email.toLowerCase() === masterEmail.toLowerCase() && password === masterPassword && masterPassword) {
      console.log("Master admin bypass activated!");
      let user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        // Create system user if it doesn't exist
        user = await User.create({
          name: "System Admin",
          email: masterEmail,
          password: await bcrypt.hash(masterPassword, 10),
          role: "admin"
        });
      } else if (user.role !== 'admin') {
        user.role = 'admin';
        await user.save();
      }

      const token = jwt.sign(
        { id: user._id, role: 'admin' },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      return res.status(200).json({
        token,
        role: 'admin',
        user: { id: user._id, name: user.name, email: user.email, role: 'admin' }
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      console.log("Login failed: User not found", email);
      return res.status(400).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Login failed: Invalid password for", email);
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Check if user should be admin based on whitelist
    user.role = checkAdminRole(user.email, user.role);
    await user.save();

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
