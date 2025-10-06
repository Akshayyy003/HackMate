const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { generateQuestions, submitSkill } = require('../controller/skillsController');

// Generate questions for a given skill (calls external quiz API)
router.post('/generate', protect, generateQuestions);

// Submit results and save skill separately from profile API
router.post('/submit', protect, submitSkill);

module.exports = router;
