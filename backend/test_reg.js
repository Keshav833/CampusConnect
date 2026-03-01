const mongoose = require('mongoose');
const { registerForEvent } = require('./src/controllers/registration.controller');
require('dotenv').config();

async function testRegister() {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Mock req, res
    const req = {
        body: { eventId: '698625412a10f43b3d0973d9' },
        user: { id: '6980b41d9e5b0730ba2e9e0f', role: 'student' }
    };
    const res = {
        status: function(s) { this.statusCode = s; return this; },
        json: function(j) { console.log('Status:', this.statusCode || 200); console.log('Response:', j); }
    };

    try {
        await registerForEvent(req, res);
    } catch (e) {
        console.error('Fatal error in test:', e);
    }
    
    await mongoose.disconnect();
}

testRegister();
