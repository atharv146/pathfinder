import { getFreshness, formatVerified } from "@/data/freshness";

/**
 * "Last checked on…" — shown on content whose facts move year to year.
 *
 * Deliberately renders something in BOTH cases. An article with no
 * verification record says so, because a missing stamp that looks identical to
 * a verified one is how stale content hides. For this audience, admitting
 * "we haven't rechecked this recently, confirm it yourself" buys more trust
 * than silence does.
 */
export function FreshnessStamp({ slug }: { slug: string }) {
  const fresh = getFreshness(slug);

  if (!fresh) {
    return (
      <div className="mt-12 rounded-xl border border-line bg-panel/60 px-5 py-4">
        <p className="micro mb-1.5 text-smoke">Not recently re-checked</p>
        <p className="text-[0.85rem] leading-relaxed text-ash">
          This article hasn&rsquo;t been verified against current policy in a
          while. The explanations of how things work stay true, but any date,
          dollar figure, or eligibility rule is worth confirming on the
          school&rsquo;s own site or with a counselor.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-12 rounded-xl border border-line bg-panel/60 px-5 py-4">
      <p className="micro mb-1.5 text-accent">
        Facts last checked {formatVerified(fresh.verified)}
      </p>
      <p className="text-[0.85rem] leading-relaxed text-ash">
        {fresh.checked}
      </p>

      {fresh.watch && fresh.watch.length > 0 && (
        <>
          <p className="micro mt-4 mb-2 text-smoke">
            Most likely to have changed since
          </p>
          <ul className="flex flex-col gap-1.5">
            {fresh.watch.map((w) => (
              <li key={w} className="flex items-start gap-2.5">
                <span className="mt-[0.45rem] h-1 w-1 shrink-0 rounded-full bg-smoke" />
                <span className="text-[0.82rem] leading-relaxed text-ash">
                  {w}
                </span>
              </li>
            ))}
          </ul>
        </>
      )}

      <p className="mt-4 text-[0.8rem] leading-relaxed text-smoke">
        Policy in this area genuinely moves year to year. We&rsquo;d rather show
        you when we last looked than pretend it&rsquo;s always current.
      </p>
    </div>
  );
}
