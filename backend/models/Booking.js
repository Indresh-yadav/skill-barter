const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  requester: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  skill: { type: mongoose.Schema.Types.ObjectId, ref: "Skill", required: true }, // Requested Skill
  offeredSkill: { type: mongoose.Schema.Types.ObjectId, ref: "Skill", required: true }, // Offered Skill
  date: { type: Date, required: true },
  status: { type: String, enum: ["Pending", "Confirmed", "Canceled"], default: "Pending" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Booking", BookingSchema);
