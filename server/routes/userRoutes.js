const express = require('express');
const router = express.Router();
const { getAllUsers, updateUserRole, updateOwnEmail, updateOwnPassword } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const requireRole = require('../middleware/requireRole');

router.get('/', authMiddleware, requireRole('admin'), getAllUsers);
router.patch('/:userId/role', authMiddleware, requireRole('admin'), updateUserRole);
router.patch('/me/email', authMiddleware, updateOwnEmail);
router.patch('/me/password', authMiddleware, updateOwnPassword);

module.exports = router;
