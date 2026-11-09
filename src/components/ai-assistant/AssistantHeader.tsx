import { Maximize2, Minimize2, Minus, X } from 'lucide-react';
import type { WidgetSize } from './AssistantWidget';

interface Props {
  size: WidgetSize;
  onMinimize: () => void;
  onToggleExpand: () => void;
  onClose: () => void;
}

export default function AssistantHeader({ size, onMinimize, onToggleExpand, onClose }: Props) {
  const btn = 'rounded-md p-1.5 text-navy-200 transition hover:bg-white/10 hover:text-white';
  return (
    <header className="flex items-center justify-between bg-navy-900 px-4 py-3 text-white">
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold">Nurix AI</h2>
          <span className="flex items-center gap-1 text-[11px] text-navy-200">
            <span className="h-1.5 w-1.5 rounded-full bg-signal-500" /> Online
          </span>
        </div>
        <p className="text-xs text-navy-200">Scientific Research Assistant</p>
      </div>
      <div className="flex items-center">
        <button className={btn} onClick={onMinimize} aria-label={size === 'minimized' ? 'Restore' : 'Minimize'}><Minus size={16} /></button>
        <button className={btn} onClick={onToggleExpand} aria-label={size === 'expanded' ? 'Shrink' : 'Expand'}>
          {size === 'expanded' ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
        </button>
        <button className={btn} onClick={onClose} aria-label="Close"><X size={16} /></button>
      </div>
    </header>
  );
}
