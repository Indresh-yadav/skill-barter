const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" }, // Store exchanged course
  messages: [
    {
      sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      text: String,
      fileUrl: String, // Stores file/media links
      timestamp: { type: Date, default: Date.now },
    },
  ],
  isAccepted: { type: Boolean, default: false },
});

module.exports = mongoose.model("Chat", chatSchema);
