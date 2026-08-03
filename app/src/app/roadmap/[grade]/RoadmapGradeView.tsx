"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { RoadmapItem } from "@/data/roadmap";
import { categoryMeta, categoryOrder, accentClasses } from "@/data/categories";
import { FadeIn } from "@/components/FadeIn";

export function RoadmapGradeView({ grade, items }: { grade: number; items: RoadmapItem[] }) {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const storageKey = `pathfinder:done:grade-${grade}`;

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync from localStorage on mount
      if (raw) setDone(JSON.parse(raw));
    } catch {
      // localStorage unavailable — mark-as-done just won't persist this session
    }
  }, [storageKey]);

  function toggleDone(id: string) {
    setDone((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {
        // ignore — non-critical persistence
      }
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
                <h2 className="font-display text-2xl font-semibold">{category}</h2>
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
                      isDone ? "border-glow-amber/50" : "border-border"
                    }`}
                  >
                    <button
                      onClick={() => toggleDone(item.id)}
                      className="absolute -left-[11px] top-1 flex h-5 w-5 items-center justify-center rounded-full border bg-void transition-colors"
                      style={{
                        borderColor: isDone ? "var(--color-glow-amber)" : "var(--color-border)",
                        backgroundColor: isDone ? "var(--color-glow-amber)" : "var(--color-void)",
                      }}
                      aria-label={isDone ? "Mark as not done" : "Mark as done"}
                    >
                      <Check size={11} strokeWidth={3} className={isDone ? "text-void" : "text-transparent"} />
                    </button>

                    <h3
                      className={`font-display text-xl font-semibold sm:text-2xl ${
                        isDone ? "text-text-soft" : "text-text"
                      }`}
                    >
                      {item.title}
                    </h3>

                    <div className="mt-4 space-y-4">
                      {item.sections.map((section, i) => (
                        <div key={i}>
                          {section.heading && (
                            <h4 className="font-display text-base font-semibold text-text">
                              {section.heading}
                            </h4>
                          )}
                          <div className={section.heading ? "mt-2 space-y-3" : "space-y-3"}>
                            {section.paragraphs.map((p, j) => (
                              <p key={j} className="text-[15px] leading-relaxed text-text-soft sm:text-base">
                                {p}
                              </p>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => toggleDone(item.id)}
                      className="mt-4 font-mono text-[11px] uppercase tracking-widest text-text-faint transition-colors hover:text-signal"
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
