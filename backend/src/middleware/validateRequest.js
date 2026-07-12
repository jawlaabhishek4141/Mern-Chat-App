const { validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

/**
 * Runs after an express-validator chain. Collects any validation errors
 * into a single readable message instead of Express's default array shape,
 * so every API error the client sees has the same { error: string } shape.
 */
function validateRequest(req, res, next) {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();

  const message = errors
    .array()
    .map((e) => e.msg)
    .join(', ');
  next(new ApiError(400, message));
}

module.exports = validateRequest;
