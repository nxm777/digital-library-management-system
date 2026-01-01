const { body } = require('express-validator');

exports.validateCreateReadingSession = [
  body('book')
    .notEmpty().withMessage('Book ID is required')
    .isMongoId().withMessage('Invalid book ID format'),

  body('pagesRead')
    .notEmpty().withMessage('Number of pages read is required')
    .isInt({ min: 1 }).withMessage('Pages read must be at least 1'),

  body('durationMinutes')
    .notEmpty().withMessage('Session duration is required')
    .isInt({ min: 1 }).withMessage('Duration must be at least 1 minute'),

  body('sessionDate')
    .optional()
    .isISO8601().withMessage('Invalid date format'),

  body('notes')
    .optional()
    .isLength({ max: 500 }).withMessage('Notes cannot exceed 500 characters')
];

exports.validateUpdateReadingSession = [
  body('pagesRead')
    .optional()
    .isInt({ min: 1 }).withMessage('Pages read must be at least 1'),

  body('durationMinutes')
    .optional()
    .isInt({ min: 1 }).withMessage('Duration must be at least 1 minute'),

  body('notes')
    .optional()
    .isLength({ max: 500 }).withMessage('Notes cannot exceed 500 characters')
];