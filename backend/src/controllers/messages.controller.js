const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const messageService = require('../services/message.service');

/**
 * GET /api/messages?limit=&offset=
 * Chat history, oldest first (protected route).
 */
const getMessages = asyncHandler(async (req, res) => {
  const limit = req.query.limit || 50;
  const offset = req.query.offset || 0;
  const result = await messageService.getHistory({ limit, offset });
  res.status(200).json(result);
});

/**
 * POST /api/messages  { text }
 * Persists a message as the authenticated user and broadcasts it over
 * Socket.io so it reaches everyone instantly - REST stays the durable
 * write path, sockets are just the real-time fan-out.
 */
const createMessage = asyncHandler(async (req, res) => {
  const { text } = req.body;

  const message = await messageService.createMessage({
    senderId: req.user._id,
    senderUsername: req.user.username,
    text,
  });

  const io = req.app.get('io');
  if (io) {
    io.emit('message', message);
  }

  res.status(201).json(message);
});

/**
 * PUT /api/messages/read/:id
 * Marks a single message as read.
 */
const markRead = asyncHandler(async (req, res) => {
  const message = await messageService.markMessageRead(req.params.id);
  if (!message) {
    throw new ApiError(404, 'Message not found');
  }

  const io = req.app.get('io');
  if (io) {
    io.emit('message_read', { id: message._id, status: message.status });
  }

  res.status(200).json(message);
});

module.exports = { getMessages, createMessage, markRead };
