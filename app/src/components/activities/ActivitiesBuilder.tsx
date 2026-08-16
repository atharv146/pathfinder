"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ActivityInterview } from "@/components/activities/ActivityInterview";
import type { Activity } from "@/lib/db/types";

/**
 * Activities list builder.
 *
 * The premise: a first-generation student often has plenty worth writing down
 * and no idea it counts. "Watched my little brother after school so my mom
 * could work" is a real, writable entry — most students in that position
 * assume activities means debate club. The prompts below exist to say so
 * explicitly, because nobody else is going to tell them.
 *
 * Hours/weeks are captured because the Common App asks for exactly those, so
 * an entry made here can be transcribed straight across later.
 */

const PROMPTS = [
  "A job, or helping at a family business",
  "Caring for siblings or relatives",
  "Translating for your family",
  "Something you taught yourself",
  "A team, club, or group at school",
  "Something you make or build on your own",
  "Religious or community involvement",
];

const EMPTY: Omit<Activity, "id" | "user_id" | "created_at" | "updated_at"> = {
  title: "",
  organization: "",
  role: "",
  description: "",
  hours_per_week: null,
  weeks_per_year: null,
  grade_levels: [],
  sort_order: 0,
};

export function ActivitiesBuilder() {
  const [items, setItems] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  // Hoisted out of the effect so the interview can re-run it after a draft is
  // accepted — otherwise an added activity wouldn't appear until a reload.
  const load = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("activities")
      .select("*")
      .order("sort_order", { ascending: true });
    setItems((data as Activity[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const add = async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("activities")
      .insert({ ...EMPTY, user_id: user.id, sort_order: items.length })
      .select()
      .single();

    if (data) setItems((prev) => [...prev, data as Activity]);
  };

  // Optimistic local update, debounced persist. Typing into a textarea that
  // round-trips to a database on every keystroke feels broken on a phone.
  const update = (id: string, patch: Partial<Activity>) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)));
    setSaving(id);
    const supabase = createClient();
    window.clearTimeout((update as never as { t?: number }).t);
    (update as never as { t?: number }).t = window.setTimeout(async () => {
      await supabase.from("activities").update(patch).eq("id", id);
      setSaving(null);
    }, 600);
  };

  const remove = async (id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
    const supabase = createClient();
    await supabase.from("activities").delete().eq("id", id);
  };

  if (loading) {
    return <p className="micro text-smoke">Loading…</p>;
  }

  return (
    <div>
      <ActivityInterview onSaved={load} />

      {items.length === 0 && (
        <div className="mb-10 rounded-lg border border-line bg-panel/60 p-6 sm:p-8">
          <p className="display-md mb-4 text-xl text-chalk">
            Not sure what counts? Most of this does.
          </p>
          <ul className="grid gap-2 sm:grid-cols-2">
            {PROMPTS.map((p) => (
              <li key={p} className="flex items-start gap-2 text-[0.88rem] leading-snug text-ash">
                <span className="mt-[0.35rem] h-1 w-1 shrink-0 rounded-full bg-accent" />
                {p}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-4">
        {items.map((it, i) => (
          <div key={it.id} className="rounded-lg border border-line bg-ink-2 p-4 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <span className="micro text-smoke">{String(i + 1).padStart(2, "0")}</span>
              <div className="flex items-center gap-4">
                {saving === it.id && <span className="micro text-signal">Saving…</span>}
                <button
                  type="button"
                  onClick={() => remove(it.id)}
                  className="micro text-smoke transition-colors hover:text-[#ff7a6b]"
                >
                  Remove
                </button>
              </div>
            </div>

            <input
              value={it.title}
              onChange={(e) => update(it.id, { title: e.target.value })}
              placeholder="What is it? (e.g. Weekend shifts at my dad's store)"
              className="display-md mb-4 w-full bg-transparent text-xl text-chalk outline-none placeholder:text-smoke/60"
            />

            <div className="mb-4 grid gap-3 sm:grid-cols-2">
              <input
                value={it.organization ?? ""}
                onChange={(e) => update(it.id, { organization: e.target.value })}
                placeholder="Where / organization"
                className="rounded-md border border-line bg-ink px-3 py-2.5 text-[0.9rem] text-chalk outline-none focus:border-accent"
              />
              <input
                value={it.role ?? ""}
                onChange={(e) => update(it.id, { role: e.target.value })}
                placeholder="Your role"
                className="rounded-md border border-line bg-ink px-3 py-2.5 text-[0.9rem] text-chalk outline-none focus:border-accent"
              />
            </div>

            <textarea
              value={it.description ?? ""}
              onChange={(e) => update(it.id, { description: e.target.value })}
              placeholder="What did you actually do? Plain words are fine — you can polish later."
              rows={3}
              className="mb-4 w-full resize-y rounded-md border border-line bg-ink px-3 py-2.5 text-[0.9rem] leading-relaxed text-chalk outline-none focus:border-accent"
            />

            {/* Two columns even on phones: these are a pair of short numeric
                fields, and stacking them wastes a full screen of height in a
                form that's already long. */}
            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center gap-2 sm:gap-3">
                <span className="micro shrink-0 text-smoke">Hrs / wk</span>
                <input
                  type="number"
                  min={0}
                  max={80}
                  step="0.5"
                  value={it.hours_per_week ?? ""}
                  onChange={(e) =>
                    update(it.id, {
                      hours_per_week: e.target.value === "" ? null : Number(e.target.value),
                    })
                  }
                  className="w-full min-w-0 rounded-md border border-line bg-ink px-3 py-2 text-[0.9rem] text-chalk outline-none focus:border-accent"
                />
              </label>
              <label className="flex items-center gap-2 sm:gap-3">
                <span className="micro shrink-0 text-smoke">Wks / yr</span>
                <input
                  type="number"
                  min={0}
                  max={52}
                  value={it.weeks_per_year ?? ""}
                  onChange={(e) =>
                    update(it.id, {
                      weeks_per_year: e.target.value === "" ? null : Number(e.target.value),
                    })
                  }
                  className="w-full min-w-0 rounded-md border border-line bg-ink px-3 py-2 text-[0.9rem] text-chalk outline-none focus:border-accent"
                />
              </label>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={add}
        className="mt-6 w-full rounded-lg border border-dashed border-line-bright py-5 text-[0.9rem] text-ash transition-colors hover:border-accent hover:text-chalk"
      >
        + Add {items.length === 0 ? "your first activity" : "another"}
      </button>

      {items.length > 0 && (
        <p className="micro mt-8 leading-relaxed text-smoke">
          Saved automatically to your account. Nothing here is shared with anyone.
        </p>
      )}
    </div>
  );
}
