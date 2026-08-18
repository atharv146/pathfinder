"use client";

import { useCallback, useEffect, useState } from "react";
import {
  fetchSavedIds,
  saveOpportunity,
  unsaveOpportunity,
} from "@/lib/db/saved";

/**
 * Saved-opportunity state for the directory.
 *
 * ── OPTIMISTIC, AND HONEST ABOUT FAILING ─────────────────────────────────
 * The toggle updates local state first so the star responds instantly, then
 * writes. If the write fails the toggle is REVERTED rather than left looking
 * saved — a star that lies is worse than a star that flickers, because the
 * student's whole reason for saving is to find it again in October.
 *
 * ── WHY `unavailable` IS A FIRST-CLASS STATE ─────────────────────────────
 * Migrations here are applied by hand in the Supabase dashboard, so "0010
 * hasn't been run yet" is a normal operating state rather than an exception
 * (see lib/db/resilient.ts for the same reasoning applied to columns). When
 * that's the case the feature hides itself entirely instead of rendering
 * buttons that silently do nothing — and the rest of the directory keeps
 * working, which is the whole point.
 *
 * Local dev also lands here: `src/proxy.ts` lets gated routes render without a
 * session in development, so there is no user to attribute a save to. Hiding
 * the control is the correct behaviour there too.
 */
export function useSavedOpportunities() {
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [ready, setReady] = useState(false);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { ids, error, missingTable } = await fetchSavedIds();
      if (cancelled) return;
      // Any read failure (missing table, no session) disables the feature
      // rather than half-enabling it.
      if (missingTable || error) setUnavailable(true);
      else setSaved(new Set(ids));
      setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const toggle = useCallback(
    async (id: string) => {
      const wasSaved = saved.has(id);

      setSaved((prev) => {
        const next = new Set(prev);
        if (wasSaved) next.delete(id);
        else next.add(id);
        return next;
      });

      const { error, missingTable } = wasSaved
        ? await unsaveOpportunity(id)
        : await saveOpportunity(id);

      if (error) {
        // Put it back the way it was, and stop offering a control that can't
        // deliver on what it promises.
        setSaved((prev) => {
          const next = new Set(prev);
          if (wasSaved) next.add(id);
          else next.delete(id);
          return next;
        });
        if (missingTable) setUnavailable(true);
      }
    },
    [saved]
  );

  return { saved, toggle, ready, unavailable };
}
