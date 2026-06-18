const mongoose = require("mongoose");
const Hospital = require("../models/Hospital");
const hospitals = require("../data/hospitals.json");
require("dotenv").config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    await Hospital.deleteMany({});
    console.log("🗑️  Cleared existing hospital data");

    await Hospital.insertMany(hospitals);
    console.log(`🏥 Seeded ${hospitals.length} hospitals successfully`);

    await mongoose.disconnect();
    console.log("✅ Done!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  }
};

seed();
