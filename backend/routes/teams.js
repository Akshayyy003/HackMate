const express = require('express');
const router = express.Router();
const { getUserTeams, createTeam ,getTeams,joinTeam} = require('../controller/teamController');

// Get teams by user
router.get('/:userId', getUserTeams);

// Create team
router.post('/', createTeam);
router.get('/', getTeams);
router.post("/:teamId/join", joinTeam);

module.exports = router;
