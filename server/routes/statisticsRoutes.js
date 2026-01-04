const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getUserStats } = require('../controllers/statisticsController');

router.get('/', authMiddleware, getUserStats);

module.exports = router;