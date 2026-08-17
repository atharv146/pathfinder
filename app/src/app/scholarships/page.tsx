import { redirect } from "next/navigation";

/**
 * Permanent redirect to `/opportunities` (Aug 17, 2026).
 *
 * This route used to be the real page — scholarships only, reached via a nav
 * link literally labelled "Money". It's now a unified directory of
 * scholarships, internships, programs and competitions living at
 * `/opportunities`. Kept as a redirect rather than deleted so an old link or
 * a bookmark still lands somewhere real instead of a 404.
 */
export default function ScholarshipsRedirect() {
  redirect("/opportunities");
}
