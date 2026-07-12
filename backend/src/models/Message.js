const mongoose = require('mongoose');

const MESSAGE_STATUSES = ['sent', 'delivered', 'read'];

/**
 * A single chat message in the shared room. `sender` is denormalized as
 * both a ref (for population/joins) and a plain username string (so the
 * frontend never has to populate just to render a message).
 */
const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    senderUsername: {
      type: String,
      required: true,
      trim: true,
    },
    text: {
      type: String,
      required: [true, 'text is required'],
      trim: true,
      minlength: 1,
      maxlength: 2000,
    },
    status: {
      type: String,
      enum: MESSAGE_STATUSES,
      default: 'sent',
    },
  },
  { timestamps: true }
);

messageSchema.index({ createdAt: 1 });

module.exports = mongoose.model('Message', messageSchema);
module.exports.MESSAGE_STATUSES = MESSAGE_STATUSES;
