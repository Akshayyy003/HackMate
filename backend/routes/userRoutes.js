const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { getUserProfile } = require("../controller/userController");

const router = express.Router();

// Protected route -> fetch logged in user profile
router.get("/profile", protect, getUserProfile);

module.exports = router;
