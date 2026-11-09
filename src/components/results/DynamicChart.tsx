import type { ChartConfig, QueryResult } from '../../types/results';

interface Point { label: string; value: number }

function buildSeries(result: QueryResult, config?: ChartConfig): { points: Point[]; title: string } | null {
  const { columns, rows } = result;
  const label = (key: string) => columns.find((c) => c.key === key)?.label ?? key;

  if (config?.yKey && columns.some((c) => c.key === config.xKey) && columns.some((c) => c.key === config.yKey)) {
    const points = rows.slice(0, 24).map((r) => ({ label: String(r[config.xKey] ?? ''), value: Number(r[config.yKey!]) || 0 }));
    return { points, title: config.title ?? `${label(config.yKey)} by ${label(config.xKey)}` };
  }

  // Count rows grouped by a categorical column: the configured one, or the first with 2-12 distinct values.
  const categorical = columns.filter((c) => c.type === 'string' || c.type === 'status' || c.type === undefined);
  const candidates = config && columns.some((c) => c.key === config.xKey) ? [columns.find((c) => c.key === config.xKey)!] : categorical;
  for (const col of candidates) {
    const counts = new Map<string, number>();
    rows.forEach((r) => counts.set(String(r[col.key] ?? 'Unknown'), (counts.get(String(r[col.key] ?? 'Unknown')) ?? 0) + 1));
    if (counts.size >= 2 && counts.size <= 12) {
      return { points: [...counts].map(([l, v]) => ({ label: l, value: v })), title: config?.title ?? `Records by ${col.label}` };
    }
  }
  return null;
}

export default function DynamicChart({ result, config }: { result: QueryResult; config?: ChartConfig }) {
  if (!result.rows.length) return null;
  const series = buildSeries(result, config);
  if (!series || series.points.length < 2) return null;
  const { points, title } = series;
  const max = Math.max(...points.map((p) => p.value), 1);
  const useLine = config?.type === 'line' && !!config.yKey;

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="mb-4 text-sm font-medium text-navy-900">{title}</h2>
      {useLine ? <LineChart points={points} max={max} /> : (
        <ul className="space-y-2">
          {points.map((p) => (
            <li key={p.label} className="flex items-center gap-3 text-xs">
              <span className="w-32 shrink-0 truncate text-right text-slate-600" title={p.label}>{p.label}</span>
              <div className="h-5 flex-1 rounded bg-slate-100">
                <div className="h-full rounded bg-navy-700 transition-[width] duration-500" style={{ width: `${(p.value / max) * 100}%` }} />
              </div>
              <span className="w-12 font-mono text-slate-700">{p.value.toLocaleString()}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function LineChart({ points, max }: { points: Point[]; max: number }) {
  const W = 640, H = 180, P = 24;
  const x = (i: number) => P + (i * (W - P * 2)) / (points.length - 1);
  const y = (v: number) => H - P - (v / max) * (H - P * 2);
  const step = Math.ceil(points.length / 8);
  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-[420px]" role="img" aria-label="Line chart">
        <line x1={P} x2={W - P} y1={H - P} y2={H - P} stroke="#CBD5E1" />
        <polyline fill="none" stroke="#1F9D8B" strokeWidth="2" points={points.map((p, i) => `${x(i)},${y(p.value)}`).join(' ')} />
        {points.map((p, i) => (
          <g key={`${p.label}-${i}`}>
            <circle cx={x(i)} cy={y(p.value)} r="3" fill="#1F9D8B"><title>{`${p.label}: ${p.value}`}</title></circle>
            {i % step === 0 && <text x={x(i)} y={H - 6} textAnchor="middle" fontSize="10" fill="#64748B">{p.label}</text>}
          </g>
        ))}
        <text x={P} y={12} fontSize="10" fill="#64748B">max {max.toLocaleString()}</text>
      </svg>
    </div>
  );
}
