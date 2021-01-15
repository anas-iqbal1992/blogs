const { body } = require('express-validator');
const validateSchema = [
    body('password').notEmpty().withMessage('Password is require.').isLength({ min: 4 })
        .withMessage('Password must be atlest 4 characters.').trim(),
    body('confirmPassword').notEmpty().trim().withMessage('Confirm Password is require.')
        .custom(async (confirmPassword, { req }) => {
            const password = req.body.password
            if (password !== confirmPassword) {
                throw new Error('Passwords must be same')
            }
        }),
    body('ucode').notEmpty()
];
module.exports = validateSchema;
