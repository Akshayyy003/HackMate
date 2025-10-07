const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { generateQuestions, submitSkill } = require('../controller/skillsController');
const { addSkillToProfile } = require("../controller/skillAddController");

// Generate questions for a given skill (calls external quiz API)
router.post('/generate', protect, generateQuestions);


// POST /api/skills/add
router.post("/add", addSkillToProfile);

module.exports = router;
