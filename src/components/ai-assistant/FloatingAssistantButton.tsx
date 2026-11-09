import { Sparkles } from 'lucide-react';
import { useAssistant } from '../../context/AssistantProvider';

export default function FloatingAssistantButton() {
  const { isOpen, toggleWidget } = useAssistant();
  return (
    <div className="group fixed bottom-6 right-6 z-50">
      <span className="pointer-events-none absolute bottom-full right-0 mb-2 whitespace-nowrap rounded-md border border-slate-600 bg-slate-900 px-2.5 py-1 text-xs font-medium text-sky-200 opacity-0 shadow-[0_10px_25px_rgba(15,23,42,0.35)] transition-opacity group-hover:opacity-100">
        Ask Nurix AI
      </span>
      <button
        type="button"
        onClick={toggleWidget}
        aria-label="Ask Nurix AI"
        aria-expanded={isOpen}
        className="flex h-[60px] w-[60px] items-center justify-center rounded-full border border-slate-700 bg-[#0B1F3A] text-slate-100 shadow-[0_12px_30px_rgba(11,31,58,0.45)] transition duration-200 hover:scale-105 hover:bg-[#102847] hover:shadow-[0_14px_32px_rgba(11,31,58,0.52)] active:scale-95"
      >
        <Sparkles size={26} />
      </button>
    </div>
  );
}
