const mongoose = require("mongoose");

const SkillSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  skillName: { type: String, required: true },
  category: { type: String, required: true },
  experienceLevel: { type: String, enum: ["Beginner", "Intermediate", "Expert"], required: true }, // how to have multiple enums // how to show the value of the enums on the screen
  barterOption: {type: String }, // Skills the user is willing to exchange for
  location: { type: String }, // Optional for local exchanges
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Skill", SkillSchema);
