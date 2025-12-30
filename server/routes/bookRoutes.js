const express = require('express');
const router = express.Router();
const { createBook, getAllBooks, getBookById, updateBook, deleteBook } = require('../controllers/bookController');
const authMiddleware = require('../middleware/authMiddleware');
const requireRole = require('../middleware/requireRole');
const { bookCreateValidation, bookUpdateValidation } = require('../validators/bookValidators');
const handleValidationErrors = require('../middleware/validationHandler');
const upload = require('../middleware/upload');

router.get('/', getAllBooks);
router.get('/:id', getBookById);
router.post('/', authMiddleware, requireRole('admin'), upload.single('image'), bookCreateValidation, handleValidationErrors,  createBook);
router.put('/:id', authMiddleware, requireRole('admin'), upload.single('image'), bookUpdateValidation, handleValidationErrors, updateBook);
router.delete('/:id', authMiddleware, requireRole('admin'), deleteBook);

module.exports = router;