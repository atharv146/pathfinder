"use client";

import { useEffect, useState } from "react";
import {
  EXERCISES,
  STRUCTURES,
  SPECIFICITY_NOTE,
} from "@/data/essay-brainstorm";

/**
 * Guided essay brainstorming.
 *
 * Writes nothing for the student — see the header of data/essay-brainstorm.ts
 * for why that's a hard line rather than a limitation.
 *
 * Notes are kept in localStorage rather than the database, deliberately: this
 * is unfinished, unedited thinking, and some of it will be about family
 * hardship or immigration. Keeping it on the device means it never sits on a
 * server, and the UI says so plainly. The student copies out what they want to
 * keep.
 */

const STORAGE_KEY = "pf-essay-notes";

export function EssayBrainstorm() {
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [active, setActive] = useState<string>(EXERCISES[0].id);
  const [loaded, setLoaded] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setNotes(JSON.parse(raw));
    } catch {
      // A corrupt blob shouldn't block the tool.
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    } catch {
      // Private browsing / quota. Losing autosave is survivable; crashing isn't.
    }
  }, [notes, loaded]);

  const exercise = EXERCISES.find((e) => e.id === active) ?? EXERCISES[0];
  const written = Object.values(notes).filter((v) => v.trim()).length;

  const copyAll = async () => {
    const out = EXERCISES.flatMap((ex) => {
      const lines = ex.prompts
        .map((p, i) => {
          const v = notes[`${ex.id}-${i}`]?.trim();
          return v ? `${p}\n${v}\n` : null;
        })
        .filter(Boolean);
      return lines.length ? [`## ${ex.name}`, ...lines] : [];
    }).join("\n");

    try {
      await navigator.clipboard.writeText(out || "No notes yet.");
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="rounded-2xl border border-line-bright bg-panel p-6 sm:p-8">
      <p className="micro mb-2 text-accent">Essay brainstorming</p>
      <h2 className="display-md text-2xl text-chalk sm:text-3xl">
        The hard part isn&rsquo;t writing it. It&rsquo;s finding it.
      </h2>
      <p className="mt-3 text-[0.95rem] leading-relaxed text-ash">
        The personal essay isn&rsquo;t a writing test — colleges already know
        how you write from your transcript. Its job is showing how you think,
        in your voice. These are three exercises that actually work when you&rsquo;re
        staring at a blank page. Nothing here writes anything for you, on
        purpose.
      </p>

      {/* Exercise picker */}
      <div className="mt-7 flex flex-wrap gap-2">
        {EXERCISES.map((ex) => (
          <button
            key={ex.id}
            onClick={() => setActive(ex.id)}
            aria-pressed={ex.id === active}
            className={`rounded-full border px-4 py-2 text-[0.85rem] transition-colors ${
              ex.id === active
                ? "border-accent bg-accent/10 text-chalk"
                : "border-line text-ash hover:border-line-bright hover:text-chalk"
            }`}
          >
            {ex.name}
          </button>
        ))}
      </div>

      <p className="mt-5 rounded-xl border border-line bg-ink px-4 py-3 text-[0.85rem] leading-relaxed text-ash">
        {exercise.why}
      </p>

      <div className="mt-5 flex flex-col gap-4">
        {exercise.prompts.map((prompt, i) => {
          const key = `${exercise.id}-${i}`;
          return (
            <div key={key}>
              <label
                htmlFor={key}
                className="mb-2 block text-[0.9rem] leading-snug text-chalk"
              >
                {prompt}
              </label>
              <textarea
                id={key}
                rows={2}
                value={notes[key] ?? ""}
                onChange={(e) =>
                  setNotes((n) => ({ ...n, [key]: e.target.value }))
                }
                placeholder="Write badly. You can fix it later."
                className="w-full resize-y rounded-xl border border-line bg-ink-2 px-4 py-3 text-[0.92rem] leading-relaxed text-chalk outline-none placeholder:text-smoke focus:border-accent"
              />
            </div>
          );
        })}
      </div>

      {/* Structures */}
      <div className="mt-9 border-t border-line pt-6">
        <p className="micro mb-3 text-smoke">
          Once you have material — two shapes that work
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {STRUCTURES.map((s) => (
            <div key={s.id} className="rounded-xl border border-line bg-ink p-4">
              <p className="text-[0.95rem] font-semibold text-chalk">{s.name}</p>
              <p className="mt-1.5 text-[0.85rem] leading-relaxed text-ash">
                {s.what}
              </p>
              <p className="mt-2 text-[0.82rem] leading-relaxed text-smoke">
                Suits you if: {s.suits}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-[0.82rem] leading-relaxed text-smoke">
          Either works. Picking one and committing beats trying to cover
          everything.
        </p>
      </div>

      <div className="mt-7 rounded-xl border border-accent/30 bg-accent/[0.05] px-5 py-4">
        <p className="micro mb-2 text-accent">One thing worth reading twice</p>
        <p className="text-[0.88rem] leading-relaxed text-ash">
          {SPECIFICITY_NOTE}
        </p>
      </div>

      <div className="mt-7 flex flex-wrap items-center gap-4">
        <button
          onClick={copyAll}
          disabled={written === 0}
          className="rounded-full bg-accent px-5 py-3 text-sm font-semibold text-ink disabled:opacity-40"
        >
          {copied ? "Copied" : "Copy my notes"}
        </button>
        <p className="text-[0.82rem] leading-relaxed text-smoke">
          {written > 0
            ? `${written} answered. Saved on this device only — not uploaded anywhere.`
            : "Your notes stay on this device and are never uploaded."}
        </p>
      </div>
    </div>
  );
}
