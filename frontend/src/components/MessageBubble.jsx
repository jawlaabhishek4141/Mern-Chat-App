import { formatClock } from '../utils/time';

const STATUS_TICKS = {
  sent: '✓',
  delivered: '✓✓',
  read: '✓✓',
};

export default function MessageBubble({ message, isOwn, showSender }) {
  const { senderUsername, text, createdAt, status } = message;

  return (
    <div className={`flex animate-rise ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[78%] rounded-2xl px-3.5 py-2 sm:max-w-[65%] ${
          isOwn
            ? 'rounded-br-md bg-amber text-ink-900'
            : 'rounded-bl-md bg-slate-100 text-slate-900 dark:bg-ink-700 dark:text-slate-100'
        }`}
      >
        {showSender && !isOwn && (
          <div className="mb-0.5 font-display text-xs font-semibold text-sage">
            {senderUsername}
          </div>
        )}
        <div className="whitespace-pre-wrap break-words text-[14.5px] leading-snug">{text}</div>
        <div
          className={`mt-1 flex items-center justify-end gap-1 font-mono text-[10.5px] ${
            isOwn ? 'text-ink-900/65' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <span>{formatClock(createdAt)}</span>
          {isOwn && (
            <span className={status === 'read' ? 'text-sky-700' : ''} title={status}>
              {STATUS_TICKS[status] || '✓'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
