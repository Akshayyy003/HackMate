const jwt = require("jsonwebtoken");
const User = require("../models/user");

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Register user
exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ name, email, password, role });

    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar || "",
        bio: user.bio || "",
        skills: user.skills || [],
        verifiedSkills: user.verifiedSkills || [],
        teams: user.teams || [],
        availability: user.availability || false,
        github: user.github || "",
        linkedin: user.linkedin || "",
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login user
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar || "",
          bio: user.bio || "",
          skills: user.skills || [],
          verifiedSkills: user.verifiedSkills || [],
          teams: user.teams || [],
          availability: user.availability || false,
          github: user.github || "",
          linkedin: user.linkedin || "",
        },
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
