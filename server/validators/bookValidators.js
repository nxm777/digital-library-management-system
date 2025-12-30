const { body } = require('express-validator');
const validator = require('validator');

const bookCreateValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Title must be between 2 and 100 characters'),

  body('author.first_name')
    .trim()
    .notEmpty().withMessage('First name is required')
    .isLength({ min: 2, max: 30 })
    .withMessage('First name must be between 2 and 30 characters'),

  body('author.last_name')
    .trim()
    .notEmpty().withMessage('Last name is required')
    .isLength({ min: 2, max: 60 })
    .withMessage('Last name must be between 2 and 60 characters'),

  body('isbn')
    .trim()
    .notEmpty().withMessage('ISBN is required')
    .custom(value => {
    if (!validator.isISBN(value)) {
      throw new Error('Invalid ISBN format');
    }
    return true;
  }),

  body('publisher')
    .trim()
    .notEmpty().withMessage('Publisher is required')
    .isLength({ min: 2, max: 60 })
    .withMessage('Publisher must be between 2 and 60 characters'),

  body('genres')
    .optional()
    .isArray().withMessage('Genres must be an array')
    .custom((genres) => {
      const invalid = genres.find(g => typeof g !== 'string' || g.trim() === '');
      if (invalid) throw new Error('All genres must be non-empty strings');
      return true;
    }),

  body('numOfPages')
    .notEmpty().withMessage('Number of pages is required')
    .isInt({ min: 1 }).withMessage('Number of pages must be at least 1'),

  body('publicationYear')
    .notEmpty().withMessage('Publication year is required')
    .isInt({ min: 1000, max: new Date().getFullYear() })
    .withMessage('Publication year must be a valid year'),

  body('rating.average')
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage('Average rating must be between 0 and 5'),

  body('rating.count')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Rating count must be 0 or greater'),
];

const bookUpdateValidation = [
  body('title')
    .optional()
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Title must be between 2 and 100 characters'),

  body('author.first_name')
    .optional()
    .trim()
    .notEmpty().withMessage('First name is required')
    .isLength({ min: 2, max: 30 })
    .withMessage('First name must be between 2 and 30 characters'),

  body('author.last_name')
    .optional()  
    .trim()
    .notEmpty().withMessage('Last name is required')
    .isLength({ min: 2, max: 60 })
    .withMessage('Last name must be between 2 and 60 characters'),

  body('isbn')
    .optional()
    .trim()
    .notEmpty().withMessage('ISBN is required')
    .custom(value => {
    if (!validator.isISBN(value)) {
      throw new Error('Invalid ISBN format');
    }
    return true;
  }),

  body('publisher')
    .optional()
    .trim()
    .notEmpty().withMessage('Publisher is required')
    .isLength({ min: 2, max: 60 })
    .withMessage('Publisher must be between 2 and 60 characters'),

  body('genres')
    .optional()
    .isArray().withMessage('Genres must be an array')
    .custom((genres) => {
      const invalid = genres.find(g => typeof g !== 'string' || g.trim() === '');
      if (invalid) throw new Error('All genres must be non-empty strings');
      return true;
    }),

  body('numOfPages')
    .optional()
    .notEmpty().withMessage('Number of pages is required')
    .isInt({ min: 1 }).withMessage('Number of pages must be at least 1'),

  body('publicationYear')
    .optional()
    .notEmpty().withMessage('Publication year is required')
    .isInt({ min: 1000, max: new Date().getFullYear() })
    .withMessage('Publication year must be a valid year'),

  body('rating.average')
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage('Average rating must be between 0 and 5'),

  body('rating.count')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Rating count must be 0 or greater'),
];

module.exports = {
  bookCreateValidation, bookUpdateValidation
};