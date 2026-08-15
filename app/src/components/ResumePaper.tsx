"use client";

import { shouldAnimateAggressively } from "@/lib/motion";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { gsap, useGSAP } from "@/lib/gsap";

/**
 * The activities list, on paper, with a switch between how most students write
 * it and how it reads when it's specific.
 *
 * The paper stock is a deliberate contextual inversion — an application is a
 * physical document, so it gets physical treatment — not a change to the site
 * palette. It also breaks up a long run of black sections, which is a large
 * part of why the page was reading as flat.
 *
 * The two versions describe the *same student doing the same things*. That's
 * the whole argument: nobody here needs a more impressive life, they need to
 * stop erasing the details that are already true. Especially the job — work
 * and family responsibility get left off these lists constantly.
 */

const ROWS = [
  {
    activity: "Food pantry",
    meta: "Volunteer · 2 yrs · ~4 hrs/wk",
    vague: "Volunteered at a local food bank.",
    specific:
      "Ran weekend intake shifts; trained six new volunteers and rewrote the intake checklist in Spanish so families weren't waiting on a translator.",
    note: "Same hours. The second one shows judgement, initiative, and who it helped.",
  },
  {
    activity: "Science club",
    meta: "Member → outreach lead · 3 yrs",
    vague: "Member of science club.",
    specific:
      "Started the club's demo night for 4th graders — built the experiment list, recruited eight presenters, ran it three years running.",
    note: "\"Member\" is a status. The rewrite is a thing you actually did.",
  },
  {
    activity: "Family restaurant",
    meta: "Paid work · 20 hrs/wk, school year",
    vague: "(left off the application)",
    specific:
      "Closing shifts and weekly supply ordering at my family's restaurant, 20 hrs/week during the school year.",
    note: "Students cut this constantly because it doesn't feel like an 'activity'. It is one — and it explains your time.",
  },
  {
    activity: "Soccer",
    meta: "JV · 3 yrs · captain, senior yr",
    vague: "Played soccer.",
    specific:
      "JV soccer three years, captain senior year — organised preseason conditioning when the coach position was vacant.",
    note: "Not every line needs to be dramatic. It just needs to be true and concrete.",
  },
];

export function ResumePaper() {
  const scope = useRef<HTMLDivElement>(null);
  const paperRef = useRef<HTMLDivElement>(null);
  const [specific, setSpecific] = useState(false);
  const [active, setActive] = useState<number | null>(null);

  useGSAP(
    () => {
      const el = paperRef.current;
      if (!el) return;
      if (!shouldAnimateAggressively()) return;

      // Sheet develops upward into view. clipPath rather than opacity so it
      // reads as paper being pulled out, not a generic fade.
      gsap.from(el, {
        clipPath: "inset(100% 0% 0% 0%)",
        y: 40,
        rotateX: 12,
        duration: 1.3,
        ease: "power3.out",
        scrollTrigger: { trigger: scope.current, start: "top 74%", once: true },
      });
    },
    { scope }
  );

  return (
    <section
      ref={scope}
      className="relative overflow-hidden border-t border-line px-6 py-28 sm:px-10"
    >
      <div className="aurora" aria-hidden />

      <div className="relative mx-auto max-w-5xl">
        <p className="micro mb-4 text-smoke">(07) &nbsp;The activities list</p>
        <h2 className="display mb-6 max-w-2xl text-4xl leading-[1.1] text-chalk sm:text-5xl">
          You probably don&rsquo;t need a better life.
          <br />
          You need to <span className="glow-signal italic">stop erasing</span> the one you have.
        </h2>

        <button
          type="button"
          onClick={() => setSpecific((s) => !s)}
          className="edge-glow group mb-14 inline-flex items-center gap-3 rounded-full bg-panel px-6 py-3 text-sm text-chalk transition-colors hover:bg-panel-2"
        >
          <span
            className={`h-2 w-2 rounded-full transition-colors ${
              specific ? "bg-signal shadow-[0_0_12px_rgba(127,212,198,0.9)]" : "bg-smoke"
            }`}
          />
          {specific ? "Showing: specific" : "Showing: how most people write it"}
          <span className="micro text-smoke transition-colors group-hover:text-signal">
            → tap to switch
          </span>
        </button>

        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          {/* The sheet */}
          <div
            ref={paperRef}
            className="paper scanlines relative overflow-hidden rounded-sm p-7 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)] sm:p-10"
            style={{ perspective: "1200px" }}
          >
            <div className="mb-8 border-b border-black/15 pb-5">
              <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-black/45">
                Sample — activities list
              </p>
              <p className="display mt-2 text-3xl leading-none">Activities &amp; Work</p>
            </div>

            <ul className="space-y-7">
              {ROWS.map((r, i) => (
                <li
                  key={r.activity}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  tabIndex={0}
                  className={`cursor-default rounded-sm px-3 py-2 outline-none transition-colors ${
                    active === i ? "bg-black/[0.06]" : ""
                  }`}
                  data-cursor="hover"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                    <span className="text-[1.05rem] font-medium">{r.activity}</span>
                    <span className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-black/50">
                      {r.meta}
                    </span>
                  </div>

                  <div className="mt-1.5 min-h-[3.2em]">
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.p
                        key={specific ? "s" : "v"}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                        className={`text-[0.92rem] leading-relaxed ${
                          specific ? "text-black/80" : "italic text-black/45"
                        }`}
                      >
                        {specific ? r.specific : r.vague}
                      </motion.p>
                    </AnimatePresence>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Annotation rail */}
          <div className="lg:sticky lg:top-28">
            <p className="micro mb-4 text-smoke">
              {active === null ? "Hover a line" : `Line 0${active + 1}`}
            </p>
            <div className="edge-glow relative min-h-[9rem] rounded-lg bg-panel/80 p-6 backdrop-blur">
              <AnimatePresence mode="wait">
                <motion.p
                  key={active ?? "idle"}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.28 }}
                  className="text-[0.95rem] leading-relaxed text-ash"
                >
                  {active === null
                    ? "Every line on this sheet describes the same student doing the same things. Switch the toggle and hover a line to see what actually changes."
                    : ROWS[active].note}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
