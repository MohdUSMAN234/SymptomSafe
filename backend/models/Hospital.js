const mongoose = require("mongoose");

const HospitalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String },
  address: { type: String },
  phone: { type: String },
  type: { type: String, default: "Government" },
  emergency: { type: Boolean, default: true },
  lat: { type: Number },
  lng: { type: Number },
});

// Index for fast city-based search
HospitalSchema.index({ city: 1, state: 1 });

module.exports = mongoose.model("Hospital", HospitalSchema);
