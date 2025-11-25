const Team = require('../models/Team');
const mongoose = require('mongoose');

// Get all teams for a user
exports.getUserTeams = async (req, res) => {
  const userId = req.params.userId;
  try {
    const teams = await Team.find({ 'members.userId': userId });
    res.json(Array.isArray(teams) ? teams : []);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getTeams = async (req, res) => {
  try {
    const teams = await Team.find()
      .populate("leaderId", "name email")
      .populate("members.userId", "name email role")
      .lean();

    res.status(200).json({
      success: true,
      teams,
    });
  } catch (err) {
    console.error("Error fetching teams:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch teams",
    });
  }
};

exports.joinTeam = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { userId, role } = req.body;

    const team = await Team.findById(teamId);
    if (!team) return res.status(404).json({ message: "Team not found" });

    // Already member?
    const exists = team.members.some(m => m.userId.toString() === userId);
    if (exists) {
      return res.status(400).json({ message: "Already a team member" });
    }

    team.members.push({
      userId,
      role,
      name: req.body.name
    });

    await team.save();
    res.status(200).json({ success: true, message: "Joined team!" });
  } catch (err) {
    console.error("Join error:", err);
    res.status(500).json({ message: "Failed to join team" });
  }
};


// Create a new team
exports.createTeam = async (req, res) => {
  try {
    let { name, description, members, leaderId, neededRoles, status, hackathon } = req.body;
    console.log("hii");
    

    // Convert string IDs to ObjectId
    leaderId = new mongoose.Types.ObjectId(leaderId);
    members = members.map(m => ({ ...m, userId: new mongoose.Types.ObjectId(m.userId) }));
    console.log("hello");
    

    // members should at least include the leader
    const leaderMember = members.length > 0 ? members[0] : { userId: leaderId, name: 'Leader', role: 'Leader' };

    const team = new Team({
      name,
      description,
      members: [leaderMember],
      neededRoles: neededRoles || [],
      leaderId,
      status: status || 'active',
      hackathon,
    });

    const savedTeam = await team.save();
    res.status(201).json(savedTeam);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};