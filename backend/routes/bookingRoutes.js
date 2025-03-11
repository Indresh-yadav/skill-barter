const express = require("express");
const Booking = require("../models/Booking");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Create a new booking request
router.post("/create", authMiddleware, async (req, res) => {
  const { receiver, skill, offeredSkill, date } = req.body;

  const newBooking = new Booking({
    requester: req.user.id,
    receiver,
    skill,
    offeredSkill, // Add this line
    date,
    status: "Pending"
  });

  await newBooking.save();
  res.status(201).json(newBooking);
});

// Get all bookings for the user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({
      $or: [{ requester: req.user.id }, { receiver: req.user.id }]
    })
      .populate("requester receiver", "name email")
      .populate({
        path: "skill",
        model: "Skill",
        select: "skillName experienceLevel"
      })
      .populate({
        path: "offeredSkill", // Add this to populate offered skill
        model: "Skill",
        select: "skillName experienceLevel"
      });

    res.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Server error" });
  }
});



// Accept or decline a booking
router.put("/:bookingId", authMiddleware, async (req, res) => {
  const { status } = req.body;
  if (!["Confirmed", "Canceled"].includes(status)) {
    return res.status(400).json({ message: "Invalid status update" });
  }

  const booking = await Booking.findById(req.params.bookingId);
  if (!booking) return res.status(404).json({ message: "Booking not found" });

  if (booking.receiver.toString() !== req.user.id) {
    return res.status(403).json({ message: "You are not authorized to update this booking" });
  }

  booking.status = status;
  await booking.save();

  const io = req.app.get("io");
  io.to(booking.requester.toString()).emit("bookingStatusUpdate", {
    bookingId: booking._id,
    status
  });

  res.json(booking);
});


// check the pending requests
router.get('/pending', authMiddleware, async (req, res) => {
  try {
      const bookings = await Booking.find({
          receiver: req.user._id,
          status: 'Pending'
      }).populate('skill requester', 'skillName name');

      res.json(bookings);
  } catch (error) {
      console.error('Error fetching pending bookings:', error);
      res.status(500).json({ message: 'Server Error' });
  }
});

// Check if similar booking already exists
router.post("/check-existing", async (req, res) => {
  const { requester, receiver, skill, offeredSkill } = req.body;

  try {
    const existingBooking = await Booking.findOne({
      requester,
      receiver,
      skill,
      offeredSkill,
      status: "Pending", // Check only for pending requests
    });

    if (existingBooking) {
      return res.json({ exists: true });
    }

    res.json({ exists: false });
  } catch (error) {
    console.error("Error checking existing booking:", error);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;