const express = require("express");
const router = express.Router();
const Hackathon = require("../models/Hackathon");
const Team = require("../models/Team");
const { protect } = require("../middleware/authMiddleware"); 


// 🧠 Get all hackathons
router.get("/", async (req, res) => {
  try {
    const hackathons = await Hackathon.find();
    res.json(hackathons);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🏗️ Create a new hackathon
router.post("/", async (req, res) => {
  try {
    const {
      name,
      description,
      date,
      location,
      type,
      prize,
      status,
      tags,
      organizer,
      image
    } = req.body;

    const hackathon = new Hackathon({
      name,
      description,
      date,
      location,
      type,
      prize,
      status,
      tags,
      organizer,
      image,
    });

    await hackathon.save();
    res.status(201).json({ success: true, hackathon });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 🧑‍🤝‍🧑 Join hackathon (team join)
// router.post("/:id/join", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { teamId } = req.body;

//     const hackathon = await Hackathon.findById(id);
//     if (!hackathon)
//       return res.status(404).json({ error: "Hackathon not found" });

//     // Increase participants count
//     hackathon.participants = (hackathon.participants || 0) + 1;
//     hackathon.teamsRegistered = (hackathon.teamsRegistered || 0) + 1;
//     await hackathon.save();

//     res.json({ success: true, message: "Team joined successfully", hackathon });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

router.post("/:id/join", protect, async (req, res) => {
  try {
    console.log("User ID from token:", req.user?._id); // debug

    const hackathonId = req.params.id;
    const userId = req.user._id;

    const hackathon = await Hackathon.findById(hackathonId);
    if (!hackathon) return res.status(404).json({ error: "Hackathon not found" });

    // Prevent multiple joins
    const alreadyJoined = await Team.findOne({ hackathon: hackathonId, "members.userId": userId });
    if (alreadyJoined) {
      return res.status(400).json({ error: "You have already joined this hackathon" });
    }

    const team = new Team({
      name: `${req.user.name}'s Team`,
      members: [{ userId, name: req.user.name, role: "Leader" }],
      leaderId: userId,
      hackathon: hackathonId,
      status: "active",
      neededRoles: [],
    });

    await team.save();

    hackathon.participants = (hackathon.participants || 0) + 1;
    hackathon.teamsRegistered = (hackathon.teamsRegistered || 0) + 1;
    await hackathon.save();

    res.json({ success: true, message: "Successfully joined the hackathon", hackathon, team });
  } catch (err) {
    console.error("Join Hackathon Error:", err);
    res.status(500).json({ error: err.message });
  }
});



router.get("/:id/participants", async (req, res) => {
    try {
      const teams = await Team.find({ hackathon: req.params.id })
        .populate("leaderId", "name email")
        .populate("members.userId", "name email");
  
      if (!teams || teams.length === 0)
        return res.status(404).json({ error: "No participants found" });
  
      res.json(teams);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  

module.exports = router;
