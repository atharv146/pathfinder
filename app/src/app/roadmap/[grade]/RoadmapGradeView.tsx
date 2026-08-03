"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import type { RoadmapItem } from "@/data/roadmap";
import { categoryMeta, categoryOrder, accentClasses } from "@/data/categories";

export function RoadmapGradeView({ grade, items }: { grade: number; items: RoadmapItem[] }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [done, setDone] = useState<Record<string, boolean>>({});

  const storageKey = `pathfinder:done:grade-${grade}`;

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      // One-time sync from an external store (localStorage) on mount — not
      // derivable from props/state, so this is the documented exception to
      // "don't setState in an effect."
      // eslint-disable-next-line react-hooks/set-state-in-effect
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
    <div className="mt-10 space-y-10">
      {categories.map((category) => {
        const meta = categoryMeta[category];
        const Icon = meta?.icon;
        const accent = meta ? accentClasses[meta.accent] : accentClasses.signal;
        const categoryItems = items.filter((i) => i.category === category);

        return (
          <div key={category}>
            <div className="mb-4 flex items-center gap-2.5">
              {Icon && (
                <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${accent.bg}`}>
                  <Icon size={15} className={accent.text} />
                </span>
              )}
              <h2 className="font-display text-lg font-semibold">{category}</h2>
            </div>

            <div className="space-y-3">
              {categoryItems.map((item) => {
                const isOpen = openId === item.id;
                const isDone = !!done[item.id];

                return (
                  <div
                    key={item.id}
                    className={`overflow-hidden rounded-2xl border bg-surface transition-colors ${
                      isOpen ? accent.border : "border-border"
                    }`}
                  >
                    <div className="flex items-center gap-3 px-5 py-4">
                      <button
                        onClick={() => toggleDone(item.id)}
                        aria-label={isDone ? "Mark as not done" : "Mark as done"}
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors ${
                          isDone
                            ? "border-glow-amber bg-glow-amber text-void"
                            : "border-border text-transparent hover:border-text-soft"
                        }`}
                      >
                        <Check size={12} strokeWidth={3} />
                      </button>
                      <button
                        onClick={() => setOpenId(isOpen ? null : item.id)}
                        className={`flex-1 text-left text-sm font-medium sm:text-base ${
                          isDone ? "text-text-faint line-through" : "text-text"
                        }`}
                      >
                        {item.title}
                      </button>
                    </div>

                    {isOpen && (
                      <div className="border-t border-border px-5 py-5 sm:px-6">
                        {item.sections.map((section, i) => (
                          <div key={i} className={i > 0 ? "mt-4" : ""}>
                            {section.heading && (
                              <h3 className="font-display text-sm font-semibold text-text">
                                {section.heading}
                              </h3>
                            )}
                            <div className="mt-2 space-y-3">
                              {section.paragraphs.map((p, j) => (
                                <p key={j} className="text-sm leading-relaxed text-text-soft">
                                  {p}
                                </p>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
