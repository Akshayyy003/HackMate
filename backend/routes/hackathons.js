const express = require("express");
const Hackathon = require("../models/Hackathon");

const router = express.Router();

// GET all hackathons (with optional search query)
router.get("/", async (req, res) => {
    try {
        const { search } = req.query;
        let query = {};
        if (search) {
            const regex = new RegExp(search, "i");
            query = {
                $or: [
                    { name: regex },
                    { description: regex },
                    { tags: regex }
                ]
            };
        }
        const hackathons = await Hackathon.find(query).sort({ date: 1 });
        res.json(hackathons);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET hackathon by ID
router.get("/:id", async (req, res) => {
    try {
        const hackathon = await Hackathon.findById(req.params.id);
        if (!hackathon) return res.status(404).json({ message: "Hackathon not found" });
        res.json(hackathon);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST create new hackathon
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
            image,
        } = req.body;

        // Validate required fields
        if (!name || !description || !date || !location || !type || !prize || !status || !organizer) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Ensure tags is always an array
        const hackathon = new Hackathon({
            name: name || "Unnamed Hackathon",
            description: description || "No description provided.",
            date: date ? new Date(date) : new Date(),
            location: location || "TBD",
            type: type || "In-Person",
            prize: prize || "No prize announced",
            status: status || "Coming Soon",
            tags: Array.isArray(tags) ? tags : [],
            organizer: organizer || "Unknown Organizer",
            image: image || "https://en.wikipedia.org/wiki/Beach",
            participants: 0,
            teamsRegistered: 0,
        });

        await hackathon.save();
        res.status(201).json(hackathon);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


// PUT update hackathon
router.put("/:id", async (req, res) => {
    try {
        const hackathon = await Hackathon.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!hackathon) return res.status(404).json({ message: "Hackathon not found" });
        res.json(hackathon);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE hackathon
router.delete("/:id", async (req, res) => {
    try {
        const hackathon = await Hackathon.findByIdAndDelete(req.params.id);
        if (!hackathon) return res.status(404).json({ message: "Hackathon not found" });
        res.json({ message: "Hackathon deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
