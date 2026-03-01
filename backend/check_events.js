const mongoose = require('mongoose');
const Event = require('./src/models/Event');
require('dotenv').config();

async function checkEvents() {
    await mongoose.connect(process.env.MONGO_URI);
    const events = await Event.find({}).limit(5);
    console.log(JSON.stringify(events, null, 2));
    await mongoose.disconnect();
}

checkEvents();
