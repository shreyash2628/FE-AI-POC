import { Check, Loader2 } from 'lucide-react';

export default function ResultsLoading({ steps, sql }: { steps: string[]; sql?: string }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5" role="status" aria-live="polite">
      <ul className="space-y-2 text-sm">
        {steps.map((s, i) => {
          const active = i === steps.length - 1;
          return (
            <li key={`${s}-${i}`} className={`flex items-center gap-2 ${active ? 'text-navy-900' : 'text-slate-500'}`}>
              {active ? <Loader2 size={15} className="animate-spin text-signal-500" /> : <Check size={15} className="text-signal-500" />}
              {s}
            </li>
          );
        })}
      </ul>
      {sql && <pre className="mt-4 overflow-x-auto rounded-lg bg-navy-900 p-3 font-mono text-xs text-navy-100">{sql}</pre>}
      <div className="mt-5 space-y-2" aria-hidden>
        {[0, 1, 2, 3].map((i) => <div key={i} className="h-8 animate-pulse rounded bg-slate-100" style={{ width: `${100 - i * 8}%` }} />)}
      </div>
    </section>
  );
}
