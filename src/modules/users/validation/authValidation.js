const { body } = require('express-validator');
const validateSchema = [
    body('email').notEmpty().withMessage('Email is require.').normalizeEmail().isEmail().trim(),
    body('password').notEmpty().withMessage('Password is require.').trim()
]
module.exports = validateSchema;
