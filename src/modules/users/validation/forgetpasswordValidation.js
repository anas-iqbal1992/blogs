const { body } = require('express-validator');
const validateSchema = [
    body('email').notEmpty().withMessage('Email is require.').normalizeEmail().isEmail().trim(),
]
module.exports = validateSchema;