const Message = require('../models/Message');

/** Persist a new message from a given (already-authenticated) sender. */
async function createMessage({ senderId, senderUsername, text }) {
  const message = await Message.create({
    sender: senderId,
    senderUsername,
    text,
  });
  return message;
}

/** Chat history, oldest first, paginated. */
async function getHistory({ limit = 50, offset = 0 } = {}) {
  const [messages, total] = await Promise.all([
    Message.find().sort({ createdAt: 1 }).skip(offset).limit(limit).lean(),
    Message.countDocuments(),
  ]);
  return { messages, total, limit, offset };
}

/** Mark a single message as read by id. */
async function markMessageRead(id) {
  const message = await Message.findByIdAndUpdate(
    id,
    { status: 'read' },
    { new: true }
  );
  return message;
}

/** Mark every message not sent by `username` as read (bulk, used by sockets). */
async function markAllReadExceptSender(username) {
  await Message.updateMany(
    { senderUsername: { $ne: username }, status: { $ne: 'read' } },
    { status: 'read' }
  );
}

/** Mark every message as delivered (used once a second user comes online). */
async function markAllDelivered() {
  await Message.updateMany({ status: 'sent' }, { status: 'delivered' });
}

module.exports = {
  createMessage,
  getHistory,
  markMessageRead,
  markAllReadExceptSender,
  markAllDelivered,
};
