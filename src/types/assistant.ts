import type { AssistantResponse, QueryResult } from './results';

export type ModuleId = 'ALL' | 'CP' | 'PP' | 'HR' | 'HS' | 'INVENTORY';

export const MODULES: { id: ModuleId; label: string }[] = [
  { id: 'ALL', label: 'All Modules' },
  { id: 'CP', label: 'CP – Campaign Planning' },
  { id: 'PP', label: 'PP – Protein Production' },
  { id: 'HR', label: 'HR – Hit Resynthesis' },
  { id: 'HS', label: 'HS – Hit Screening' },
  { id: 'INVENTORY', label: 'Inventory' },
];

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  error?: boolean;
}

export type VoiceStatus = 'idle' | 'recording' | 'transcribing' | 'ready' | 'error';
export type ProcessingStatus = 'idle' | 'processing' | 'done' | 'error';

/** Server-Sent Event types emitted by the Spring Boot stream. */
export type StreamEvent =
  | { type: 'STATUS'; message: string }
  | { type: 'SQL_GENERATED'; sql: string }
  | { type: 'EXECUTION_STARTED' }
  | { type: 'DATA'; result: QueryResult }
  | { type: 'SUMMARY'; summary: string }
  | { type: 'COMPLETED'; response: AssistantResponse }
  | { type: 'ERROR'; message: string };

export const STREAM_EVENT_TYPES: StreamEvent['type'][] = [
  'STATUS', 'SQL_GENERATED', 'EXECUTION_STARTED', 'DATA', 'SUMMARY', 'COMPLETED', 'ERROR',
];

export interface QueryRequest {
  conversationId: string | null;
  question: string;
  module: ModuleId;
}

export interface ChatAskRequest {
  conversationId: string | null;
  question: string;
  module: ModuleId;
}

export interface ChatAskResponse {
  conversationId: string;
  status: string;
  answer: string;
  data: unknown[];
}

/** Everything the results workspace renders. Built up progressively from stream events. */
export interface WorkspaceState {
  question: string;
  module: ModuleId;
  phase: 'loading' | 'done' | 'error';
  steps: string[];
  sql?: string;
  result?: QueryResult;
  summary?: string;
  response?: AssistantResponse;
  error?: string;
}
