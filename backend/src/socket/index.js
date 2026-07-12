const socketAuth = require('./socketAuth');
const messageService = require('../services/message.service');
const userService = require('../services/user.service');

const ROOM = 'general'; // single shared room for this assignment's scope

// username -> Set of socket ids (a user can have multiple tabs/devices open)
const onlineSockets = new Map();

function addSocket(username, socketId) {
  if (!onlineSockets.has(username)) onlineSockets.set(username, new Set());
  onlineSockets.get(username).add(socketId);
  return onlineSockets.get(username).size === 1; // true if user just came online
}

function removeSocket(username, socketId) {
  const set = onlineSockets.get(username);
  if (!set) return false;
  set.delete(socketId);
  if (set.size === 0) {
    onlineSockets.delete(username);
    return true; // true if user just went fully offline
  }
  return false;
}

function getOnlineUsernames() {
  return Array.from(onlineSockets.keys());
}

/**
 * Wires up every Socket.io event for the app. Called once from server.js
 * with the `io` instance. All sockets are authenticated via JWT before
 * any handler here runs (see socketAuth.js).
 */
function registerSocketHandlers(io) {
  io.use(socketAuth);

  io.on('connection', (socket) => {
    const { username, id: userId } = socket.user;
    console.log(`[socket] connected: ${socket.id} (${username})`);

    socket.join(ROOM);

    // --- Presence: mark this user online the moment they connect --------
    (async () => {
      try {
        const justCameOnline = addSocket(username, socket.id);
        if (justCameOnline) {
          await userService.setUserOnline(userId, true);
          io.to(ROOM).emit('user_online', { username });
        }
        io.to(ROOM).emit('online_users', getOnlineUsernames());

        // A second person being online means prior messages are now
        // deliverable - bump any still-"sent" messages to "delivered".
        if (getOnlineUsernames().length > 1) {
          await messageService.markAllDelivered();
          io.to(ROOM).emit('messages_delivered');
        }
      } catch (err) {
        console.error('[socket] presence setup error', err);
      }
    })();

    // --- Messaging --------------------------------------------------------
    socket.on('message', async (payload, ack) => {
      try {
        const text = payload?.text;
        if (!text || !text.trim()) {
          const errMsg = 'text is required';
          if (typeof ack === 'function') ack({ ok: false, error: errMsg });
          socket.emit('error_message', errMsg);
          return;
        }
        if (text.length > 2000) {
          const errMsg = 'text exceeds 2000 characters';
          if (typeof ack === 'function') ack({ ok: false, error: errMsg });
          socket.emit('error_message', errMsg);
          return;
        }

        const message = await messageService.createMessage({
          senderId: userId,
          senderUsername: username,
          text: text.trim(),
        });

        io.to(ROOM).emit('message', message);

        if (getOnlineUsernames().length > 1) {
          await messageService.markAllDelivered();
          io.to(ROOM).emit('messages_delivered');
        }

        if (typeof ack === 'function') ack({ ok: true, message });
      } catch (err) {
        console.error('[socket] message error', err);
        if (typeof ack === 'function') ack({ ok: false, error: 'Failed to send message' });
        socket.emit('error_message', 'Failed to send message');
      }
    });

    // Client tells the server it has read what's currently in view.
    socket.on('message_read', async () => {
      try {
        await messageService.markAllReadExceptSender(username);
        io.to(ROOM).emit('message_read', { reader: username });
      } catch (err) {
        console.error('[socket] message_read error', err);
      }
    });

    // --- Typing indicator ---------------------------------------------------
    socket.on('typing', () => {
      socket.to(ROOM).emit('typing', { username });
    });

    socket.on('stop_typing', () => {
      socket.to(ROOM).emit('stop_typing', { username });
    });

    // --- Room management (kept simple - one shared room by default) -------
    socket.on('join_room', (room) => {
      socket.join(room || ROOM);
    });

    socket.on('leave_room', (room) => {
      socket.leave(room || ROOM);
    });

    // --- Disconnect -----------------------------------------------------
    socket.on('disconnect', async (reason) => {
      console.log(`[socket] disconnected: ${socket.id} (${username}) - ${reason}`);
      try {
        const wentFullyOffline = removeSocket(username, socket.id);
        if (wentFullyOffline) {
          await userService.setUserOnline(userId, false);
          io.to(ROOM).emit('user_offline', { username });
        }
        io.to(ROOM).emit('online_users', getOnlineUsernames());
        // Don't leave a stale "is typing…" indicator if the tab closes
        // mid-keystroke.
        socket.to(ROOM).emit('stop_typing', { username });
      } catch (err) {
        console.error('[socket] disconnect cleanup error', err);
      }
    });

    socket.on('error', (err) => {
      console.error(`[socket] transport error on ${socket.id}`, err);
    });
  });
}

module.exports = { registerSocketHandlers, getOnlineUsernames };
