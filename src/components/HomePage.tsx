import { AssistantProvider, useAssistant } from '../context/AssistantProvider';
import AssistantWidget from './ai-assistant/AssistantWidget';
import FloatingAssistantButton from './ai-assistant/FloatingAssistantButton';
import ResultsWorkspace from './results/ResultsWorkspace';

/**
 * Drop-in entry point. Render <HomePage /> anywhere in your app.
 * Empty canvas on load -> after a question is submitted the canvas becomes the results workspace.
 */
export default function HomePage() {
  return (
    <AssistantProvider>
      <HomeContent />
    </AssistantProvider>
  );
}

function HomeContent() {
  const { chat, clearWorkspace } = useAssistant();
  return (
    <main className="min-h-screen bg-[#F6F7F9]">
      {chat.workspace ? (
        <div className="relative">
          <div className="flex justify-end px-6 pt-6">
            <button
              type="button"
              onClick={clearWorkspace}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
            >
              Clear response
            </button>
          </div>
          <ResultsWorkspace state={chat.workspace} />
        </div>
      ) : (
        <EmptyWorkspace />
      )}
      <AssistantWidget />
      <FloatingAssistantButton />
    </main>
  );
}

function EmptyWorkspace() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <h1 className="text-3xl font-semibold tracking-tight text-navy-900">Nurix AI</h1>
      <p className="mt-1 text-sm text-navy-600">Scientific Research Assistant</p>
      <p className="mt-6 text-sm text-slate-500">Your workspace is ready. Ask anything about your research.</p>
    </section>
  );
}
