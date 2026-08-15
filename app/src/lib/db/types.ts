/**
 * Shapes mirroring supabase/migrations/0001_profiles_progress_activities.sql.
 *
 * Hand-written rather than generated so the repo has no dependency on the
 * Supabase CLI. If the migration changes, change this too — they are the same
 * contract expressed twice.
 */

export type AccountType = "student" | "parent";

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
