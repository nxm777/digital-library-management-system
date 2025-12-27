const { body } = require('express-validator');

const usernameRegex = /^[a-zA-Z0-9]+(?: [a-zA-Z0-9]+)*$/;

const registerValidation = [
    body('firstName')
        .trim()
        .notEmpty().withMessage('First name is required')
        .isLength({ min: 2, max: 30 }).withMessage('First name must be between 2 and 30 characters'),

    body('lastName')
        .trim()
        .notEmpty().withMessage('Last name is required')
        .isLength({ min: 2, max: 60 }).withMessage('Last name must be between 2 and 60 characters'),

    body('username')
        .trim()
        .notEmpty().withMessage('Username is required')
        .isLength({ min: 3, max: 40 }).withMessage('Username must be between 3 and 40 characters')
        .matches(usernameRegex)
        .withMessage('Username can only contain letters, numbers, and single spaces between words'),

    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please enter a valid email address'),

    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
        .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
        .matches(/[0-9]/).withMessage('Password must contain at least one number')
        .matches(/[^a-zA-Z0-9]/).withMessage('Password must contain at least one special character')
];

const loginValidation = [
    body('emailOrUsername')
        .trim()
        .notEmpty().withMessage('Email or username is required'),
  
    body('password')
        .notEmpty().withMessage('Password is required')
];
  
module.exports = {
    registerValidation,
    loginValidation
};