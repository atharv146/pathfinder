import { FadeIn } from "@/components/FadeIn";
import { PageFrame } from "@/components/PageFrame";
import { Backdrop } from "@/components/backdrop/Backdrop";
import { KineticText } from "@/components/KineticText";
import { ChatPanel } from "@/components/ask/ChatPanel";

export const metadata = { title: "Ask AI — PathFinder" };

export default function AskAiPage() {
  return (
    <PageFrame accent="violet" label="Ask AI" index="A04">
      <section className="texture-dots relative flex min-h-[80vh] flex-1 items-center justify-center overflow-hidden px-6 py-16 sm:px-10">
        {/* Particle field that leans toward the cursor — the page listening. */}
        <Backdrop variant="swarm" accent="violet" />

        <div className="relative w-full max-w-2xl">
          <FadeIn>
            <p className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-smoke">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Ask anything
            </p>
          </FadeIn>

          <KineticText
            as="h1"
            immediate
            className="display text-4xl leading-[1.05] sm:text-5xl"
          >
            The questions <span className="glow-accent italic">nobody</span>{" "}
            explained.
          </KineticText>

          <FadeIn delay={0.2}>
            <p className="mt-4 mb-8 text-sm leading-relaxed text-ash">
              Built for students and families new to the U.S. college system. No
              jargon unless it&rsquo;s explained, no invented statistics, and an
              honest &ldquo;check with your counselor&rdquo; when that&rsquo;s
              the real answer.
            </p>
          </FadeIn>

          <FadeIn delay={0.35}>
            <ChatPanel />
          </FadeIn>
        </div>
      </section>
    </PageFrame>
  );
}
