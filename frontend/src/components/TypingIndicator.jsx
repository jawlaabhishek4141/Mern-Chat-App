export default function TypingIndicator({ typingUsers }) {
  if (typingUsers.length === 0) return <div className="h-7 flex-shrink-0" aria-hidden="true" />;

  const label =
    typingUsers.length === 1
      ? `${typingUsers[0]} is typing…`
      : typingUsers.length === 2
        ? `${typingUsers[0]} and ${typingUsers[1]} are typing…`
        : `${typingUsers.length} people are typing…`;

  return (
    <div className="flex h-7 flex-shrink-0 items-center gap-2 px-4 sm:px-6" role="status">
      <span className="inline-flex gap-[3px]" aria-hidden="true">
        <span className="h-[5px] w-[5px] animate-bounce_dot rounded-full bg-amber [animation-delay:0s]" />
        <span className="h-[5px] w-[5px] animate-bounce_dot rounded-full bg-amber [animation-delay:0.15s]" />
        <span className="h-[5px] w-[5px] animate-bounce_dot rounded-full bg-amber [animation-delay:0.3s]" />
      </span>
      <span className="font-mono text-xs text-slate-500 dark:text-slate-400">{label}</span>
    </div>
  );
}
