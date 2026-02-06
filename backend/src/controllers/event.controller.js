const User = require("../models/User");
const Event = require("../models/Event");
const Registration = require("../models/Registration");
const jwt = require("jsonwebtoken");
const translateText = require("../services/lingoTranslate");

// Get only approved events (for students/public)
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.aggregate([
      { $match: { status: "approved" } },
      {
        $lookup: {
          from: "registrations",
          let: { eventId: "$_id" },
          pipeline: [
            { $match: { $expr: { $and: [
              { $eq: ["$eventId", "$$eventId"] },
              { $eq: ["$status", "registered"] }
            ] } } }
          ],
          as: "registrations"
        }
      },
      {
        $addFields: {
          registeredCount: { $size: "$registrations" }
        }
      },
      { $project: { registrations: 0 } },
      { $sort: { date: 1 } }
    ]);
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

    const { description } = req.body;

    // Translate description
    const [hi, mr, ta] = await Promise.all([
      translateText(description, "hi"),
      translateText(description, "mr"),
      translateText(description, "ta"),
    ]);

    const event = await Event.create({
      ...req.body,
      description: {
        en: description,
        hi,
        mr,
        ta,
      },
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
    
    // Get registration count
    const registeredCount = await Registration.countDocuments({ eventId: event._id, status: "registered" });

    res.json({
      ...event._doc,
      registeredCount,
      seatsAvailable: Math.max(0, (event.totalSeats || 100) - registeredCount)
    });
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

// Get stats for organizer dashboard
exports.getOrganizerStats = async (req, res) => {
  try {
    const counts = await Event.aggregate([
      { $match: { organizerId: new (require("mongoose").Types.ObjectId)(req.user.id) } },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    const stats = {
      pending: 0,
      approved: 0,
      rejected: 0,
      total: 0
    };

    counts.forEach(item => {
      if (stats.hasOwnProperty(item._id)) {
        stats[item._id] = item.count;
      }
      stats.total += item.count;
    });

    res.json(stats);
  } catch (error) {
    console.error("Error fetching organizer stats:", error);
    res.status(500).json({ error: "Failed to fetch dashboard stats" });
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

    // Re-translate if description changed
    if (req.body.description && req.body.description !== event.description.en) {
      const [hi, mr, ta] = await Promise.all([
        translateText(req.body.description, "hi"),
        translateText(req.body.description, "mr"),
        translateText(req.body.description, "ta"),
      ]);
      updatedData.description = {
        en: req.body.description,
        hi,
        mr,
        ta,
      };
    }

    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    res.json({ message: "Event resubmitted successfully", event: updatedEvent });
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ error: "Failed to update event" });
  }
};
