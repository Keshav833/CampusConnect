const Registration = require("../models/Registration");
const Event = require("../models/Event");
const Notification = require("../models/Notification");

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

    const registration = await Registration.create({
      studentId,
      eventId,
      status: "registered"
    });

    // Create notification for student
    const notification = await Notification.create({
      userId: studentId,
      title: "Registration Confirmed",
      message: `You registered for ${event.title}`,
      type: "registration",
    });

    // Emit live via socket
    if (global.io) {
      global.io.to(studentId.toString()).emit("notification", notification);
    }

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
    const studentId = new (require("mongoose").Types.ObjectId)(req.user.id);
    
    const registrations = await Registration.aggregate([
      { $match: { studentId } },
      {
        $lookup: {
          from: "events",
          localField: "eventId",
          foreignField: "_id",
          as: "event"
        }
      },
      { $unwind: "$event" },
      {
        $lookup: {
          from: "registrations",
          localField: "eventId",
          foreignField: "eventId",
          as: "eventRegistrations"
        }
      },
      {
        $addFields: {
          registeredCount: {
            $size: {
              $filter: {
                input: "$eventRegistrations",
                as: "reg",
                cond: { $eq: ["$$reg.status", "registered"] }
              }
            }
          }
        }
      },
      {
        $project: {
          registrationId: "$_id",
          status: 1,
          registeredAt: 1,
          registeredCount: 1,
          title: "$event.title",
          description: "$event.description",
          category: "$event.category",
          date: "$event.date",
          time: "$event.time",
          venue: "$event.venue",
          image: "$event.image",
          organizerName: "$event.organizerName",
          totalSeats: "$event.totalSeats",
          eventId: "$event._id"
        }
      },
      { $sort: { registeredAt: -1 } }
    ]);

    res.json(registrations);
  } catch (error) {
    console.error("Error fetching my registrations:", error);
    res.status(500).json({ message: "Failed to fetch registrations" });
  }
};
