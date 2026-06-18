const express = require("express");
const router = express.Router();
const Hospital = require("../models/Hospital");

// GET /api/hospitals?city=Lucknow
// GET /api/hospitals?pincode=226003
// GET /api/hospitals?state=Uttar Pradesh
router.get("/", async (req, res) => {
  try {
    const { city, pincode, state } = req.query;

    if (!city && !pincode && !state) {
      return res.status(400).json({
        success: false,
        message: "Please provide a city, pincode, or state to search hospitals.",
      });
    }

    let query = {};

    if (pincode) {
      query.pincode = pincode;
    } else if (city) {
      // Case-insensitive city search
      query.city = { $regex: new RegExp(city, "i") };
    } else if (state) {
      query.state = { $regex: new RegExp(state, "i") };
    }

    const hospitals = await Hospital.find(query).limit(5).select("-__v");

    if (hospitals.length === 0) {
      return res.json({
        success: true,
        hospitals: [],
        message: `No hospitals found for your search. Try searching by state or call 108 for emergencies.`,
      });
    }

    res.json({ success: true, hospitals });
  } catch (err) {
    console.error("Hospital search error:", err);
    res.status(500).json({ success: false, message: "Hospital search failed." });
  }
});

// GET /api/hospitals/emergency
// Returns all emergency hospitals (for emergency severity results)
router.get("/emergency", async (req, res) => {
  try {
    const { city, state } = req.query;
    let query = { emergency: true };

    if (city) query.city = { $regex: new RegExp(city, "i") };
    else if (state) query.state = { $regex: new RegExp(state, "i") };

    const hospitals = await Hospital.find(query).limit(3).select("-__v");
    res.json({ success: true, hospitals });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch emergency hospitals." });
  }
});

// GET /api/hospitals/states
// Returns list of states we have data for
router.get("/states", async (req, res) => {
  try {
    const states = await Hospital.distinct("state");
    res.json({ success: true, states: states.sort() });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch states." });
  }
});

module.exports = router;
