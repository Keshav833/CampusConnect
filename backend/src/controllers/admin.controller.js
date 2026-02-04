const Event = require("../models/Event");
const User = require("../models/User");

exports.getDashboardStats = async (req, res) => {
  try {
    const pendingEvents = await Event.countDocuments({ status: "Pending" });
    const approvedEvents = await Event.countDocuments({ status: "Approved" });
    const rejectedEvents = await Event.countDocuments({ status: "Rejected" });
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
    const events = await Event.find({ status: "Pending" })
      .populate("organizer", "name organization")
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
      .populate("organizer", "name organization")
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
        const approved = await Event.countDocuments({ organizer: org._id, status: "Approved" });
        const rejected = await Event.countDocuments({ organizer: org._id, status: "Rejected" });
        const total = await Event.countDocuments({ organizer: org._id });
        
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
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { status: "Approved" },
      { new: true }
    );
    if (!event) return res.status(404).json({ error: "Event not found" });
    res.json(event);
  } catch (error) {
    console.error("Error in approveEvent:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.rejectEvent = async (req, res) => {
  try {
    const { reason } = req.body;
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { status: "Rejected", rejectionReason: reason },
      { new: true }
    );
    if (!event) return res.status(404).json({ error: "Event not found" });
    res.json(event);
  } catch (error) {
    console.error("Error in rejectEvent:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getEventDetail = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate("organizer", "name organization email");
    if (!event) return res.status(404).json({ error: "Event not found" });
    res.json(event);
  } catch (error) {
    console.error("Error in getEventDetail:", error);
    res.status(500).json({ error: error.message });
  }
};
