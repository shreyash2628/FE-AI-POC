export default function StreamingIndicator({ stage }: { stage: string }) {
  return (
    <div className="flex items-center gap-2 text-xs text-slate-500" role="status" aria-live="polite">
      <span className="flex gap-0.5">
        {[0, 1, 2].map((i) => (
          <span key={i} className="h-1.5 w-1.5 animate-dots rounded-full bg-signal-500" style={{ animationDelay: `${i * 0.2}s` }} />
        ))}
      </span>
      {stage || 'Working'}
    </div>
  );
}
