const User = require("../models/User");
const Event = require("../models/Event");

// Get only approved events (for students/public)
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find({ status: "approved" }).sort({ createdAt: -1 });
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
    
    // Optional: Only show if approved or if requester is the organizer/admin
    // For now, let's keep it simple as per user spec focus on "visible to students"
    res.json(event);
  } catch (error) {
    console.error("Error fetching event details:", error);
    res.status(500).json({ error: "Failed to fetch event details" });
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
