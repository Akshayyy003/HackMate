const Team = require('../models/Team');

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

// Create a new team
exports.createTeam = async (req, res) => {
  try {
    let { name, description, members, leaderId, neededRoles, status, hackathon } = req.body;

    // Convert string IDs to ObjectId
    leaderId = mongoose.Types.ObjectId(leaderId);
    members = members.map(m => ({ ...m, userId: mongoose.Types.ObjectId(m.userId) }));

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