require('dotenv').config();
const mongoose = require('mongoose');
const Event = require('./src/models/Event');
const User = require('./src/models/User');

async function checkData() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB");
    
    const eventCount = await Event.countDocuments();
    console.log("Total Events:", eventCount);
    
    const sampleEvent = await Event.findOne().populate('organizer');
    console.log("Sample Event:", JSON.stringify(sampleEvent, null, 2));
    
    const organizerCount = await User.countDocuments({ role: 'organizer' });
    console.log("Total Organizers:", organizerCount);
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkData();
