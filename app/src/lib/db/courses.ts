"use client";

import { createClient } from "@/lib/supabase/client";
import type { Course, CourseLevel, CourseStatus, CourseSubject } from "./types";

/**
 * The per-course list — migration 0008.
 *
 * Thin on purpose: RLS already scopes every row to the signed-in user, so
 * these do not re-filter by user_id on reads. Writes still send it, because
 * an insert has to satisfy the policy's WITH CHECK.
 *
 * Errors are returned rather than swallowed. This is a student's own
 * transcript — a row that silently fails to save is worse than an error
 * message, and the caller renders "the migration hasn't been run" text that
 * would be impossible to write if the reason were hidden here.
 */

export type CourseDraft = {
  grade: number | null;
  title: string;
  level: CourseLevel | null;
  subject: CourseSubject | null;
  status: CourseStatus;
};

/** Postgres 42P01: the table itself doesn't exist — migration 0008 not run. */
export function isMissingTable(error: unknown): boolean {
  const e = error as { code?: string; message?: string } | null;
  if (!e) return false;
  if (e.code === "42P01") return true;
  return /relation .* does not exist|could not find the table/i.test(
    e.message ?? ""
  );
}

export async function fetchCourses(): Promise<{
  courses: Course[];
  error: string | null;
  missingTable: boolean;
}> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .order("grade", { ascending: true })
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    return {
      courses: [],
      error: error.message,
      missingTable: isMissingTable(error),
    };
  }
  return { courses: (data ?? []) as Course[], error: null, missingTable: false };
}

export async function addCourse(
  draft: CourseDraft,
  sortOrder: number
): Promise<{ course: Course | null; error: string | null }> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { course: null, error: "You're signed out." };

  const { data, error } = await supabase
    .from("courses")
    .insert({
      user_id: user.id,
      grade: draft.grade,
      title: draft.title.trim(),
      level: draft.level,
      subject: draft.subject,
      status: draft.status,
      sort_order: sortOrder,
    })
    .select()
    .single();

  if (error) return { course: null, error: error.message };
  return { course: data as Course, error: null };
}

export async function updateCourse(
  id: string,
  patch: Partial<CourseDraft>
): Promise<string | null> {
  const supabase = createClient();
  const { error } = await supabase.from("courses").update(patch).eq("id", id);
  return error ? error.message : null;
}

export async function deleteCourse(id: string): Promise<string | null> {
  const supabase = createClient();
  const { error } = await supabase.from("courses").delete().eq("id", id);
  return error ? error.message : null;
}
