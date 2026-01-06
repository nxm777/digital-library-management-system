const { body } = require('express-validator');

const reviewCreateValidation = [
  body('rating')
    .notEmpty().withMessage('Rating is required')
    .isInt({ min: 1, max: 5 }).withMessage('Rating must be a number between 1 and 5'),

  body('bookId')
    .notEmpty().withMessage('BookId is required')
    .isMongoId().withMessage("Invalid bookId format"),

  body('comment')
    .trim()
    .isLength({ min: 2, max: 1000 }).withMessage('Comment must be between 2 and 1000 characters'),
];

const reviewUpdateValidation = [
  body('rating')
    .optional()
    .isInt({ min: 1, max: 5 }).withMessage('Rating must be a number between 1 and 5'),

  body('comment')
    .optional()
    .trim()
    .isLength({ min: 2, max: 1000 }).withMessage('Comment must be between 2 and 1000 characters'),
];


module.exports = { reviewCreateValidation, reviewUpdateValidation }