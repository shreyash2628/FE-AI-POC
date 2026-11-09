import { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight, Download, Search } from 'lucide-react';
import type { CellValue, ColumnType, ResultColumn, ResultRow } from '../../types/results';

interface Props { columns: ResultColumn[]; rows: ResultRow[]; totalRecords: number }
type Sort = { key: string; dir: 'asc' | 'desc' } | null;

const PAGE_SIZES = [10, 25, 50];

function compare(a: CellValue, b: CellValue, type?: ColumnType): number {
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;
  if (type === 'number' || (typeof a === 'number' && typeof b === 'number')) return Number(a) - Number(b);
  if (type === 'date') return Date.parse(String(a)) - Date.parse(String(b));
  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' });
}

function statusTone(v: string): string {
  const s = v.toLowerCase();
  if (/(complete|success|available|pass|active|hit|done)/.test(s)) return 'bg-emerald-50 text-emerald-700';
  if (/(progress|running|pending|queue|plan|low)/.test(s)) return 'bg-amber-50 text-amber-700';
  if (/(fail|error|deplet|reject|hold)/.test(s)) return 'bg-red-50 text-red-700';
  return 'bg-slate-100 text-slate-600';
}

function Cell({ value, type }: { value: CellValue; type?: ColumnType }) {
  if (value == null || value === '') return <span className="text-slate-300">–</span>;
  if (type === 'status') return <span className={`rounded-full px-2 py-0.5 text-xs ${statusTone(String(value))}`}>{String(value)}</span>;
  if (type === 'boolean') return <>{value === true || value === 'true' ? 'Yes' : 'No'}</>;
  if (type === 'number' && !Number.isNaN(Number(value))) return <>{Number(value).toLocaleString()}</>;
  if (type === 'date' && !Number.isNaN(Date.parse(String(value)))) return <>{new Date(String(value)).toLocaleDateString()}</>;
  return <>{String(value)}</>;
}

const csvCell = (v: CellValue) => {
  const s = v == null ? '' : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export default function DynamicDataTable({ columns, rows, totalRecords }: Props) {
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<Sort>(null);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  const processed = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q ? rows.filter((r) => columns.some((c) => String(r[c.key] ?? '').toLowerCase().includes(q))) : rows;
    if (!sort) return filtered;
    const type = columns.find((c) => c.key === sort.key)?.type;
    const m = sort.dir === 'asc' ? 1 : -1;
    return [...filtered].sort((a, b) => compare(a[sort.key], b[sort.key], type) * m);
  }, [rows, columns, query, sort]);

  const pages = Math.max(1, Math.ceil(processed.length / size));
  const current = Math.min(page, pages - 1);
  const visible = processed.slice(current * size, current * size + size);

  const toggleSort = (key: string) =>
    setSort((s) => (s?.key !== key ? { key, dir: 'asc' } : s.dir === 'asc' ? { key, dir: 'desc' } : null));

  const exportCsv = () => {
    const lines = [columns.map((c) => csvCell(c.label)).join(','), ...processed.map((r) => columns.map((c) => csvCell(r[c.key])).join(','))];
    const url = URL.createObjectURL(new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `nurix-results-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 px-5 py-3">
        <div className="relative">
          <Search size={15} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(0); }}
            placeholder="Search results"
            aria-label="Search results"
            className="w-64 rounded-lg border border-slate-200 py-1.5 pl-8 pr-3 text-sm outline-none focus:border-signal-500"
          />
        </div>
        <p className="text-xs text-slate-500">
          {processed.length.toLocaleString()} shown
          {totalRecords > rows.length && ` · ${rows.length.toLocaleString()} loaded of ${totalRecords.toLocaleString()} total`}
        </p>
        <button onClick={exportCsv} disabled={!processed.length} className="ml-auto flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-navy-900 hover:bg-slate-50 disabled:opacity-40">
          <Download size={14} /> Export CSV
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs text-slate-600">
            <tr>
              {columns.map((c) => {
                const active = sort?.key === c.key;
                const right = c.type === 'number';
                return (
                  <th key={c.key} scope="col" aria-sort={active ? (sort!.dir === 'asc' ? 'ascending' : 'descending') : 'none'} className="whitespace-nowrap font-medium">
                    <button onClick={() => toggleSort(c.key)} className={`flex w-full items-center gap-1 px-5 py-2.5 hover:text-navy-900 ${right ? 'justify-end' : ''}`}>
                      {c.label}
                      {active ? (sort!.dir === 'asc' ? <ArrowUp size={13} /> : <ArrowDown size={13} />) : <ArrowUpDown size={13} className="text-slate-300" />}
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {visible.map((r, i) => (
              <tr key={i} className="border-t border-slate-100 hover:bg-slate-50/60">
                {columns.map((c) => (
                  <td key={c.key} className={`whitespace-nowrap px-5 py-2.5 ${c.type === 'number' ? 'text-right font-mono text-xs' : ''}`}>
                    <Cell value={r[c.key]} type={c.type} />
                  </td>
                ))}
              </tr>
            ))}
            {!visible.length && (
              <tr><td colSpan={columns.length} className="px-5 py-10 text-center text-sm text-slate-500">
                {rows.length ? 'No rows match your search. Clear the search to see all results.' : 'The query returned no records.'}
              </td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 px-5 py-2.5 text-xs text-slate-600">
        <label className="flex items-center gap-2">
          Rows per page
          <select value={size} onChange={(e) => { setSize(Number(e.target.value)); setPage(0); }} className="rounded border border-slate-200 px-1.5 py-1">
            {PAGE_SIZES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </label>
        <div className="flex items-center gap-2">
          <span>Page {current + 1} of {pages}</span>
          <button onClick={() => setPage(current - 1)} disabled={current === 0} aria-label="Previous page" className="rounded p-1 hover:bg-slate-100 disabled:opacity-30"><ChevronLeft size={16} /></button>
          <button onClick={() => setPage(current + 1)} disabled={current >= pages - 1} aria-label="Next page" className="rounded p-1 hover:bg-slate-100 disabled:opacity-30"><ChevronRight size={16} /></button>
        </div>
      </div>
    </section>
  );
}
