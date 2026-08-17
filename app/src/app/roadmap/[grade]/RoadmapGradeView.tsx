"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { RoadmapItem } from "@/data/roadmap";
import { categoryMeta, categoryOrder, accentClasses } from "@/data/categories";
import { FadeIn } from "@/components/FadeIn";
import { fetchProgress, setItemDone } from "@/lib/db/progress";
import Link from "next/link";
import { toolForItem } from "@/data/item-tools";

/**
 * Progress is now account-backed, so it follows a student from their phone to
 * a school laptop instead of living in one browser.
 *
 * localStorage is still written alongside the database, deliberately: it makes
 * the checkbox feel instant, and it means progress isn't lost if the network
 * drops mid-session. The database is the source of truth on load; the local
 * copy is a cache and an offline cushion.
 */
export function RoadmapGradeView({ grade, items }: { grade: number; items: RoadmapItem[] }) {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const storageKey = `pathfinder:done:grade-${grade}`;

  useEffect(() => {
    // Paint from the local cache first so the list never flashes unchecked.
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setDone(JSON.parse(raw));
    } catch {
      // localStorage unavailable — the DB fetch below still works.
    }

    // Then reconcile against the account, which wins.
    let cancelled = false;
    fetchProgress().then((remote) => {
      if (cancelled || remote.size === 0) return;
      setDone((prev) => {
        const merged = { ...prev };
        for (const id of remote) merged[id] = true;
        return merged;
      });
    });
    return () => {
      cancelled = true;
    };
  }, [storageKey]);

  function toggleDone(id: string) {
    setDone((prev) => {
      const nextValue = !prev[id];
      const next = { ...prev, [id]: nextValue };
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {
        // ignore — non-critical cache write
      }
      // Fire-and-forget: a failed write leaves the local copy intact rather
      // than reverting the checkbox under the student's finger.
      void setItemDone(id, nextValue);
      return next;
    });
  }

  const categories = categoryOrder.filter((c) => items.some((i) => i.category === c));

  return (
    <div className="mt-14 space-y-20">
      {categories.map((category) => {
        const meta = categoryMeta[category];
        const Icon = meta?.icon;
        const accent = meta ? accentClasses[meta.accent] : accentClasses.signal;
        const categoryItems = items.filter((i) => i.category === category);

        return (
          <div key={category}>
            <FadeIn className="mb-8 flex items-center gap-3">
              <div className="flex items-center gap-3">
                {Icon && (
                  <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${accent.bg}`}>
                    <Icon size={16} className={accent.text} />
                  </span>
                )}
                <h2 className="display text-2xl">{category}</h2>
              </div>
            </FadeIn>

            <div className="space-y-14">
              {categoryItems.map((item) => {
                const isDone = !!done[item.id];

                return (
                  <motion.article
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className={`relative border-l-2 pl-6 transition-colors sm:pl-8 ${
                      isDone ? "border-ember/50" : "border-line"
                    }`}
                  >
                    <button
                      onClick={() => toggleDone(item.id)}
                      // The visible dot stays 20px, but `before:-inset-3`
                      // extends the touch region to ~44px — the accessibility
                      // minimum for a finger. Without it this was a 20px
                      // target, which on a phone means repeatedly missing the
                      // one interactive control on the page.
                      className="absolute -left-[11px] top-1 flex h-5 w-5 items-center justify-center rounded-full border bg-ink transition-colors before:absolute before:-inset-3 before:content-['']"
                      style={{
                        borderColor: isDone ? "var(--color-ember)" : "var(--color-line)",
                        backgroundColor: isDone ? "var(--color-ember)" : "var(--color-ink)",
                      }}
                      aria-label={isDone ? "Mark as not done" : "Mark as done"}
                    >
                      <Check size={11} strokeWidth={3} className={isDone ? "text-ink" : "text-transparent"} />
                    </button>

                    <h3
                      className={`display text-xl font-semibold sm:text-2xl ${
                        isDone ? "text-ash" : "text-chalk"
                      }`}
                    >
                      {item.title}
                    </h3>

                    <div className="mt-4 space-y-4">
                      {item.sections.map((section, i) => (
                        <div key={i}>
                          {section.heading && (
                            <h4 className="display text-base text-chalk">
                              {section.heading}
                            </h4>
                          )}
                          <div className={section.heading ? "mt-2 space-y-3" : "space-y-3"}>
                            {section.paragraphs.map((p, j) => (
                              <p key={j} className="text-[15px] leading-relaxed text-ash sm:text-base">
                                {p}
                              </p>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* A tool, only where the roadmap actually calls for one.
                        The roadmap is the product; the tools support it, and a
                        student shouldn't have to go find them in another tab
                        at the moment they're relevant. */}
                    {(() => {
                      const tool = toolForItem(item.id);
                      if (!tool) return null;
                      return (
                        <Link
                          href={tool.href}
                          className="mt-5 block rounded-xl border border-accent/40 bg-accent/[0.06] px-4 py-3 transition-colors hover:border-accent"
                        >
                          <span className="block text-[0.9rem] font-semibold text-chalk">
                            {tool.label} →
                          </span>
                          <span className="mt-1 block text-[0.82rem] leading-relaxed text-ash">
                            {tool.why}
                          </span>
                        </Link>
                      );
                    })()}

                    <button
                      onClick={() => toggleDone(item.id)}
                      className="tap-target mt-4 font-mono text-[11px] uppercase tracking-widest text-smoke transition-colors hover:text-signal"
                    >
                      {isDone ? "✓ Done — mark as not done" : "Mark as done"}
                    </button>
                  </motion.article>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
