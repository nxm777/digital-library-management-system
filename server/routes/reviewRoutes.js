const express = require('express');
const router = express.Router();
const { addReview, getReview, getUserReviews, getAllReviews, updateReview, deleteReview } = require('../controllers/reviewController');
const authMiddleware = require('../middleware/authMiddleware');
const { reviewCreateValidation, reviewUpdateValidation  } = require('../validators/reviewValidators');
const handleValidationErrors = require('../middleware/validationHandler');

router.post('/', authMiddleware, reviewCreateValidation, handleValidationErrors, addReview);
router.get('/', authMiddleware, getUserReviews);
router.get('/all', authMiddleware, getAllReviews);
router.get('/:reviewId', authMiddleware, getReview);
router.put('/:reviewId', authMiddleware, reviewUpdateValidation, handleValidationErrors, updateReview);
router.delete('/:reviewId', authMiddleware, deleteReview);

module.exports = router;