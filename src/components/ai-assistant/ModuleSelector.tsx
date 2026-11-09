import { useAssistant } from '../../context/AssistantProvider';
import { MODULES } from '../../types/assistant';
import type { ModuleId } from '../../types/assistant';

export default function ModuleSelector() {
  const { module, setModule } = useAssistant();
  return (
    <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-4 py-2">
      <label htmlFor="module-select" className="text-xs text-slate-500">Module</label>
      <select
        id="module-select"
        value={module}
        onChange={(e) => setModule(e.target.value as ModuleId)}
        className="flex-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-navy-900"
      >
        {MODULES.map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}
      </select>
    </div>
  );
}
