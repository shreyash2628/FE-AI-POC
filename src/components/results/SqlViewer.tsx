import { useState } from 'react';
import { Check, ChevronDown, ChevronRight, Copy } from 'lucide-react';

export default function SqlViewer({ sql }: { sql: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(sql); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch { /* clipboard blocked */ }
  };
  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      <div className="flex items-center justify-between px-5 py-3">
        <button onClick={() => setOpen((o) => !o)} aria-expanded={open} className="flex items-center gap-1.5 text-sm font-medium text-navy-900">
          {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />} Generated SQL
        </button>
        {open && (
          <button onClick={copy} className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-slate-500 hover:bg-slate-100">
            {copied ? <Check size={13} /> : <Copy size={13} />} {copied ? 'Copied' : 'Copy'}
          </button>
        )}
      </div>
      {open && <pre className="overflow-x-auto rounded-b-xl bg-navy-900 p-4 font-mono text-xs leading-relaxed text-navy-100">{sql}</pre>}
    </section>
  );
}
