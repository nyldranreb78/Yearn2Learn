const mongoose = require("mongoose");

async function connect() {
  try {
    await mongoose.connect(process.env.DATABASE_URI);
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
  }
}

module.exports = connect;
