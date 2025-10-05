const express = require("express");
const router = express.Router();
const { updateUserProfile, getUserProfile } = require("../controller/userController");
const { protect } = require("../middleware/authMiddleware");

router.get("/profile/:id", protect, getUserProfile);
router.put("/profile/:id", protect, updateUserProfile);

module.exports = router;
