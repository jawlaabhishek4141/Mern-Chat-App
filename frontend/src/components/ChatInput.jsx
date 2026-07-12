import { useState } from 'react';
import toast from 'react-hot-toast';

export default function ChatInput({ onSend, onTyping, disabled }) {
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || sending) return;

    setSending(true);
    try {
      await onSend(trimmed);
      setText('');
    } catch (err) {
      toast.error(err.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-shrink-0 items-end gap-2 border-t border-slate-200 px-4 py-3 dark:border-ink-700 sm:px-6"
    >
      <textarea
        className="max-h-36 flex-1 resize-none rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-[14.5px] leading-snug text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-amber disabled:opacity-60 dark:border-ink-700 dark:bg-ink-800 dark:text-slate-100"
        placeholder={disabled ? 'Reconnecting…' : 'Write a message'}
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          onTyping();
        }}
        onKeyDown={handleKeyDown}
        rows={1}
        maxLength={2000}
        disabled={disabled}
      />
      <button
        type="submit"
        disabled={disabled || !text.trim() || sending}
        aria-label="Send message"
        className="flex h-[42px] w-[42px] flex-shrink-0 items-center justify-center rounded-xl bg-amber text-ink-900 transition hover:bg-amber-dark active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M3 11.5L21 3l-7.5 18-3-7.5-7.5-2z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </form>
  );
}
