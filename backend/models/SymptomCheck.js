const mongoose = require("mongoose");

const SymptomCheckSchema = new mongoose.Schema(
  {
    symptoms: {
      type: [String],
      required: true,
    },
    rawInput: {
      type: String,
      default: "",
    },
    duration: {
      type: String,
      default: "Not specified",
    },
    age: {
      type: Number,
      default: null,
    },
    result: {
      severity: {
        type: String,
        enum: ["monitor", "see_doctor", "emergency"],
        required: true,
      },
      conditionName: String,
      message: String,
      advice: String,
      seeDoctor: Boolean,
    },
    city: {
      type: String,
      default: "",
    },
    sessionId: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SymptomCheck", SymptomCheckSchema);
