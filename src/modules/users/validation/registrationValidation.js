const { body } = require('express-validator');
const validateSchema = [
    body('name').notEmpty().withMessage('Name is require.').isString().trim(),
    body('email').notEmpty().withMessage('Email is require.').normalizeEmail().isEmail().trim(),
    body('phone').notEmpty().withMessage('Phone is require.').isNumeric().isLength({ min: 10,max:10 }).trim(),
    body('password').notEmpty().withMessage('Password is require.').isLength({ min: 4 })
        .withMessage('Password must be atlest 4 characters.').trim(),
    body('confirmPassword').notEmpty().trim().withMessage('Confirm Password is require.')
        .custom(async (confirmPassword, { req }) => {
            const password = req.body.password
            if (password !== confirmPassword) {
                throw new Error('Passwords must be same')
            }
        }),
    body('gender').notEmpty().withMessage('Gender is require.').trim()
];
module.exports = validateSchema;
