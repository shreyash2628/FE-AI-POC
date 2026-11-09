import { useEffect, useRef } from 'react';
import { useAssistant } from '../../context/AssistantProvider';
import type { ModuleId } from '../../types/assistant';
import StreamingIndicator from './StreamingIndicator';

const SUGGESTIONS: Record<ModuleId, string[]> = {
  ALL: ['Show proteins produced in the last 30 days', 'List the latest hit screening results', 'Which inventory items are running low?'],
  CP: ['Show active campaigns by phase', 'Which campaigns start this quarter?'],
  PP: ['Show proteins produced in the last 30 days', 'Which protein batches failed?'],
  HR: ['Show resynthesized hits with purity above 90%', 'Which hits are still in synthesis?'],
  HS: ['Show the top hits by inhibition in the latest run', 'List screening results by assay'],
  INVENTORY: ['Which inventory items are running low?', 'Show reagents expiring soon'],
};

export default function AssistantChat() {
  const { chat, module, submitQuestion } = useAssistant();
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => { end.current?.scrollIntoView({ behavior: 'smooth' }); }, [chat.messages, chat.stage]);

  return (
    <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
      <Bubble role="assistant">
        Hi, I'm Nurix AI. Ask a question about your research data in plain language, or use the microphone.
      </Bubble>

      {chat.messages.length === 0 && (
        <div className="flex flex-col items-start gap-2 pt-1">
          {SUGGESTIONS[module].map((q) => (
            <button
              key={q}
              onClick={() => submitQuestion(q)}
              className="rounded-full border border-navy-100 bg-navy-50 px-3 py-1.5 text-left text-xs text-navy-700 transition hover:border-navy-200 hover:bg-navy-100"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {chat.messages.map((m) => <Bubble key={m.id} role={m.role} error={m.error}>{m.text}</Bubble>)}
      {chat.isProcessing && <StreamingIndicator stage={chat.stage} />}
      <div ref={end} />
    </div>
  );
}

function Bubble({ role, error, children }: { role: 'user' | 'assistant'; error?: boolean; children: React.ReactNode }) {
  const mine = role === 'user';
  return (
    <div className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
        mine ? 'rounded-br-sm bg-navy-900 text-white' : error ? 'rounded-bl-sm bg-red-50 text-red-700' : 'rounded-bl-sm bg-slate-100 text-navy-900'
      }`}>
        {children}
      </div>
    </div>
  );
}
