const User = require('../models/User');
const generateToken = require('../utils/generateToken');

/**
 * Dummy auth: find-or-create the user by username, then issue a JWT.
 * No password is ever checked or stored - this matches the assignment's
 * "username-based dummy authentication" requirement.
 */
async function loginWithUsername(username) {
  let user = await User.findOne({ username });
  if (!user) {
    user = await User.create({ username });
  }
  const token = generateToken(user);
  return { user, token };
}

module.exports = { loginWithUsername };
