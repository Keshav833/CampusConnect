const User = require("../models/User");
const Event = require("../models/Event");
const Registration = require("../models/Registration");
const jwt = require("jsonwebtoken");
const { translateEventText } = require("../services/translation.service");

// Get only approved events (for students/public)
exports.getEvents = async (req, res) => {
  try {
    const { lang = "en" } = req.query;

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
      { $sort: { startDate: 1, date: 1 } }
    ]);

    // Localize on the fly
    const localizedEvents = events.map(event => {
      const title = (typeof event.title === 'object' && event.title !== null)
        ? (event.title[lang] || event.title.en)
        : event.title;
        
      const description = (typeof event.description === 'object' && event.description !== null)
        ? (event.description[lang] || event.description.en)
        : event.description;
        
      return { ...event, title, description };
    });

    res.json(localizedEvents);
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

    const { title, description } = req.body;

    // 1️⃣ Translate title + description concurrently
    const [translatedTitle, translatedDescription] = await Promise.all([
      translateEventText(title),
      translateEventText(description)
    ]);

    // 2️⃣ Create event with multilingual content
    const event = await Event.create({
      ...req.body,
      date: req.body.startDate || req.body.date, // Sync legacy field
      title: {
          en: title,
          ...translatedTitle
      },
      description: {
          en: description,
          ...translatedDescription
      },
      organizerId: organizer._id,
      organizerName: organizer.name,
      status: "pending",
    });

    res.status(201).json({ 
      success: true,
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
    const { lang = "en" } = req.query;
    const event = await Event.findById(req.params.id).lean();
    
    if (!event) return res.status(404).json({ error: "Event not found" });
    
    // Get registration count
    const registeredCount = await Registration.countDocuments({ eventId: event._id, status: "registered" });

    const localizedTitle = (typeof event.title === 'object' && event.title !== null)
      ? (event.title[lang] || event.title.en)
      : event.title;
      
    const localizedDesc = (typeof event.description === 'object' && event.description !== null)
      ? (event.description[lang] || event.description.en)
      : event.description;

    res.json({
      ...event,
      title: localizedTitle,
      description: localizedDesc,
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
    const { lang = "en" } = req.query;
    const events = await Event.find({ organizerId: req.user.id }).sort({ createdAt: -1 }).lean();
    
    const localizedEvents = events.map(event => {
      const title = (typeof event.title === 'object' && event.title !== null)
        ? (event.title[lang] || event.title.en)
        : event.title;
        
      const description = (typeof event.description === 'object' && event.description !== null)
        ? (event.description[lang] || event.description.en)
        : event.description;
        
      return { ...event, title, description };
    });

    res.json(localizedEvents);
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

// Update event
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });

    if (event.organizerId.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized to update this event" });
    }

    if (event.status === "pending") {
      return res.status(400).json({ error: "Cannot edit an event while it is pending approval" });
    }

    const updatedData = {
      ...req.body,
      date: req.body.startDate || req.body.date,
      status: "pending",
      rejectionReason: null 
    };

    if (req.body.title && req.body.title !== (event.title?.en || event.title)) {
        updatedData.title = {
            en: req.body.title,
            ...(await translateEventText(req.body.title))
        };
    }

    if (req.body.description && req.body.description !== (event.description?.en || event.description)) {
        updatedData.description = {
            en: req.body.description,
            ...(await translateEventText(req.body.description))
        };
    }

    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    res.json({ message: "Event resubmitted successfully", event: updatedEvent });
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ error: "Failed to update event" });
  }
};

// Get participants
exports.getEventParticipants = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).lean();
    if (!event) return res.status(404).json({ error: "Event not found" });

    if (event.organizerId.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized to view participants for this event" });
    }

    const registrations = await Registration.find({ eventId: req.params.id })
      .populate("studentId", "name email course year")
      .sort({ registeredAt: -1 });

    res.json(registrations);
  } catch (error) {
    console.error("Error fetching participants:", error);
    res.status(500).json({ error: "Failed to fetch participants" });
  }
};

// Migration tool for Lingo.dev
exports.migrateEventsToLingo = async (req, res) => {
  try {
    const events = await Event.find({});
    let updatedCount = 0;
    const details = [];

    for (const event of events) {
      let updated = false;
      const updateData = {};
      const rawTitle = event._doc.title;
      const rawDesc = event._doc.description;

      if (typeof rawTitle === 'string' || (typeof rawTitle === 'object' && rawTitle !== null && !rawTitle.hi)) {
        const enTitle = typeof rawTitle === 'string' ? rawTitle : rawTitle.en;
        if (enTitle) {
          const translations = await translateEventText(enTitle);
          updateData.title = { en: enTitle, ...translations };
          updated = true;
        }
      }

      if (typeof rawDesc === 'string' || (typeof rawDesc === 'object' && rawDesc !== null && !rawDesc.hi)) {
        const enDesc = typeof rawDesc === 'string' ? rawDesc : (rawDesc.en || "");
        if (enDesc) {
           const translations = await translateEventText(enDesc);
           updateData.description = { en: enDesc, ...translations };
           updated = true;
        }
      }

      if (updated) {
        await Event.findByIdAndUpdate(event._id, updateData);
        updatedCount++;
        details.push({ id: event._id, status: "Updated" });
      } else {
        details.push({ id: event._id, status: "Skipped (Already Localized or Empty)" });
      }
    }

    res.json({ message: "Migration complete", updatedEvents: updatedCount, details });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
