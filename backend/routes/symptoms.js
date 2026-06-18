const express = require("express");
const router = express.Router();
const SymptomCheck = require("../models/SymptomCheck");
const { parseSymptoms, assessSymptoms, getAllSymptoms } = require("../middleware/symptomEngine");

// GET /api/symptoms/list
// Returns all available symptoms for the frontend checklist
router.get("/list", (req, res) => {
  try {
    const symptoms = getAllSymptoms();
    res.json({ success: true, symptoms });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch symptoms" });
  }
});

// POST /api/symptoms/check
// Body: { symptoms: [...ids], rawInput: "...", duration: "2 days", age: 25, city: "Lucknow" }
router.post("/check", async (req, res) => {
  try {
    const { symptoms = [], rawInput = "", duration, age, city, sessionId } = req.body;

    // Merge manually selected symptoms + parsed from raw text
    let parsedFromText = [];
    if (rawInput && rawInput.trim()) {
      parsedFromText = parseSymptoms(rawInput);
    }

    const allSymptomIds = [...new Set([...symptoms, ...parsedFromText])];

    if (allSymptomIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please select at least one symptom or describe what you're feeling.",
      });
    }

    // Run the assessment engine
    const result = assessSymptoms(allSymptomIds);

    // Save to MongoDB for history
    const record = await SymptomCheck.create({
      symptoms: allSymptomIds,
      rawInput,
      duration: duration || "Not specified",
      age: age || null,
      result,
      city: city || "",
      sessionId: sessionId || "",
    });

    res.json({
      success: true,
      checkId: record._id,
      detectedSymptoms: allSymptomIds,
      result,
    });
  } catch (err) {
    console.error("Error in /check:", err);
    res.status(500).json({ success: false, message: "Assessment failed. Please try again." });
  }
});

// GET /api/symptoms/history/:sessionId
// Returns last 10 checks for a session (no login needed)
router.get("/history/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;
    const checks = await SymptomCheck.find({ sessionId })
      .sort({ createdAt: -1 })
      .limit(10)
      .select("-__v");

    res.json({ success: true, checks });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch history." });
  }
});

// GET /api/symptoms/check/:id
// Returns a single check result by ID (for shareable links)
router.get("/check/:id", async (req, res) => {
  try {
    const check = await SymptomCheck.findById(req.params.id).select("-__v");
    if (!check) {
      return res.status(404).json({ success: false, message: "Check not found." });
    }
    res.json({ success: true, check });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch check." });
  }
});

module.exports = router;
