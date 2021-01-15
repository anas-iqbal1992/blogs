const { body } = require('express-validator');
const validateSchema = [
    body('title').notEmpty().withMessage('Title is require.').isString().trim(),
    body('description').notEmpty().withMessage('Description is require.').isString().trim(),
]
module.exports = validateSchema;
