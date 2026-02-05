const Registration = require("../models/Registration");
const Event = require("../models/Event");

// Register For Event
exports.registerForEvent = async (req, res) => {
  try {
    const { eventId } = req.body;
    const studentId = req.user.id;

    // 1️⃣ Check event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // 2️⃣ Check approval
    if (event.status !== "approved") {
      return res.status(403).json({ message: "Event not open for registration" });
    }

    // 3️⃣ Prevent duplicate registration
    const existing = await Registration.findOne({
      studentId,
      eventId,
    });

    if (existing) {
      return res.status(400).json({ message: "Already registered" });
    }

    // Optional: Check capacity if totalSeats is defined
    const registeredCount = await Registration.countDocuments({ eventId, status: "registered" });
    if (event.totalSeats && registeredCount >= event.totalSeats) {
        // Future: Handle waitlist here
        return res.status(400).json({ message: "Event is full" });
    }

    // 4️⃣ Create registration
    const registration = await Registration.create({
      studentId,
      eventId,
      status: "registered"
    });

    res.status(201).json({
      message: "Registration successful",
      registration,
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Registration failed" });
  }
};

// Check registration status for a specific event
exports.checkRegistrationStatus = async (req, res) => {
  try {
    const { eventId } = req.params;
    const studentId = req.user.id;

    const registration = await Registration.findOne({ studentId, eventId });
    res.json({ registered: !!registration });
  } catch (error) {
    res.status(500).json({ message: "Status check failed" });
  }
};

// Get all registrations for logged in student
exports.getMyRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({ studentId: req.user.id })
      .populate("eventId")
      .sort({ registeredAt: -1 });

    const formatted = registrations
      .filter(reg => reg.eventId)
      .map(reg => ({
        registrationId: reg._id,
        status: reg.status,
        registeredAt: reg.registeredAt,
        ...reg.eventId._doc
      }));

    res.json(formatted);
  } catch (error) {
    console.error("Error fetching my registrations:", error);
    res.status(500).json({ message: "Failed to fetch registrations" });
  }
};
