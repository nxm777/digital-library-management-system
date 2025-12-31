const { body } = require('express-validator');

const readingListCreateValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Tytuł listy jest wymagany.')
    .isLength({ max: 100 }).withMessage('Tytuł nie może przekraczać 100 znaków.'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Opis nie może przekraczać 500 znaków.'),
  body('tags')
    .optional()
    .isArray().withMessage('Tagi muszą być tablicą.')
    .custom((tags) => tags.every(tag => typeof tag === 'string'))
    .withMessage('Każdy tag musi być tekstem.')
];

module.exports = { readingListCreateValidation }