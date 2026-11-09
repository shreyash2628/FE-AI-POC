import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { useChat } from '../hooks/useChat';
import { useVoiceRecording } from '../hooks/useVoiceRecording';
import type { ModuleId } from '../types/assistant';

type ChatApi = ReturnType<typeof useChat>;
type VoiceApi = ReturnType<typeof useVoiceRecording>;

interface AssistantContextValue {
  isOpen: boolean;
  openWidget: () => void;
  closeWidget: () => void;
  toggleWidget: () => void;
  clearWorkspace: () => void;
  module: ModuleId;
  setModule: (m: ModuleId) => void;
  chat: ChatApi;
  voice: VoiceApi;
  /** Closes the widget, switches the background to the workspace and runs the query. */
  submitQuestion: (q: string) => void;
}

const AssistantContext = createContext<AssistantContextValue | null>(null);

export function AssistantProvider({ children }: { children: ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const [module, setModule] = useState<ModuleId>('ALL');
  const chat = useChat(module);
  const voice = useVoiceRecording();
  const { submit, clear } = chat;
  const { reset } = voice;

  const submitQuestion = useCallback((q: string) => {
    const question = q.trim();
    if (!question) return;
    reset();
    setOpen(false);
    void submit(question);
  }, [submit, reset]);

  const clearWorkspace = useCallback(() => {
    clear();
    setOpen(true);
  }, [clear]);

  const value = useMemo<AssistantContextValue>(() => ({
    isOpen, module, setModule, chat, voice, submitQuestion, clearWorkspace,
    openWidget: () => setOpen(true),
    closeWidget: () => setOpen(false),
    toggleWidget: () => setOpen((o) => !o),
  }), [isOpen, module, chat, voice, submitQuestion, clearWorkspace]);

  return <AssistantContext.Provider value={value}>{children}</AssistantContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAssistant(): AssistantContextValue {
  const ctx = useContext(AssistantContext);
  if (!ctx) throw new Error('useAssistant must be used inside <AssistantProvider>');
  return ctx;
}
