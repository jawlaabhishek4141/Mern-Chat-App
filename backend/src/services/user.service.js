const User = require('../models/User');

/** All users currently flagged online, most-recently-active first. */
async function getOnlineUsers() {
  return User.find({ isOnline: true }).sort({ lastSeen: -1 }).select('username lastSeen');
}

/** Flip a user's presence flag and bump lastSeen. */
async function setUserOnline(userId, isOnline) {
  return User.findByIdAndUpdate(
    userId,
    { isOnline, lastSeen: new Date() },
    { new: true }
  );
}

module.exports = { getOnlineUsers, setUserOnline };
