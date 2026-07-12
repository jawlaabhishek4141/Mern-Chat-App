const jwt = require('jsonwebtoken');
const config = require('../config/env');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/User');

/**
 * Protects a REST route: requires `Authorization: Bearer <token>`,
 * verifies it, and loads the current user onto req.user. Rejects with 401
 * if the token is missing/invalid or the user no longer exists.
 */
const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    throw new ApiError(401, 'Not authorized - no token provided');
  }

  let decoded;
  try {
    decoded = jwt.verify(token, config.jwtSecret);
  } catch {
    throw new ApiError(401, 'Not authorized - invalid or expired token');
  }

  const user = await User.findById(decoded.id).select('_id username');
  if (!user) {
    throw new ApiError(401, 'Not authorized - user no longer exists');
  }

  req.user = user;
  next();
});

module.exports = { protect };
