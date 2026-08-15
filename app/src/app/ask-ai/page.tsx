import { FadeIn } from "@/components/FadeIn";
import { PageFrame } from "@/components/PageFrame";
import { Backdrop } from "@/components/backdrop/Backdrop";
import { KineticText } from "@/components/KineticText";

export const metadata = { title: "Ask AI — PathFinder" };

export default function AskAiPage() {
  return (
    <PageFrame accent="violet" label="Ask AI" index="A04">
    <section className="texture-dots relative flex min-h-[80vh] flex-1 items-center justify-center overflow-hidden px-6 py-16 sm:px-10">
      {/* Particle field that leans toward the cursor — the page listening. */}
      <Backdrop variant="swarm" accent="violet" />

      <div className="relative w-full max-w-lg">
        <FadeIn>
          <p className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-smoke">
            <span className="h-1.5 w-1.5 rounded-full bg-smoke" />
            System status: offline
          </p>
        </FadeIn>
        <KineticText
          as="h1"
          immediate
          className="display text-4xl leading-[1.05] sm:text-5xl"
        >
          Coming <span className="glow-accent italic">online</span> in a later step.
        </KineticText>

        <FadeIn delay={0.2}>
          <p className="mt-4 text-sm leading-relaxed text-ash">
            This is a placeholder for the deliberately smaller chat panel planned
            for this app. It isn&rsquo;t wired to a real backend yet — that happens
            alongside Supabase auth, once design and content are further along,
            so a real API key never has to live in the browser.
          </p>
        </FadeIn>

        <FadeIn delay={0.35}>
          <div className="mt-8 rounded-2xl border border-line bg-panel p-6">
            <div className="rounded-xl border border-line bg-panel p-4">
              <p className="text-sm text-smoke">
                &ldquo;Hi! I&rsquo;m here to help with college prep questions, for you or
                your family. What&rsquo;s on your mind?&rdquo;
              </p>
            </div>

            <div className="mt-4 flex items-center gap-2 opacity-50">
              <input
                disabled
                placeholder="Ask a question..."
                className="flex-1 rounded-full border border-line bg-ink px-4 py-2.5 text-sm text-chalk placeholder:text-smoke"
              />
              <button
                disabled
                className="rounded-full bg-gradient-to-r from-ember to-ember px-5 py-2.5 text-sm font-medium text-ink"
              >
                Send
              </button>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
    </PageFrame>
  );
}
