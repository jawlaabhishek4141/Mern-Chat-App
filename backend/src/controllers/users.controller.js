const asyncHandler = require('../utils/asyncHandler');
const userService = require('../services/user.service');

/**
 * GET /api/users/online
 * List of currently online users (protected route).
 */
const getOnlineUsers = asyncHandler(async (req, res) => {
  const users = await userService.getOnlineUsers();
  res.status(200).json({ users });
});

module.exports = { getOnlineUsers };
