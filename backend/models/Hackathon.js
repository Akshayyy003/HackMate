const mongoose = require("mongoose");

const HackathonSchema = new mongoose.Schema({
  name: { type: String, required: true, default: "Unnamed Hackathon" },
  description: { type: String, required: true, default: "No description provided." },
  date: { type: String, required: true, default: new Date().toISOString().split("T")[0] }, // default today's date
  location: { type: String, required: true, default: "TBD" },
  type: { type: String, enum: ["In-Person", "Virtual", "Hybrid"], required: true, default: "In-Person" },
  participants: { type: Number, default: 0 },
  teamsRegistered: { type: Number, default: 0 },
  prize: { type: String, required: true, default: "No prize announced" },
  status: { type: String, enum: ["Registration Open", "Coming Soon", "Closed"], default: "Coming Soon" },
  tags: { type: [String], default: [] },
  organizer: { type: String, required: true, default: "Unknown Organizer" },
  image: { type: String, default: "https://via.placeholder.com/150" }
}, { timestamps: true });

module.exports = mongoose.models.Hackathon || mongoose.model("Hackathon", HackathonSchema);
