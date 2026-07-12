import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import { SOCKET_URL } from '../config';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

const TYPING_STOP_DELAY_MS = 1500;

/**
 * Owns the single Socket.io connection for the app. Connects only once a
 * JWT is available (from AuthContext) and authenticates the handshake with
 * it, matching the backend's socketAuth middleware. Exposes connection
 * status, live state (messages/presence/typing), and the actions
 * components need (sendMessage, notifyTyping, markRead).
 */
export function SocketProvider({ children }) {
  const { token, user, isAuthenticated } = useAuth();
  const socketRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const [socketError, setSocketError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated || !token) return undefined;

    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      setConnected(true);
      setSocketError(null);
      socket.emit('message_read');
    });

    socket.on('disconnect', () => setConnected(false));

    socket.on('connect_error', (err) => {
      setSocketError(err.message || 'Having trouble reaching the server. Retrying…');
    });

    socket.on('message', (message) => {
      setMessages((prev) => {
        if (prev.some((m) => m._id === message._id)) return prev; // avoid dupes
        return [...prev, message];
      });
    });

    socket.on('messages_delivered', () => {
      setMessages((prev) =>
        prev.map((m) => (m.status === 'sent' ? { ...m, status: 'delivered' } : m))
      );
    });

    socket.on('message_read', () => {
      setMessages((prev) => prev.map((m) => ({ ...m, status: 'read' })));
    });

    socket.on('online_users', (usernames) => setOnlineUsers(usernames));

    socket.on('user_online', () => {
      /* presence list itself arrives via online_users right after this */
    });
    socket.on('user_offline', () => {
      /* presence list itself arrives via online_users right after this */
    });

    socket.on('typing', ({ username }) => {
      setTypingUsers((prev) => new Set(prev).add(username));
    });

    socket.on('stop_typing', ({ username }) => {
      setTypingUsers((prev) => {
        const next = new Set(prev);
        next.delete(username);
        return next;
      });
    });

    socket.on('error_message', (msg) => setSocketError(msg));

    return () => {
      socket.disconnect();
      socketRef.current = null;
      clearTimeout(typingTimeoutRef.current);
    };
  }, [isAuthenticated, token]);

  const seedMessages = useCallback((history) => setMessages(history), []);

  const sendMessage = useCallback(
    (text) =>
      new Promise((resolve, reject) => {
        const socket = socketRef.current;
        if (!socket || !connected) {
          reject(new Error('Not connected to the server yet.'));
          return;
        }
        socket.emit('message', { text }, (ack) => {
          if (ack?.ok) resolve(ack.message);
          else reject(new Error(ack?.error || 'Failed to send message'));
        });
      }),
    [connected]
  );

  const notifyTyping = useCallback(() => {
    const socket = socketRef.current;
    if (!socket || !connected) return;

    socket.emit('typing');
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('stop_typing');
    }, TYPING_STOP_DELAY_MS);
  }, [connected]);

  const markRead = useCallback(() => {
    socketRef.current?.emit('message_read');
  }, []);

  const otherTypingUsers = Array.from(typingUsers).filter((u) => u !== user?.username);

  const value = {
    connected,
    messages,
    seedMessages,
    onlineUsers,
    typingUsers: otherTypingUsers,
    socketError,
    sendMessage,
    notifyTyping,
    markRead,
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
}

export function useSocketContext() {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error('useSocketContext must be used within a SocketProvider');
  return ctx;
}
