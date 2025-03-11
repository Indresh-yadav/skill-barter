const express = require("express");
const Skill = require("../models/Skill");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Create a new skill listing
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { skillName, category, experienceLevel, barterOption, location } = req.body;

    if (!skillName || !category) {
      return res.status(400).json({ error: "Skill name and category are required." });
    }

    const newSkill = new Skill({
      userId: req.user.id,
      skillName,
      category,
      experienceLevel,
      barterOption,
      location,
    });

    await newSkill.save();
    res.status(201).json({
      message: "Skill listed successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Fetch skills for a specific user
router.get("/user/:userId", async (req, res) => {
  try {
    const userSkills = await Skill.find({ userId: req.params.userId })
    .populate("userId", "name");
    res.json(userSkills);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});


router.get("/match/:userId", async (req, res) => {
  try {
    const { skill } = req.query; // Extract the searched skill from query params
    const userId = req.params.userId;

    if (!skill) {
      return res.status(400).json({ error: "Please provide a skill to search." });
    }

    // Find all skills that match the searched skill and exclude the current user's ID
    const matchedSkills = await Skill.find({ skillName: skill, userId: { $ne: userId } })
    .populate("userId", "name");  // Replaces the userId (which is just an ObjectId reference) with the actual user document, but only fetching the name field
    // we can replace only ObjectId references wiht multiple user document.

    res.json(matchedSkills);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/:skillId", authMiddleware, async (req, res) => {
  try {
    const skillId = req.params.skillId;
    const skill = await Skill.findById(skillId);

    if (!skill) {
      return res.status(404).json({ error: "Skill not found." });
    }

    // Check if the logged-in user is the owner of the skill
    if (skill.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: "You are not authorized to delete this skill." });
    }

    await skill.deleteOne(); 
    res.status(200).json({ message: "Skill deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get skills by name (case insensitive search)
router.get("/name/:skillName", async (req, res) => {
  try {
    const skillName = req.params.skillName;
    const skills = await Skill.find({ skillName: new RegExp(skillName, "i") }) // Case insensitive
      .populate("userId", "name"); // Get user's name for each skill

    if (skills.length > 0) {
      res.status(200).json(skills);
    } else {
      res.status(404).json({ message: "No skills found" });
    }
  } catch (error) {
    console.error("Error fetching skill by name:", error);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
