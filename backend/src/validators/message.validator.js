const { body, param, query } = require('express-validator');

const createMessageValidator = [
  body('text')
    .trim()
    .notEmpty()
    .withMessage('text is required')
    .isLength({ max: 2000 })
    .withMessage('text must be 2000 characters or fewer'),
];

const listMessagesValidator = [
  query('limit').optional().isInt({ min: 1, max: 200 }).toInt(),
  query('offset').optional().isInt({ min: 0 }).toInt(),
];

const markReadValidator = [
  param('id').isMongoId().withMessage('invalid message id'),
];

module.exports = { createMessageValidator, listMessagesValidator, markReadValidator };
