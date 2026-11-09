import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { Send } from 'lucide-react';
import { useAssistant } from '../../context/AssistantProvider';

export default function AssistantInput() {
  const { submitQuestion } = useAssistant();
  const [text, setText] = useState('');
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [text]);

  const send = () => {
    if (!text.trim()) return;
    submitQuestion(text);
    setText('');
  };
  const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <div className="flex items-end gap-2 border-t border-slate-100 p-3">
      <textarea
        ref={ref}
        rows={1}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={onKey}
        placeholder="Ask about your research data"
        aria-label="Your question"
        className="max-h-[120px] flex-1 resize-none rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-signal-500"
      />
      <button onClick={send} disabled={!text.trim()} aria-label="Send" className="rounded-xl bg-navy-900 p-2.5 text-white transition hover:bg-navy-800 disabled:opacity-40">
        <Send size={18} />
      </button>
    </div>
  );
}
