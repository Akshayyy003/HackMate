const User = require("../models/User");

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { name, bio, github, linkedin, availability } = req.body;
    user.name = name ?? user.name;
    user.bio = bio ?? user.bio;
    user.github = github ?? user.github;
    user.linkedin = linkedin ?? user.linkedin;
    user.availability = availability ?? user.availability;

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getUserProfile, updateUserProfile };
