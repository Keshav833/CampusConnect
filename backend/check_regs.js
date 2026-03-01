const mongoose = require('mongoose');
const Registration = require('./src/models/Registration');
require('dotenv').config();

async function checkRegs() {
    await mongoose.connect(process.env.MONGO_URI);
    const regs = await Registration.find({}).limit(5);
    console.log(JSON.stringify(regs, null, 2));
    await mongoose.disconnect();
}

checkRegs();
