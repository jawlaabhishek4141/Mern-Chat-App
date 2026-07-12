const asyncHandler = require('../utils/asyncHandler');
const authService = require('../services/auth.service');

/**
 * POST /api/auth/login
 * Dummy username login - creates the user if new, always returns a JWT.
 */
const login = asyncHandler(async (req, res) => {
  const { username } = req.body;
  const { user, token } = await authService.loginWithUsername(username);

  res.status(200).json({
    token,
    user: { id: user._id, username: user.username },
  });
});

module.exports = { login };
