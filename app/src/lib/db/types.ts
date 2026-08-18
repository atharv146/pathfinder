/**
 * Shapes mirroring supabase/migrations/0001_profiles_progress_activities.sql.
 *
 * Hand-written rather than generated so the repo has no dependency on the
 * Supabase CLI. If the migration changes, change this too — they are the same
 * contract expressed twice.
 */

export type AccountType = "student" | "parent";

export type GpaScale = "weighted" | "unweighted";

export type CourseRigor =
  | "standard"
  | "some_honors"
  | "mostly_honors_ap"
  | "most_rigorous";

/**
 * Optional, sensitive, and never required — see migration 0004 and Section 7.
 * Collected only because aid eligibility genuinely differs by status, so
 * guidance is wrong without it. Never shared, never used for analytics.
 */
export type StatusCategory =
  | "us_citizen"
  | "permanent_resident"
  | "eligible_noncitizen"
  | "daca"
  | "undocumented"
  | "international"
  | "prefer_not_to_say";

/**
 * Added in migration 0008. Student-reported, because no maintainable database
 * of per-school course catalogs exists — see that migration for the reasoning.
 * `not_sure` is a real answer, not a placeholder.
 */
export type SchoolApOffered =
  | "none"
  | "1_5"
  | "6_10"
  | "11_20"
  | "20_plus"
  | "not_sure";

export type Profile = {
  id: string;
  grade: number | null;
  major: string | null;
  major_undecided: boolean;
  account_type: AccountType;
  display_name: string | null;
  onboarded_at: string | null;
  created_at: string;
  updated_at: string;

  // Added in migration 0004. All nullable by design — the app must render and
  // function with every one of these unset.
  gpa: number | null;
  gpa_scale: GpaScale | null;
  sat_score: number | null;
  act_score: number | null;
  course_rigor: CourseRigor | null;
  target_colleges: string[];
  first_gen: boolean | null;
  home_language: string | null;
  status_category: StatusCategory | null;

  // Added in migration 0008. The "what's offered" half of course rigor —
  // meaningless on its own, and the course list is meaningless without it.
  school_ap_offered: SchoolApOffered | null;
  school_offers_ib: boolean | null;
  school_offers_dual_enrollment: boolean | null;
  school_course_limits: string | null;
  /** Migration 0011 — the student's own goals/ideas, free text. */
  goals_notes: string | null;
};

/**
 * A single class on a student's transcript or planned schedule — migration
 * 0008. `level` and `subject` are nullable because "I don't actually know if
 * it's honors" is a common and honest answer.
 */
export type CourseLevel =
  | "regular"
  | "honors"
  | "ap"
  | "ib"
  | "dual_enrollment"
  | "other";

export type CourseSubject =
  | "math"
  | "english"
  | "science"
  | "social_studies"
  | "world_language"
  | "arts"
  | "cte"
  | "other";

/** Past, present and planned all live in one table — see migration 0008. */
export type CourseStatus = "taken" | "taking" | "planned";

export type Course = {
  id: string;
  user_id: string;
  grade: number | null;
  title: string;
  level: CourseLevel | null;
  subject: CourseSubject | null;
  status: CourseStatus;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type Activity = {
  id: string;
  user_id: string;
  title: string;
  organization: string | null;
  role: string | null;
  description: string | null;
  hours_per_week: number | null;
  weeks_per_year: number | null;
  grade_levels: number[];
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type RoadmapProgressRow = {
  user_id: string;
  item_id: string;
  completed_at: string;
};

/** A profile still needs onboarding until it has a grade and a major answer. */
export function needsOnboarding(p: Profile | null): boolean {
  if (!p) return true;
  if (p.onboarded_at) return false;
  return p.grade === null || (!p.major && !p.major_undecided);
}
