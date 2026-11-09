import type { WorkspaceState } from '../../types/assistant';
import DynamicChart from './DynamicChart';
import DynamicDataTable from './DynamicDataTable';
import QuerySummary from './QuerySummary';
import ResultMetadata from './ResultMetadata';
import ResultsLoading from './ResultsLoading';
import SqlViewer from './SqlViewer';

/** Renders purely from the JSON in `state`; nothing here knows about specific modules or columns. */
export default function ResultsWorkspace({ state }: { state: WorkspaceState }) {
  const { result, response } = state;
  return (
    <div className="mx-auto max-w-6xl space-y-5 px-6 pb-32 pt-8">
      <QuerySummary state={state} />

      {state.phase === 'error' && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <p className="font-medium">The query could not be completed</p>
          <p className="mt-1">{state.error} Ask again from the assistant, or rephrase the question.</p>
        </div>
      )}

      {state.phase === 'loading' && !result && <ResultsLoading steps={state.steps} sql={state.sql} />}
      {response && <ResultMetadata response={response} />}
      {result && <DynamicChart result={result} config={response?.chart} />}
      {result && <DynamicDataTable columns={result.columns} rows={result.rows} totalRecords={result.totalRecords} />}
      {state.sql && state.phase !== 'loading' && <SqlViewer sql={state.sql} />}
    </div>
  );
}
