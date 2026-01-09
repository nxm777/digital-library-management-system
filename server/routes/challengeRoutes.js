const express = require('express');
const router = express.Router();
const { createChallenge, getUserChallenges, deleteChallenge } = require('../controllers/challengeController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, getUserChallenges);
router.post('/', authMiddleware, createChallenge)
router.delete('/:challengeId', authMiddleware, deleteChallenge);

module.exports = router;