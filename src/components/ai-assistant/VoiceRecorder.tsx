import { Loader2, Send, Square, X } from 'lucide-react';
import { useAssistant } from '../../context/AssistantProvider';

const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

export default function VoiceRecorder() {
  const { voice, submitQuestion } = useAssistant();
  const { status, duration, transcript, error } = voice;

  return (
    <div className="border-t border-slate-100 p-3">
      {status === 'recording' && (
        <div className="flex items-center gap-3">
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ring rounded-full bg-red-500" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500" />
          </span>
          <span className="flex-1 text-sm text-navy-900">Listening… <span className="font-mono text-slate-500">{fmt(duration)}</span></span>
          <button onClick={voice.reset} className="rounded-lg px-2.5 py-1.5 text-xs text-slate-500 hover:bg-slate-100">Cancel</button>
          <button onClick={voice.stop} className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs text-white hover:bg-red-700">
            <Square size={12} fill="currentColor" /> Stop
          </button>
        </div>
      )}

      {status === 'transcribing' && (
        <div className="flex items-center gap-2 text-sm text-slate-500" role="status">
          <Loader2 size={16} className="animate-spin" /> Transcribing your question…
        </div>
      )}

      {status === 'ready' && (
        <div className="space-y-2">
          <label htmlFor="transcript" className="text-xs text-slate-500">Check the transcript and edit it if needed</label>
          <textarea
            id="transcript"
            value={transcript}
            onChange={(e) => voice.setTranscript(e.target.value)}
            rows={3}
            className="w-full resize-none rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-signal-500"
          />
          <div className="flex justify-end gap-2">
            <button onClick={voice.reset} className="rounded-lg px-3 py-1.5 text-xs text-slate-500 hover:bg-slate-100">Discard</button>
            <button
              onClick={() => submitQuestion(transcript)}
              disabled={!transcript.trim()}
              className="flex items-center gap-1.5 rounded-lg bg-navy-900 px-3 py-1.5 text-xs text-white hover:bg-navy-800 disabled:opacity-40"
            >
              <Send size={13} /> Ask Nurix AI
            </button>
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className="flex items-start gap-2 text-sm text-red-700" role="alert">
          <span className="flex-1">{error}</span>
          <button onClick={voice.reset} aria-label="Dismiss" className="rounded p-1 hover:bg-red-50"><X size={14} /></button>
        </div>
      )}
    </div>
  );
}
