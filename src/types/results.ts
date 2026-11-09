export type ColumnType = 'string' | 'number' | 'date' | 'boolean' | 'status';

export interface ResultColumn {
  key: string;
  label: string;
  type?: ColumnType;
}

export type CellValue = string | number | boolean | null;
export type ResultRow = Record<string, CellValue>;

export interface QueryResult {
  columns: ResultColumn[];
  rows: ResultRow[];
  totalRecords: number;
}

/** Optional chart hint from the backend. If omitted the UI infers a simple breakdown. */
export interface ChartConfig {
  type: 'bar' | 'line';
  xKey: string;
  yKey?: string;
  title?: string;
}

export type ExecutionStatus = 'SUCCESS' | 'PARTIAL' | 'ERROR';

export interface ResultMetadataInfo {
  executionTimeMs?: number;
  sourceModule?: string;
  [key: string]: string | number | undefined;
}

export interface AssistantResponse {
  conversationId: string;
  module: string;
  question: string;
  status: ExecutionStatus;
  summary?: string;
  sql?: string;
  result?: QueryResult;
  chart?: ChartConfig;
  metadata?: ResultMetadataInfo;
  error?: string;
}
