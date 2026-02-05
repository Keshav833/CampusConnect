const Event = require("../models/Event");
const User = require("../models/User");
const Notification = require("../models/Notification");

exports.getDashboardStats = async (req, res) => {
  try {
    const pendingEvents = await Event.countDocuments({ status: "pending" });
    const approvedEvents = await Event.countDocuments({ status: "approved" });
    const rejectedEvents = await Event.countDocuments({ status: "rejected" });
    const totalOrganizers = await User.countDocuments({ role: "organizer" });

    res.json({
      pendingEvents,
      approvedEvents,
      rejectedEvents,
      totalOrganizers,
    });
  } catch (error) {
    console.error("Error in getDashboardStats:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getPendingEvents = async (req, res) => {
  try {
    const events = await Event.find({ status: "pending" })
      .populate("organizerId", "name organization")
      .sort({ createdAt: -1 });
    res.json(events);
  } catch (error) {
    console.error("Error in getPendingEvents:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getAllEvents = async (req, res) => {
  try {
    const { status, category } = req.query;
    let query = {};
    if (status) query.status = status;
    if (category) query.category = category;

    const events = await Event.find(query)
      .populate("organizerId", "name organization")
      .sort({ createdAt: -1 });
    res.json(events);
  } catch (error) {
    console.error("Error in getAllEvents:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getOrganizers = async (req, res) => {
  try {
    const organizers = await User.find({ role: "organizer" }).select("name organization email");
    
    const organizersWithStats = await Promise.all(
      organizers.map(async (org) => {
        const approved = await Event.countDocuments({ organizerId: org._id, status: "approved" });
        const rejected = await Event.countDocuments({ organizerId: org._id, status: "rejected" });
        const total = await Event.countDocuments({ organizerId: org._id });
        
        return {
          ...org.toObject(),
          approvedCount: approved,
          rejectedCount: rejected,
          totalEvents: total
        };
      })
    );

    res.json(organizersWithStats);
  } catch (error) {
    console.error("Error in getOrganizers:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.approveEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    event.status = "approved";
    await event.save();

    // Create notification for organizer
    const notification = await Notification.create({
      userId: event.organizerId,
      title: "Event Approved",
      message: `${event.title} is now live`,
      type: "approval",
    });

    // Emit live via socket
    if (global.io) {
      global.io.to(event.organizerId.toString()).emit("notification", notification);
    }

    res.json({ message: "Event approved" });
  } catch (error) {
    console.error("Error in approveEvent:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.rejectEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    event.status = "rejected";
    await event.save();

    // Create notification for organizer
    const notification = await Notification.create({
      userId: event.organizerId,
      title: "Event Rejected",
      message: `Your event ${event.title} was rejected`,
      type: "rejection",
    });

    // Emit live via socket
    if (global.io) {
      global.io.to(event.organizerId.toString()).emit("notification", notification);
    }

    res.json({ message: "Event rejected" });
  } catch (error) {
    console.error("Error in rejectEvent:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getEventDetail = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId).populate("organizerId", "name organization email");
    if (!event) return res.status(404).json({ error: "Event not found" });
    res.json(event);
  } catch (error) {
    console.error("Error in getEventDetail:", error);
    res.status(500).json({ error: error.message });
  }
};
