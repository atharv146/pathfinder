"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { DraftActivity } from "@/app/api/activities/extract/route";

type Turn = { role: "user" | "assistant"; content: string };

/**
 * The activities interview.
 *
 * A student who opens the activities page and sees an empty form usually
 * concludes they have nothing to put in it. This asks them about their week
 * instead, and turns the answers into draft entries.
 *
 * Drafts are always reviewed before they're saved. The model never writes
 * directly to the activities list — a college application is the student's
 * document, and an unreviewed AI entry on it is their problem to carry.
 */
export function ActivityInterview({ onSaved }: { onSaved: () => void }) {
  const [open, setOpen] = useState(false);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [drafts, setDrafts] = useState<DraftActivity[] | null>(null);
  const [extracting, setExtracting] = useState(false);
  const [savingIdx, setSavingIdx] = useState<number | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [turns, busy]);

  const send = useCallback(
    async (text: string, start = false) => {
      if (busy) return;
      setError(null);
      setBusy(true);

      if (text) {
        setTurns((t) => [...t, { role: "user", content: text }]);
        setInput("");
      }

      try {
        const res = await fetch("/api/activities/interview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text, start }),
        });

        if (!res.ok || !res.body) {
          const payload = await res.json().catch(() => null);
          setError(payload?.error ?? "Something went wrong.");
          setBusy(false);
          return;
        }

        setTurns((t) => [...t, { role: "assistant", content: "" }]);

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let answer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          answer += decoder.decode(value, { stream: true });
          setTurns((t) => {
            const next = [...t];
            next[next.length - 1] = { role: "assistant", content: answer };
            return next;
          });
        }
      } catch {
        setError("Lost connection. Try again.");
      } finally {
        setBusy(false);
      }
    },
    [busy]
  );

  const begin = () => {
    setOpen(true);
    if (turns.length === 0) send("", true);
  };

  const extract = async () => {
    setExtracting(true);
    setError(null);
    try {
      const res = await fetch("/api/activities/extract", { method: "POST" });
      const payload = await res.json();
      if (!res.ok) {
        setError(payload?.error ?? "Couldn't build a draft.");
        return;
      }
      setDrafts(payload.activities ?? []);
    } catch {
      setError("Couldn't build a draft. Try again.");
    } finally {
      setExtracting(false);
    }
  };

  const accept = async (draft: DraftActivity, idx: number) => {
    setSavingIdx(idx);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return setSavingIdx(null);

    const { error: insertError } = await supabase.from("activities").insert({
      user_id: user.id,
      title: draft.title,
      organization: draft.organization,
      role: draft.role,
      description: draft.description,
      hours_per_week: draft.hours_per_week,
      weeks_per_year: draft.weeks_per_year,
      grade_levels: [],
      sort_order: 0,
    });

    setSavingIdx(null);
    if (insertError) {
      setError(`Couldn't save that one: ${insertError.message}`);
      return;
    }

    setDrafts((d) => (d ? d.filter((_, i) => i !== idx) : d));
    onSaved();
  };

  if (!open) {
    return (
      <div className="mb-8 rounded-2xl border border-line-bright bg-panel p-6">
        <h2 className="display-md text-xl text-chalk">
          Not sure you have anything to list?
        </h2>
        <p className="mt-2 text-[0.92rem] leading-relaxed text-ash">
          Most students think activities means school clubs, so they leave this
          page empty. A job, watching your siblings, translating for your
          parents, helping at a family business — all of that belongs on a
          college application. Answer a few questions and we&rsquo;ll turn them
          into real entries.
        </p>
        <button
          onClick={begin}
          className="mt-5 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-ink"
        >
          Talk it through
        </button>
      </div>
    );
  }

  return (
    <div className="mb-8 rounded-2xl border border-line-bright bg-panel p-5 sm:p-6">
      <div className="mb-4 flex items-baseline justify-between gap-4">
        <h2 className="display-md text-xl text-chalk">Let&rsquo;s figure it out</h2>
        <button
          onClick={() => setOpen(false)}
          className="micro text-smoke hover:text-chalk"
        >
          Close
        </button>
      </div>

      <div
        ref={scrollRef}
        className="max-h-[40vh] min-h-[10rem] overflow-y-auto rounded-xl border border-line bg-ink p-4"
      >
        <div className="flex flex-col gap-4">
          {turns.map((t, i) => (
            <div key={i}>
              <p className="micro mb-1.5 text-smoke">
                {t.role === "user" ? "You" : "PathFinder"}
              </p>
              <p className="whitespace-pre-wrap text-[0.92rem] leading-relaxed text-chalk">
                {t.content}
                {busy && i === turns.length - 1 && !t.content && (
                  <span className="text-smoke">Thinking…</span>
                )}
              </p>
            </div>
          ))}
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-3 text-[0.85rem] text-[#ff7a6b]">
          {error}
        </p>
      )}

      <div className="mt-3 flex items-end gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              if (input.trim()) send(input.trim());
            }
          }}
          rows={1}
          placeholder="Type your answer…"
          disabled={busy}
          className="max-h-28 min-h-[3rem] flex-1 resize-none rounded-2xl border border-line bg-ink-2 px-4 py-3.5 text-[0.95rem] text-chalk outline-none placeholder:text-smoke focus:border-accent disabled:opacity-50"
        />
        <button
          onClick={() => input.trim() && send(input.trim())}
          disabled={busy || !input.trim()}
          className="rounded-full bg-accent px-5 py-3.5 text-sm font-semibold text-ink disabled:opacity-40"
        >
          Send
        </button>
      </div>

      {turns.length >= 4 && (
        <button
          onClick={extract}
          disabled={extracting || busy}
          className="mt-4 w-full rounded-full border border-line-bright px-5 py-3 text-sm font-semibold text-chalk disabled:opacity-40"
        >
          {extracting ? "Writing your draft…" : "Turn this into activity entries"}
        </button>
      )}

      {/* Drafts — reviewed, never auto-saved. */}
      {drafts && (
        <div className="mt-6">
          <h3 className="micro mb-1 text-accent">
            Drafts — check these before adding
          </h3>
          <p className="mb-4 text-[0.82rem] leading-relaxed text-smoke">
            Written from what you said. Edit anything that isn&rsquo;t right
            after you add it — and drop anything that doesn&rsquo;t feel true.
          </p>

          {drafts.length === 0 && (
            <p className="text-[0.9rem] text-ash">
              Nothing concrete yet — keep talking and try again.
            </p>
          )}

          <div className="flex flex-col gap-3">
            {drafts.map((d, i) => (
              <div key={i} className="rounded-xl border border-line bg-ink p-4">
                <p className="text-[0.95rem] font-semibold text-chalk">
                  {d.title}
                </p>
                {(d.organization || d.role) && (
                  <p className="micro mt-1 text-smoke">
                    {[d.role, d.organization].filter(Boolean).join(" · ")}
                  </p>
                )}
                <p className="mt-2 text-[0.88rem] leading-relaxed text-ash">
                  {d.description}
                </p>
                {(d.hours_per_week || d.weeks_per_year) && (
                  <p className="micro mt-2 text-smoke">
                    {d.hours_per_week ? `${d.hours_per_week} hrs/week` : ""}
                    {d.hours_per_week && d.weeks_per_year ? " · " : ""}
                    {d.weeks_per_year ? `${d.weeks_per_year} weeks/year` : ""}
                  </p>
                )}

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => accept(d, i)}
                    disabled={savingIdx === i}
                    className="rounded-full bg-accent px-4 py-2 text-[0.82rem] font-semibold text-ink disabled:opacity-40"
                  >
                    {savingIdx === i ? "Adding…" : "Add to my list"}
                  </button>
                  <button
                    onClick={() =>
                      setDrafts((ds) =>
                        ds ? ds.filter((_, j) => j !== i) : ds
                      )
                    }
                    className="rounded-full border border-line px-4 py-2 text-[0.82rem] text-ash hover:text-chalk"
                  >
                    Discard
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
