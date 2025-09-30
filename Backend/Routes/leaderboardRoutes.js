const express = require('express');
const router = express.Router();
const leaderboardController = require('../Controller/leaderboardController');
const { protect } = require('../Middleware/authMiddleware');

router.get('/', protect, leaderboardController.getLeaderboard);

module.exports = router;
