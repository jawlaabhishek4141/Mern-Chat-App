import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import ChatWindow from '../components/ChatWindow';
import TypingIndicator from '../components/TypingIndicator';
import ChatInput from '../components/ChatInput';
import OnlineUsersSidebar from '../components/OnlineUsersSidebar';
import { useAuth } from '../context/AuthContext';
import { useSocketContext } from '../context/SocketContext';
import * as messageService from '../services/messageService';

export default function ChatPage() {
  const { user } = useAuth();
  const {
    connected,
    messages,
    seedMessages,
    onlineUsers,
    typingUsers,
    socketError,
    sendMessage,
    notifyTyping,
    markRead,
  } = useSocketContext();

  const [historyLoading, setHistoryLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const hasSeeded = useRef(false);
  const lastToastedError = useRef(null);

  // Load persisted chat history once on mount so refreshing still shows
  // prior messages, exactly as the brief requires.
  useEffect(() => {
    let cancelled = false;
    async function loadHistory() {
      try {
        const { messages: history } = await messageService.fetchMessages({ limit: 100 });
        if (!cancelled && !hasSeeded.current) {
          seedMessages(history);
          hasSeeded.current = true;
        }
      } catch (err) {
        if (!cancelled) toast.error(err.message || 'Could not load chat history');
      } finally {
        if (!cancelled) setHistoryLoading(false);
      }
    }
    loadHistory();
    return () => {
      cancelled = true;
    };
  }, [seedMessages]);

  // Mark incoming messages as read while this screen is open.
  useEffect(() => {
    if (!historyLoading) markRead();
  }, [messages.length, historyLoading, markRead]);

  // Surface socket-level errors as toasts, once per distinct message.
  useEffect(() => {
    if (socketError && socketError !== lastToastedError.current) {
      toast.error(socketError);
      lastToastedError.current = socketError;
    }
  }, [socketError]);

  async function handleSend(text) {
    try {
      await sendMessage(text);
    } catch {
      // Socket path failed (e.g. dropped mid-send) - fall back to REST so
      // the message isn't silently lost.
      await messageService.sendMessageRest(text);
    }
  }

  return (
    <div className="flex h-screen flex-col bg-slate-50 dark:bg-ink-900">
      <Navbar />

      {!connected && (
        <div className="flex-shrink-0 bg-amber/10 px-4 py-1.5 text-center font-mono text-xs text-amber-dark dark:text-amber">
          Reconnecting to the server…
        </div>
      )}

      <div className="flex min-h-0 flex-1">
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center justify-between px-4 py-2 sm:px-6 lg:hidden">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="font-mono text-xs text-slate-500 underline-offset-2 hover:underline dark:text-slate-400"
            >
              {onlineUsers.length} online
            </button>
          </div>

          <ChatWindow messages={messages} currentUsername={user?.username} loading={historyLoading} />
          <TypingIndicator typingUsers={typingUsers} />
          <ChatInput onSend={handleSend} onTyping={notifyTyping} disabled={!connected} />
        </div>

        <OnlineUsersSidebar
          onlineUsers={onlineUsers}
          currentUsername={user?.username}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      </div>
    </div>
  );
}
