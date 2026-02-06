const axios = require("axios");

async function test() {
  try {
    console.log("Testing GET http://localhost:5000/api/events");
    const res = await axios.get("http://localhost:5000/api/events");
    console.log("Status:", res.status);
    console.log("Is Array:", Array.isArray(res.data));
    console.log("Data Length:", res.data.length);
    if (res.data.length > 0) {
      console.log("First item description type:", typeof res.data[0].description);
      console.log("First item description:", JSON.stringify(res.data[0].description));
    }
  } catch (err) {
    console.error("Test failed:", err.message);
    if (err.response) {
      console.error("Response Status:", err.response.status);
      console.error("Response Data:", err.response.data);
    }
  }
}

test();
