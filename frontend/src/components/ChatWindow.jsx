import MessageBubble from './MessageBubble';
import Loader from './Loader';
import { dayKey, formatDayLabel } from '../utils/time';
import { useAutoScroll } from '../hooks/useAutoScroll';

export default function ChatWindow({ messages, currentUsername, loading }) {
  const bottomRef = useAutoScroll(messages.length);

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader label="Loading conversation…" />
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center">
        <span className="text-3xl">👋</span>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          No messages yet. Say hello to get the conversation started.
        </p>
      </div>
    );
  }

  let lastDayKey = null;
  let lastSender = null;

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6">
      <div className="flex flex-col gap-[3px]">
        {messages.map((message) => {
          const isOwn = message.senderUsername === currentUsername;
          const thisDayKey = dayKey(message.createdAt);
          const showDivider = thisDayKey !== lastDayKey;
          const showSender = showDivider || message.senderUsername !== lastSender;
          lastDayKey = thisDayKey;
          lastSender = message.senderUsername;

          return (
            <div key={message._id}>
              {showDivider && (
                <div className="my-3.5 flex justify-center">
                  <span className="rounded-full bg-slate-100 px-3 py-1 font-mono text-[11px] uppercase tracking-wide text-slate-500 dark:bg-ink-800 dark:text-slate-400">
                    {formatDayLabel(message.createdAt)}
                  </span>
                </div>
              )}
              <MessageBubble message={message} isOwn={isOwn} showSender={showSender} />
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
