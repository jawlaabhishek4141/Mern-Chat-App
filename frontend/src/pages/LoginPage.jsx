import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmed = username.trim();
    if (!trimmed) {
      toast.error('Enter a name to join the room.');
      return;
    }

    setSubmitting(true);
    try {
      await login(trimmed);
      navigate('/', { replace: true });
    } catch (err) {
      toast.error(err.message || 'Could not sign in. Try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 dark:bg-ink-900">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[10%] top-[8%] h-72 w-72 rounded-full bg-amber/10 blur-3xl" />
        <div className="absolute bottom-[10%] right-[12%] h-72 w-72 rounded-full bg-sage/10 blur-3xl" />
      </div>

      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xl shadow-slate-900/5 dark:border-ink-700 dark:bg-ink-800">
        <div className="mx-auto mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-amber to-amber-dark">
          <span className="h-2.5 w-2.5 rounded-full bg-ink-900" />
        </div>
        <h1 className="font-display text-2xl font-bold tracking-tight">Wire</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Pick a name and join the room. No password — just show up.
        </p>

        <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-2 text-left">
          <label
            htmlFor="username"
            className="font-mono text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
          >
            Your name
          </label>
          <input
            id="username"
            type="text"
            placeholder="e.g. Aryan"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            maxLength={20}
            autoFocus
            autoComplete="off"
            className="rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-[15px] outline-none transition focus:border-amber dark:border-ink-600 dark:bg-ink-900 dark:text-slate-100"
          />
          <button
            type="submit"
            disabled={submitting}
            className="mt-3 rounded-lg bg-amber py-3 font-display font-semibold text-ink-900 transition hover:bg-amber-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Joining…' : 'Join the room'}
          </button>
        </form>
      </div>
    </div>
  );
}
