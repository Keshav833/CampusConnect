const Registration = require("../models/Registration");
const Event = require("../models/Event");
const Notification = require("../models/Notification");

// Register For Event
exports.registerForEvent = async (req, res) => {
  try {
    const { eventId } = req.body;
    const studentId = req.user.id;

    if (!eventId) {
      return res.status(400).json({ message: "Event ID is required" });
    }

    // 1️⃣ Check event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // 2️⃣ Check approval
    if (event.status !== "approved") {
      return res.status(403).json({ message: "Event not open for registration" });
    }

    // 3️⃣ Prevent duplicate registration (Explicit Check)
    const existing = await Registration.findOne({
      studentId,
      eventId,
    });

    if (existing) {
      return res.status(400).json({ message: "You are already registered for this event" });
    }

    // 4️⃣ Check capacity
    const registeredCount = await Registration.countDocuments({ eventId, status: "registered" });
    if (event.totalSeats && registeredCount >= event.totalSeats) {
        return res.status(400).json({ message: "Event is full" });
    }

    // 5️⃣ Create Registration
    const registration = await Registration.create({
      studentId,
      eventId,
      status: "registered"
    });

    // 6️⃣ Create Notification
    const eventTitle = typeof event.title === 'object' ? (event.title.en || Object.values(event.title)[0]) : (event.title || 'Unknown Event');
    
    const notification = await Notification.create({
      userId: studentId,
      title: "Registration Confirmed",
      message: `You registered for ${eventTitle}`,
      type: "registration",
    });

    // 7️⃣ Socket Emit
    if (global.io) {
      global.io.to(studentId.toString()).emit("notification", notification);
    }

    res.status(201).json({
      message: "Registration successful",
      registration,
    });
  } catch (err) {
    console.error("Detailed Registration Error Log:", err);

    // Duplicate key error (code 11000)
    if (err.code === 11000) {
      return res.status(400).json({ message: "You are already registered for this event" });
    }

    if (err.name === 'CastError') {
      return res.status(400).json({ message: "Invalid ID format provided" });
    }

    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: "Validation failed", details: err.message });
    }

    res.status(500).json({ 
      message: "An internal server error occurred during registration", 
      error: err.message 
    });
  }
};

// Check registration status for a specific event
exports.checkRegistrationStatus = async (req, res) => {
  try {
    const mongoose = require("mongoose");
    const eventId = new mongoose.Types.ObjectId(req.params.eventId);
    const studentId = new mongoose.Types.ObjectId(req.user.id);

    const registration = await Registration.findOne({ studentId, eventId });
    
    // Diagnostic logging
    console.log(`Checking registration: Student[${studentId}] Event[${eventId}] -> ${!!registration}`);
    
    res.json({ registered: !!registration });
  } catch (error) {
    console.error("Status check error:", error);
    if (error.name === 'CastError' || error.message.includes("ObjectId")) {
      return res.json({ registered: false });
    }
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
          startDate: "$event.startDate",
          endDate: "$event.endDate",
          date: "$event.date",
          time: "$event.time",
          endTime: "$event.endTime",
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
    res.status(500).json({ message: "Failed to fetch registrations", error: error.message });
  }
};
