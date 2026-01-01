const express = require('express');
const router = express.Router();
const { createReadingSession, deleteReadingSession, getReadingSession, getUserReadingSessions, updateReadingSession} = require('../controllers/readingSessionController');
const { validateCreateReadingSession, validateUpdateReadingSession } = require('../validators/readingSessionValidators');
const authMiddleware = require("../middleware/authMiddleware");
const handleValidationErrors = require('../middleware/validationHandler');


router.post('/', authMiddleware, validateCreateReadingSession, handleValidationErrors, createReadingSession);
router.get('/:readingSessionId', authMiddleware, getReadingSession);
router.get('/', authMiddleware, getUserReadingSessions);
router.put('/:readingSessionId', authMiddleware, validateUpdateReadingSession, handleValidationErrors, updateReadingSession);
router.delete('/:readingSessionId', authMiddleware, deleteReadingSession);

module.exports = router;