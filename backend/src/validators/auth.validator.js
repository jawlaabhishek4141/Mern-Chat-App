const { body } = require('express-validator');

// Letters, numbers, spaces, underscore, dot, hyphen - matches the
// frontend's own client-side check so error messages stay consistent.
const USERNAME_PATTERN = /^[a-zA-Z0-9_.\- ]+$/;

const loginValidator = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('username is required')
    .isLength({ min: 2, max: 20 })
    .withMessage('username must be between 2 and 20 characters')
    .matches(USERNAME_PATTERN)
    .withMessage('username may only contain letters, numbers, spaces, _ . -')
    .escape(),
];

module.exports = { loginValidator };
