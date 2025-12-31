const express = require('express');
const router = express.Router();
const { createReadingList, getAllReadingLists, getReadingList, updateReadingList, deleteReadingList, addBookToReadingList, removeBookFromReadingList } = require('../controllers/readingListController');
const authMiddleware = require('../middleware/authMiddleware');
const { readingListCreateValidation } = require('../validators/readingListValidators');
const handleValidationErrors = require('../middleware/validationHandler');

router.post('/', authMiddleware, readingListCreateValidation, handleValidationErrors, createReadingList);
router.get('/', authMiddleware, getAllReadingLists);
router.get('/:readingListId', authMiddleware, getReadingList);
router.put('/:readingListId', authMiddleware, updateReadingList);
router.delete('/:readingListId', authMiddleware, deleteReadingList);
router.post('/:readingListId/books', authMiddleware, addBookToReadingList);
router.delete('/:readingListId/books/:bookId', authMiddleware, removeBookFromReadingList);

module.exports = router;