const express = require("express");
const multer = require("multer");
const Chat = require("../models/chat");
const Booking = require("../models/Booking");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Multer Storage for File Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// Send message (text + file support)
router.post("/:chatId/send", authMiddleware, upload.single("file"), async (req, res) => {
  const { chatId } = req.params;
  const { text } = req.body;
  const fileUrl = req.file ? `/uploads/${req.file.filename}` : null;

  const chat = await Chat.findById(chatId);
  if (!chat) return res.status(404).json({ message: "Chat not found" });

  const newMessage = {
    sender: req.user.id,
    text,
    fileUrl,
    timestamp: new Date(),
  };

  chat.messages.push(newMessage);
  await chat.save();

  // Emit message using Socket.io
  req.io.to(chatId).emit("newMessage", newMessage);

  res.json(newMessage);
});

module.exports = router;
