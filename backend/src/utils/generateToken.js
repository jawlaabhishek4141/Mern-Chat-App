const jwt = require('jsonwebtoken');
const config = require('../config/env');

/**
 * Issues a JWT for a user. The payload is intentionally minimal (id +
 * username) - anything else needed should be looked up from the DB using
 * the id, not trusted from the token.
 */
function generateToken(user) {
  return jwt.sign(
    { id: user._id.toString(), username: user.username },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );
}

module.exports = generateToken;
