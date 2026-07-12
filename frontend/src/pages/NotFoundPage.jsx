import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-slate-50 px-6 text-center dark:bg-ink-900">
      <h1 className="font-display text-5xl font-bold text-amber">404</h1>
      <p className="text-slate-500 dark:text-slate-400">This page doesn't exist.</p>
      <Link
        to="/"
        className="mt-2 rounded-lg bg-amber px-4 py-2 font-display text-sm font-semibold text-ink-900 transition hover:bg-amber-dark"
      >
        Back to chat
      </Link>
    </div>
  );
}
