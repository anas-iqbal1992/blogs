const { body } = require('express-validator');
const validateSchema = [
    body('name').notEmpty().withMessage('Name is require.').isString().trim(),
    body('email').notEmpty().withMessage('Email is require.').normalizeEmail().isEmail().trim(),
    body('phone').notEmpty().withMessage('Phone is require.').isNumeric().isLength({ min: 10,max:10 }).trim(),
    body('gender').notEmpty().withMessage('Gender is require.').trim()
];
module.exports = validateSchema;
