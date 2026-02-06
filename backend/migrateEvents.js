const mongoose = require("mongoose");
const Event = require("./src/models/Event");
require("dotenv").config();

const migrate = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB for migration");

    const events = await Event.find({});
    console.log(`Found ${events.length} events`);

    for (const event of events) {
      if (typeof event.description === "string") {
        console.log(`Migrating event: ${event.title}`);
        const descText = event.description;
        event.description = {
          en: descText,
          hi: descText, // fallback
          mr: descText,
          ta: descText
        };
        // Disable validation for migration
        await event.save({ validateBeforeSave: false });
      }
    }

    console.log("Migration complete");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
};

migrate();
