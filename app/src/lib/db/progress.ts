"use client";

import { createClient } from "@/lib/supabase/client";

/**
 * Roadmap progress, backed by the database with a localStorage bridge.
 *
 * The app shipped "mark as done" in localStorage long before accounts existed,
 * so real students already have progress saved in their browser. Throwing that
 * away at signup would punish exactly the people who used the app earliest —
 * `migrateLocalProgress` lifts it into their account on first login instead.
 */

const LEGACY_KEY = "pathfinder-progress";

/** Reads the pre-accounts localStorage format: an array of item ids. */
function readLocal(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(LEGACY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export async function fetchProgress(): Promise<Set<string>> {
  const supabase = createClient();
  const { data, error } = await supabase.from("roadmap_progress").select("item_id");
  if (error) return new Set();
  return new Set((data ?? []).map((r) => r.item_id as string));
}

export async function setItemDone(itemId: string, done: boolean) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  if (done) {
    await supabase
      .from("roadmap_progress")
      .upsert({ user_id: user.id, item_id: itemId }, { onConflict: "user_id,item_id" });
  } else {
    await supabase
      .from("roadmap_progress")
      .delete()
      .eq("user_id", user.id)
      .eq("item_id", itemId);
  }
}

/**
 * One-way lift of browser progress into the account. Runs at most once per
 * device (guarded by a flag) and never deletes the local copy — if the upsert
 * fails, the student's original data is still sitting where it was.
 */
export async function migrateLocalProgress(): Promise<number> {
  if (typeof window === "undefined") return 0;
  if (window.localStorage.getItem("pf-progress-migrated") === "1") return 0;

  const local = readLocal();
  if (local.length === 0) {
    window.localStorage.setItem("pf-progress-migrated", "1");
    return 0;
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return 0;

  const rows = local.map((item_id) => ({ user_id: user.id, item_id }));
  const { error } = await supabase
    .from("roadmap_progress")
    .upsert(rows, { onConflict: "user_id,item_id" });

  if (error) return 0;

  window.localStorage.setItem("pf-progress-migrated", "1");
  return rows.length;
}
