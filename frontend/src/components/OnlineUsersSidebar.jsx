export default function OnlineUsersSidebar({ onlineUsers, currentUsername, open, onClose }) {
  const others = onlineUsers.filter((u) => u !== currentUsername);

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 right-0 z-30 w-64 flex-shrink-0 transform border-l border-slate-200 bg-white p-4 transition-transform dark:border-ink-700 dark:bg-ink-800 lg:static lg:z-auto lg:translate-x-0 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-sm font-semibold">Online now</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 lg:hidden"
            aria-label="Close online users panel"
          >
            ✕
          </button>
        </div>

        {currentUsername && (
          <div className="mb-2 flex items-center gap-2 rounded-lg bg-slate-50 px-2.5 py-2 dark:bg-ink-700">
            <span className="h-2 w-2 flex-shrink-0 rounded-full bg-sage" />
            <span className="truncate text-sm font-medium">{currentUsername}</span>
            <span className="ml-auto flex-shrink-0 font-mono text-[10px] text-slate-400">you</span>
          </div>
        )}

        {others.length === 0 ? (
          <p className="mt-2 font-mono text-xs text-slate-500 dark:text-slate-400">
            Nobody else is online right now.
          </p>
        ) : (
          <ul className="flex flex-col gap-1">
            {others.map((username) => (
              <li
                key={username}
                className="flex items-center gap-2 rounded-lg px-2.5 py-2 hover:bg-slate-50 dark:hover:bg-ink-700"
              >
                <span className="h-2 w-2 flex-shrink-0 rounded-full bg-sage" />
                <span className="truncate text-sm">{username}</span>
              </li>
            ))}
          </ul>
        )}
      </aside>
    </>
  );
}
