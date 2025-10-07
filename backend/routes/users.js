const express = require('express');
const router = express.Router();
const User = require('../models/user');

// GET all users (optionally filter out logged-in user via query)
router.get('/', async (req, res) => {
  try {
    const excludeUserId = req.query.excludeUserId; // optional

    // Only fetch available users
    let query = { availability: true };

    if (excludeUserId) {
      query._id = { $ne: excludeUserId }; // exclude logged-in user
    }

    const users = await User.find(query).select('-password'); // exclude password

    // Map users to frontend format
    const mappedUsers = users.map(user => ({
      id: user._id.toString(),
      name: user.name,
      role: user.role || 'Unknown', // add role field if missing
      bio: user.bio || '',
      skills: user.skills.map(skill => ({
        id: skill.id || skill._id?.toString() || skill.name,
        name: skill.name,
        level: Number(skill.level),
        verified: skill.verified || false,
      })),
      availability: user.availability,
      location: user.location || '',
      timezone: user.timezone || '',
    }));

    res.json(mappedUsers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
