import { api } from './api';

/**
 * Voice transcription is intentionally not enabled in this frontend build.
 * The project is wired to the text-based Spring Boot chat API only.
 */
export async function transcribeAudio(audio: Blob): Promise<string> {
  void audio;
  const form = new FormData();
  form.append('audio', audio, 'recording.webm');
  const { data } = await api.post<{ transcript: string }>('/assistant/voice/transcribe', form);
  return data.transcript;
}
