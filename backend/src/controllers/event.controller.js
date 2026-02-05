const User = require("../models/User");
const Event = require("../models/Event");
const Registration = require("../models/Registration");
const jwt = require("jsonwebtoken");

// Get only approved events (for students/public)
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find({ status: "approved" }).sort({ date: 1 });
    res.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Failed to fetch events" });
  }
};

// Create new event (Organizer only)
exports.createEvent = async (req, res) => {
  try {
    const organizer = await User.findById(req.user.id);
    if (!organizer) return res.status(404).json({ error: "User not found" });

    const event = await Event.create({
      ...req.body,
      organizerId: organizer._id,
      organizerName: organizer.name,
      status: "pending",
    });

    res.status(201).json({ 
      message: "Event submitted for admin approval", 
      event 
    });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ error: "Failed to create event" });
  }
};

// Get single event details
exports.getEventDetail = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });
    
    // Check if user is registered (optional auth)
    let isRegistered = false;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const registration = await Registration.findOne({ userId: decoded.id, eventId: event._id });
        if (registration) isRegistered = true;
      } catch (err) {
        // Token might be expired or invalid, ignore for public view
      }
    }

    // Get registration count
    const registeredCount = await Registration.countDocuments({ eventId: event._id, status: "registered" });

    res.json({
      ...event._doc,
      isRegistered,
      registeredCount,
      seatsAvailable: Math.max(0, (event.totalSeats || 100) - registeredCount)
    });
  } catch (error) {
    console.error("Error fetching event details:", error);
    res.status(500).json({ error: "Failed to fetch event details" });
  }
};

// Register for an event
exports.registerForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });

    if (event.status !== "approved") {
      return res.status(400).json({ error: "Registration is not open for this event" });
    }

    // Check if already registered
    const existingRegistration = await Registration.findOne({
      userId: req.user.id,
      eventId: event._id
    });

    if (existingRegistration) {
      return res.status(400).json({ error: "You are already registered for this event" });
    }

    // Check capacity
    const registeredCount = await Registration.countDocuments({ eventId: event._id, status: "registered" });
    if (registeredCount >= (event.totalSeats || 100)) {
      return res.status(400).json({ error: "Event is full" });
    }

    const registration = await Registration.create({
      userId: req.user.id,
      eventId: event._id,
      status: "registered"
    });

    res.status(201).json({
      message: "Successfully registered!",
      registration
    });
  } catch (error) {
    console.error("Error registering for event:", error);
    res.status(500).json({ error: "Failed to register for event" });
  }
};

// Get events for the logged-in organizer
exports.getOrganizerEvents = async (req, res) => {
  try {
    const events = await Event.find({ organizerId: req.user.id }).sort({ createdAt: -1 });
    res.json(events);
  } catch (error) {
    console.error("Error fetching organizer events:", error);
    res.status(500).json({ error: "Failed to fetch your events" });
  }
};

// Update event (Organizer only, restricted if pending)
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });

    // Ensure only the organizer can update
    if (event.organizerId.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized to update this event" });
    }

    // Prevent editing if pending
    if (event.status === "pending") {
      return res.status(400).json({ error: "Cannot edit an event while it is pending approval" });
    }

    // If updated, set status back to pending
    const updatedData = {
      ...req.body,
      status: "pending",
      rejectionReason: null // Clear reason on resubmission
    };

    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    res.json({ message: "Event resubmitted successfully", event: updatedEvent });
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ error: "Failed to update event" });
  }
};

// Get registrations for the logged-in student
exports.getStudentRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({ userId: req.user.id })
      .populate("eventId")
      .sort({ createdAt: -1 });

    // Format the response and filter out if event doesn't exist anymore
    const formatted = registrations
      .filter(reg => reg.eventId)
      .map(reg => ({
        registrationId: reg._id,
        status: reg.status,
        appliedAt: reg.createdAt,
        ...reg.eventId._doc
      }));

    res.json(formatted);
  } catch (error) {
    console.error("Error fetching student registrations:", error);
    res.status(500).json({ error: "Failed to fetch your registrations" });
  }
};
