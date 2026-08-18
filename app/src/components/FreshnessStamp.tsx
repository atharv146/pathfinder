import { getFreshness, formatVerified } from "@/data/freshness";

/**
 * A single quiet "last checked" line at the foot of an article.
 *
 * ⚠️ WHAT THIS DELIBERATELY NO LONGER RENDERS, AND WHY (Aug 17, 2026).
 * This used to print `fresh.checked` and the whole `fresh.watch` list to the
 * reader. That was a real mistake: both fields are written for whoever
 * maintains the content next, not for a student. `watch` in particular
 * contains literal instructions to future editors ("do NOT add acceptance-rate
 * numbers here"), which is internal process leaking onto a page a 16-year-old
 * is reading. It also closed with a line apologising for possibly being out of
 * date, which undersells work that was genuinely verified against primary
 * sources.
 *
 * Those fields REMAIN in data/freshness.ts and remain valuable — they are the
 * record of what was actually checked and what to re-check. They are just not
 * the reader's business. Keep it that way: if you want to surface something
 * here, write a new user-facing field rather than rendering the maintainer's.
 *
 * The date itself stays because it is a real, quiet signal and costs one line.
 */
export function FreshnessStamp({ slug }: { slug: string }) {
  const fresh = getFreshness(slug);
  if (!fresh) return null;

  return (
    <p className="mt-12 border-t border-line pt-5 text-[0.8rem] text-smoke">
      Last checked {formatVerified(fresh.verified)}. Deadlines and eligibility
      rules change each year — confirm anything time-sensitive on the
      organisation&rsquo;s own site.
    </p>
  );
}
