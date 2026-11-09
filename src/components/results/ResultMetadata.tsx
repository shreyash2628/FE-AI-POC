import type { AssistantResponse } from '../../types/results';

const LABELS: Record<string, string> = { executionTimeMs: 'Execution time', sourceModule: 'Source module' };

export default function ResultMetadata({ response }: { response: AssistantResponse }) {
  const { metadata = {}, result, status } = response;
  const items: [string, string][] = [
    ['Status', status],
    ['Records', result ? result.totalRecords.toLocaleString() : '0'],
    ...Object.entries(metadata)
      .filter(([, v]) => v !== undefined)
      .map(([k, v]): [string, string] => [LABELS[k] ?? k, k === 'executionTimeMs' ? `${Number(v).toLocaleString()} ms` : String(v)]),
  ];
  return (
    <dl className="flex flex-wrap gap-x-8 gap-y-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm">
      {items.map(([k, v]) => (
        <div key={k}>
          <dt className="text-xs text-slate-500">{k}</dt>
          <dd className={`font-medium ${k === 'Status' && v !== 'SUCCESS' ? 'text-amber-600' : 'text-navy-900'}`}>{v}</dd>
        </div>
      ))}
    </dl>
  );
}
