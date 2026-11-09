import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { MODULES } from '../../types/assistant';
import type { WorkspaceState } from '../../types/assistant';

export default function QuerySummary({ state }: { state: WorkspaceState }) {
  const moduleLabel = MODULES.find((m) => m.id === state.module)?.label ?? state.module;
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5">
      <p className="text-xs text-slate-500">{moduleLabel}</p>
      <h1 className="mt-1 text-xl font-semibold text-navy-900">{state.question}</h1>
      <div className="mt-3 flex items-start gap-2 text-sm text-slate-700">
        {state.phase === 'loading' && <><Loader2 size={16} className="mt-0.5 animate-spin text-signal-500" /><span>{state.summary ?? 'Working on it…'}</span></>}
        {state.phase === 'done' && <><CheckCircle2 size={16} className="mt-0.5 text-signal-500" /><span>{state.summary ?? 'Completed.'}</span></>}
        {state.phase === 'error' && <><AlertCircle size={16} className="mt-0.5 text-red-600" /><span>Failed.</span></>}
      </div>
    </section>
  );
}
