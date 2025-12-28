const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');
const { registerValidation, loginValidation } = require('../validators/authValidators');
const handleValidationErrors = require('../middleware/validationHandler');
const { registerLimiter } = require('../middleware/rateLimit');

router.post('/register', registerLimiter, registerValidation, handleValidationErrors, registerUser);
router.post('/login', loginValidation, handleValidationErrors, loginUser);

module.exports = router;