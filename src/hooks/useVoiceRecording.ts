import { useCallback, useEffect, useRef, useState } from 'react';
import { transcribeAudio } from '../services/transcriptionService';
import type { VoiceStatus } from '../types/assistant';

export function useVoiceRecording() {
  const [status, setStatus] = useState<VoiceStatus>('idle');
  const [duration, setDuration] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);

  const recorder = useRef<MediaRecorder | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const chunks = useRef<Blob[]>([]);
  const timer = useRef<number | undefined>(undefined);

  const cleanup = useCallback(() => {
    window.clearInterval(timer.current);
    stream.current?.getTracks().forEach((t) => t.stop());
    stream.current = null;
  }, []);

  useEffect(() => cleanup, [cleanup]);

  const start = useCallback(async () => {
    setError(null);
    setTranscript('');
    setDuration(0);
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error('This browser does not support microphone recording.');
      stream.current = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunks.current = [];
      const rec = new MediaRecorder(stream.current);
      rec.ondataavailable = (e) => { if (e.data.size) chunks.current.push(e.data); };
      rec.onstop = async () => {
        cleanup();
        setStatus('transcribing');
        try {
          const text = await transcribeAudio(new Blob(chunks.current, { type: rec.mimeType || 'audio/webm' }));
          setTranscript(text);
          setStatus('ready');
        } catch {
          setError('Transcription failed. Try recording again or type your question.');
          setStatus('error');
        }
      };
      rec.start();
      recorder.current = rec;
      setStatus('recording');
      timer.current = window.setInterval(() => setDuration((d) => d + 1), 1000);
    } catch (e) {
      cleanup();
      const denied = e instanceof DOMException && e.name === 'NotAllowedError';
      setError(denied ? 'Microphone access is blocked. Allow it in your browser settings and try again.' : e instanceof Error ? e.message : 'Could not start recording.');
      setStatus('error');
    }
  }, [cleanup]);

  const stop = useCallback(() => {
    window.clearInterval(timer.current);
    if (recorder.current?.state === 'recording') recorder.current.stop();
  }, []);

  const reset = useCallback(() => {
    if (recorder.current?.state === 'recording') {
      recorder.current.onstop = null;
      recorder.current.stop();
    }
    cleanup();
    setStatus('idle');
    setDuration(0);
    setTranscript('');
    setError(null);
  }, [cleanup]);

  return { status, duration, transcript, error, setTranscript, start, stop, reset };
}
