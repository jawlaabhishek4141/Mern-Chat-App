/** Small reusable spinner. `full` centers it in the viewport for page-level loads. */
export default function Loader({ full = false, label = 'Loading…' }) {
  const spinner = (
    <div className="flex flex-col items-center gap-3" role="status" aria-live="polite">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-amber border-t-transparent" />
      <span className="font-mono text-xs text-slate-500 dark:text-slate-400">{label}</span>
    </div>
  );

  if (!full) return spinner;

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-ink-900">
      {spinner}
    </div>
  );
}
