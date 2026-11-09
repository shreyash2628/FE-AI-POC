import { useState } from 'react';
import { useAssistant } from '../../context/AssistantProvider';
import AssistantChat from './AssistantChat';
import AssistantHeader from './AssistantHeader';
import AssistantInput from './AssistantInput';
import ModuleSelector from './ModuleSelector';

export type WidgetSize = 'normal' | 'expanded' | 'minimized';

const SIZE_CLASS: Record<WidgetSize, string> = {
  normal: 'h-[620px] w-[420px]',
  expanded: 'h-[calc(100vh-130px)] w-[720px]',
  minimized: 'h-auto w-[420px]',
};

export default function AssistantWidget() {
  const { isOpen, closeWidget } = useAssistant();
  const [size, setSize] = useState<WidgetSize>('normal');
  if (!isOpen) return null;

  return (
    <section
      role="dialog"
      aria-label="Nurix AI assistant"
      className={`fixed bottom-[100px] right-6 z-50 flex max-h-[calc(100vh-130px)] max-w-[calc(100vw-48px)] animate-panelIn flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl ${SIZE_CLASS[size]}`}
    >
      <AssistantHeader
        size={size}
        onMinimize={() => setSize((s) => (s === 'minimized' ? 'normal' : 'minimized'))}
        onToggleExpand={() => setSize((s) => (s === 'expanded' ? 'normal' : 'expanded'))}
        onClose={closeWidget}
      />
      {size !== 'minimized' && (
        <>
          <ModuleSelector />
          <AssistantChat />
          <AssistantInput />
        </>
      )}
    </section>
  );
}
