const mongoose = require('mongoose');

/**
 * Dummy-auth user: identified purely by a unique username, no password.
 * `isOnline` / `lastSeen` are kept here so REST clients (e.g. GET
 * /api/users/online) can read presence without needing a live socket
 * connection; the socket layer is the source of truth that updates them.
 */
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'username is required'],
      trim: true,
      unique: true,
      minlength: 2,
      maxlength: 20,
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    lastSeen: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
