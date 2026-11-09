import { useCallback, useRef, useState } from 'react';
import { askQuestion } from '../services/chatService';
import type { ChatMessage, ModuleId, ProcessingStatus, WorkspaceState } from '../types/assistant';

const uid = () => Math.random().toString(36).slice(2, 10);

export function useChat(module: ModuleId) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [status, setStatus] = useState<ProcessingStatus>('idle');
  const [stage, setStage] = useState('');
  const [workspace, setWorkspace] = useState<WorkspaceState | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);

  const abort = useRef<AbortController | null>(null);

  const push = (m: Omit<ChatMessage, 'id'>) => setMessages((prev) => [...prev, { ...m, id: uid() }]);
  const clear = useCallback(() => {
    abort.current?.abort();
    setCurrentQuestion('');
    setConversationId(null);
    setMessages([]);
    setStatus('idle');
    setStage('');
    setWorkspace(null);
  }, []);

  const submit = useCallback(async (question: string) => {
    const trimmedQuestion = question.trim();
    if (!trimmedQuestion || status === 'processing') return;

    abort.current?.abort();
    const controller = new AbortController();
    abort.current = controller;

    setCurrentQuestion(trimmedQuestion);
    setStatus('processing');
    setStage('Sending question');
    setWorkspace({ question: trimmedQuestion, module, phase: 'loading', steps: ['Sending question'] });
    push({ role: 'user', text: trimmedQuestion });

    try {
      const response = await askQuestion({
        conversationId,
        question: trimmedQuestion,
        module,
      }, controller.signal);

      setConversationId(response.conversationId ?? conversationId);
      setStatus('done');
      setStage('');
      setWorkspace({
        question: trimmedQuestion,
        module,
        phase: 'done',
        steps: ['Completed'],
        summary: response.answer,
      });
      push({ role: 'assistant', text: response.answer });
    } catch (error) {
      if (controller.signal.aborted) return;

      const message = error instanceof Error ? error.message : 'Something went wrong while contacting the assistant.';
      setStatus('error');
      setStage('');
      setWorkspace({
        question: trimmedQuestion,
        module,
        phase: 'error',
        steps: ['Error'],
        error: message,
      });
      push({ role: 'assistant', text: message, error: true });
    }
  }, [conversationId, module, status]);

  return { messages, currentQuestion, status, stage, workspace, submit, clear, isProcessing: status === 'processing' };
}
