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
