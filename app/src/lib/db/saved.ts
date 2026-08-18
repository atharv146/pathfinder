"use client";

import { createClient } from "@/lib/supabase/client";

/**
 * Saved opportunities — migration 0010.
 *
 * Same shape and same reasoning as `db/courses.ts`: RLS scopes every row to
 * the signed-in user, so reads don't re-filter by user_id; writes still send
 * it because the policy's WITH CHECK requires it.
 *
 * `missingTable` is surfaced rather than swallowed for the same reason it is
 * there — migrations are applied by hand in the Supabase dashboard, so "0010
 * hasn't been run yet" is a normal operating state, and the UI needs to be
 * able to say so instead of failing silently or pretending nothing saved.
 */

/** Postgres 42P01: the table doesn't exist — migration 0010 not run. */
export function isMissingTable(error: unknown): boolean {
  const e = error as { code?: string; message?: string } | null;
  if (!e) return false;
  if (e.code === "42P01") return true;
  return /relation .* does not exist|could not find the table/i.test(
    e.message ?? ""
  );
}

export async function fetchSavedIds(): Promise<{
  ids: string[];
  error: string | null;
  missingTable: boolean;
}> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("saved_opportunities")
    .select("opportunity_id");

  if (error) {
    return {
      ids: [],
      error: error.message,
      missingTable: isMissingTable(error),
    };
  }
  return {
    ids: (data ?? []).map((r) => (r as { opportunity_id: string }).opportunity_id),
    error: null,
    missingTable: false,
  };
}

export async function saveOpportunity(
  opportunityId: string
): Promise<{ error: string | null; missingTable: boolean }> {
  const supabase = createClient();
  const { data: auth } = await supabase.auth.getUser();
  const userId = auth.user?.id;
  if (!userId) return { error: "Not signed in", missingTable: false };

  // Upsert rather than insert: the unique index means a double-click would
  // otherwise surface a constraint violation to a student as a failure, when
  // the intent (this is saved) is already satisfied.
  const { error } = await supabase
    .from("saved_opportunities")
    .upsert(
      { user_id: userId, opportunity_id: opportunityId },
      { onConflict: "user_id,opportunity_id", ignoreDuplicates: true }
    );

  if (error) {
    return { error: error.message, missingTable: isMissingTable(error) };
  }
  return { error: null, missingTable: false };
}

export async function unsaveOpportunity(
  opportunityId: string
): Promise<{ error: string | null; missingTable: boolean }> {
  const supabase = createClient();
  const { error } = await supabase
    .from("saved_opportunities")
    .delete()
    .eq("opportunity_id", opportunityId);

  if (error) {
    return { error: error.message, missingTable: isMissingTable(error) };
  }
  return { error: null, missingTable: false };
}
