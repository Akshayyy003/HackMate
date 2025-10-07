const User = require("../models/user");

// Add or update a skill in user profile
exports.addSkillToProfile = async (req, res) => {
  try {
    const { userId, skill, level } = req.body;

    if (!userId || !skill || !level) {
      return res.status(400).json({ message: "Missing userId, skill or level" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check if skill already exists
    const existingSkill = user.skills.find((s) => s.name === skill);

    if (existingSkill) {
      existingSkill.level = level;
      existingSkill.verified = true;
    } else {
      user.skills.push({
        id: Date.now().toString(),
        name: skill,
        level,
        verified: true,
      });
    }

    // Add to verifiedSkills array if not already present
    if (!user.verifiedSkills.includes(skill)) {
      user.verifiedSkills.push(skill);
    }

    await user.save();

    res.status(200).json({ message: "Skill added successfully", user });
  } catch (error) {
    console.error("Error adding skill:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
