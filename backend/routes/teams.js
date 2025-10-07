const express = require('express');
const router = express.Router();
const { getUserTeams, createTeam } = require('../controller/teamController');

// Get teams by user
router.get('/:userId', getUserTeams);

// Create team
router.post('/', createTeam);

module.exports = router;
