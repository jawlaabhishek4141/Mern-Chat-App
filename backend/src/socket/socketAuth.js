const jwt = require('jsonwebtoken');
const config = require('../config/env');
const User = require('../models/User');

/**
 * Socket.io middleware: verifies the JWT sent in the connection handshake
 * (`socket.handshake.auth.token`) and attaches the user to the socket.
 * Rejects the connection outright if the token is missing/invalid, so no
 * unauthenticated socket ever reaches the app's event handlers.
 */
async function socketAuth(socket, next) {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) {
      return next(new Error('Authentication error: no token provided'));
    }

    const decoded = jwt.verify(token, config.jwtSecret);
    const user = await User.findById(decoded.id).select('_id username');
    if (!user) {
      return next(new Error('Authentication error: user no longer exists'));
    }

    socket.user = { id: user._id.toString(), username: user.username };
    next();
  } catch (err) {
    next(new Error('Authentication error: invalid or expired token'));
  }
}

module.exports = socketAuth;
