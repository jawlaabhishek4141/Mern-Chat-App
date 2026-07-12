import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocketContext } from '../context/SocketContext';
import { useTheme } from '../context/ThemeContext';
import { useClickOutside } from '../hooks/useClickOutside';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { connected, onlineUsers } = useSocketContext();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  useClickOutside(menuRef, () => setMenuOpen(false));

  const otherOnlineCount = onlineUsers.filter((u) => u !== user?.username).length;

  return (
    <header className="flex flex-shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 py-3 dark:border-ink-700 dark:bg-ink-800 sm:px-6">
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber to-amber-dark">
          <span className="h-2.5 w-2.5 rounded-full bg-ink-900" />
        </div>
        <div className="min-w-0">
          <h1 className="font-display text-base font-semibold leading-tight">General Room</h1>
          <p className="truncate font-mono text-xs text-slate-500 dark:text-slate-400">
            <span
              className={`mr-1.5 inline-block h-2 w-2 rounded-full ${
                connected ? 'animate-pulse bg-sage' : 'bg-coral'
              }`}
            />
            {connected
              ? otherOnlineCount > 0
                ? `${otherOnlineCount} other${otherOnlineCount > 1 ? 's' : ''} online`
                : 'Only you are here'
              : 'Reconnecting…'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={toggleTheme}
          className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-amber hover:text-amber dark:border-ink-600 dark:text-slate-400"
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.8" />
              <path
                d="M12 2.5v2M12 19.5v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2.5 12h2M19.5 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 rounded-lg border border-slate-200 py-1.5 pl-1.5 pr-3 transition hover:border-amber dark:border-ink-600"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber text-xs font-semibold text-ink-900">
              {user?.username?.[0]?.toUpperCase()}
            </span>
            <span className="hidden max-w-[100px] truncate font-mono text-xs text-slate-600 dark:text-slate-300 sm:inline">
              {user?.username}
            </span>
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-2 w-40 rounded-lg border border-slate-200 bg-white py-1 shadow-lg dark:border-ink-600 dark:bg-ink-800">
              <button
                type="button"
                onClick={logout}
                className="w-full px-3 py-2 text-left text-sm text-coral transition hover:bg-slate-50 dark:hover:bg-ink-700"
              >
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
