export const metadata = { title: "Ask AI — PathFinder" };

export default function AskAiPage() {
  return (
    <section className="flex flex-1 items-center justify-center px-6 py-16 sm:px-10">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-surface p-6 sm:p-8">
        <p className="mb-2 font-mono text-xs uppercase tracking-widest text-signal">
          Ask AI
        </p>
        <h1 className="font-display text-2xl font-semibold">
          Coming online in a later step.
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-text-soft">
          This is a placeholder for the deliberately smaller chat panel planned for
          this app (see the project&rsquo;s Next Steps Sequence). It isn&rsquo;t wired to a
          real backend yet — that happens alongside Supabase auth, once the design
          and content passes are done, so a real key never has to live in the
          browser.
        </p>

        <div className="mt-6 rounded-xl border border-border bg-void-soft p-4">
          <p className="text-sm text-text-faint">
            &ldquo;Hi! I&rsquo;m here to help with college prep questions, for you or your
            family. What&rsquo;s on your mind?&rdquo;
          </p>
        </div>

        <div className="mt-4 flex items-center gap-2 opacity-50">
          <input
            disabled
            placeholder="Ask a question..."
            className="flex-1 rounded-full border border-border bg-void px-4 py-2.5 text-sm text-text placeholder:text-text-faint"
          />
          <button
            disabled
            className="rounded-full bg-gradient-to-r from-glow-amber to-glow-ember px-5 py-2.5 text-sm font-medium text-void"
          >
            Send
          </button>
        </div>
      </div>
    </section>
  );
}
