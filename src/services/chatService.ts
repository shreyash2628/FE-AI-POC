import axios from 'axios';
import { api } from './api';
import type { ChatAskRequest, ChatAskResponse } from '../types/assistant';

export type { ChatAskRequest, ChatAskResponse };

export async function askQuestion(
  payload: ChatAskRequest,
  signal?: AbortSignal,
): Promise<ChatAskResponse> {
  try {
    const response = await api.post<ChatAskResponse>('/api/chat/ask', payload, { signal });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const serverMessage =
        error.response?.data?.message ??
        error.response?.data?.error ??
        error.response?.data?.detail ??
        error.message;

      throw new Error(serverMessage || 'The assistant could not process your request.');
    }

    if (error instanceof Error) {
      throw new Error(error.message || 'The assistant could not process your request.');
    }

    throw new Error('The assistant could not process your request.');
  }
}
