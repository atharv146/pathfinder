import { RevealText } from "@/components/RevealText";
import { FadeIn } from "@/components/FadeIn";

export const metadata = { title: "Ask AI — PathFinder" };

export default function AskAiPage() {
  return (
    <section className="texture-dots relative flex flex-1 items-center justify-center overflow-hidden px-6 py-16 sm:px-10">
      <span
        className="drift-shape absolute left-[10%] top-[14%] h-16 w-16 rotate-12 rounded-2xl border border-glow-amber/30"
        style={{ animationDelay: "0.3s" }}
        aria-hidden
      />
      <span
        className="drift-shape absolute bottom-[16%] right-[12%] h-10 w-10 rounded-full border border-signal/30"
        style={{ animationDelay: "1.3s" }}
        aria-hidden
      />

      <div className="relative w-full max-w-lg">
        <FadeIn>
          <p className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-text-faint">
            <span className="h-1.5 w-1.5 rounded-full bg-text-faint" />
            System status: offline
          </p>
        </FadeIn>
        <RevealText
          as="h1"
          text="Coming online in a later step."
          className="font-display text-3xl font-semibold sm:text-4xl"
        />

        <FadeIn delay={0.2}>
          <p className="mt-4 text-sm leading-relaxed text-text-soft">
            This is a placeholder for the deliberately smaller chat panel planned
            for this app. It isn&rsquo;t wired to a real backend yet — that happens
            alongside Supabase auth, once design and content are further along,
            so a real API key never has to live in the browser.
          </p>
        </FadeIn>

        <FadeIn delay={0.35}>
          <div className="mt-8 rounded-2xl border border-border bg-surface p-6">
            <div className="rounded-xl border border-border bg-void-soft p-4">
              <p className="text-sm text-text-faint">
                &ldquo;Hi! I&rsquo;m here to help with college prep questions, for you or
                your family. What&rsquo;s on your mind?&rdquo;
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
        </FadeIn>
      </div>
    </section>
  );
}
