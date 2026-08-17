"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { LanguageAndRole } from "@/components/i18n/LanguageAndRole";
import { ShareLink } from "@/components/account/ShareLink";


/**
 * Account settings: your login, your language, sharing, and deleting
 * everything.
 *
 * V2 §16K step 3 moved grade, major, the count tiles and every profile field
 * out to `/stats`. The split is by what the thing is: this page is what you do
 * to an *account*, `/stats` is the picture of you that the product reads from.
 * Do not re-add profile fields here — a second copy of the same fields was the
 * specific outcome that plan ruled out.
 *
 * Deletion is not optional polish. This app stores data belonging to minors,
 * and "let me remove my data" is a baseline expectation as well as a legal one
 * under COPPA/GDPR-style regimes. It is implemented as a real cascading delete
 * (see the `on delete cascade` FKs in migration 0001), not a soft "deactivated"
 * flag — a student who asks to be forgotten should actually be forgotten.
 */
export function AccountPanel() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return setLoading(false);

      setEmail(user.email ?? "");
      setLoading(false);
    };
    load();
  }, []);

  const deleteAccount = async () => {
    setDeleting(true);
    setDeleteError(null);
    const supabase = createClient();

    // Delegated to a server route: erasing the login record itself needs the
    // service-role key, which must never reach the browser. The route takes no
    // parameters — it deletes whoever the verified session says you are.
    try {
      const res = await fetch("/api/account/delete", { method: "POST" });
      const body = await res.json().catch(() => ({}));

      if (!res.ok) {
        setDeleting(false);
        return setDeleteError(body.error ?? "Something went wrong. Nothing was deleted.");
      }
    } catch {
      setDeleting(false);
      return setDeleteError("Couldn't reach the server. Nothing was deleted.");
    }

    await supabase.auth.signOut();
    router.push("/?deleted=1");
    router.refresh();
  };

  if (loading) return <p className="micro text-smoke">Loading…</p>;

  return (
    <div className="space-y-12">
      <section>
        <p className="micro mb-3 text-smoke">Signed in as</p>
        <p className="display-md break-all text-xl text-chalk sm:text-2xl">{email}</p>
      </section>

      {/* Grade, major, classes and every optional profile field moved to
          /stats. This link is the only pointer to them from here — a second
          copy of the fields is exactly what §16K ruled out. */}
      <section className="rounded-lg border border-line bg-panel p-6 sm:p-8">
        <h2 className="display-md mb-2 text-xl text-chalk">Your details</h2>
        <p className="mb-5 max-w-xl text-[0.9rem] leading-relaxed text-ash">
          Your grade, what you might study, the classes you&rsquo;re taking and
          what your school offers all live on their own page now — so the
          things that shape your roadmap aren&rsquo;t buried next to the delete
          button.
        </p>
        <Link
          href="/stats"
          className="micro inline-block text-chalk underline underline-offset-4 transition-colors hover:text-accent"
        >
          Edit your details &rarr;
        </Link>
      </section>

      <LanguageAndRole />

      <ShareLink />

      <section className="rounded-lg border border-[#ff7a6b]/30 p-5 sm:p-6">
        <p className="display-md mb-2 text-lg text-chalk">Delete your data</p>
        <p className="mb-5 text-[0.88rem] leading-relaxed text-ash">
          Permanently removes your profile, roadmap progress and activities list. This
          cannot be undone and we keep no copy.
        </p>

        {!confirmOpen ? (
          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            className="rounded-full border border-[#ff7a6b]/50 px-5 py-3 text-[0.85rem] text-[#ff7a6b] transition-colors hover:bg-[#ff7a6b]/10"
          >
            Delete my data
          </button>
        ) : (
          <div>
            <label className="micro mb-2 block text-smoke" htmlFor="confirm-delete">
              Type DELETE to confirm
            </label>
            <input
              id="confirm-delete"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="DELETE"
              className="mb-4 w-full rounded-md border border-line bg-ink px-4 py-3 text-chalk outline-none focus:border-[#ff7a6b]"
            />
            {deleteError && (
              <p role="alert" className="mb-4 text-[0.85rem] text-[#ff7a6b]">
                {deleteError}
              </p>
            )}
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                disabled={confirmText !== "DELETE" || deleting}
                onClick={deleteAccount}
                className="rounded-full bg-[#ff7a6b] px-6 py-3 text-[0.85rem] font-semibold text-ink transition-opacity disabled:opacity-40"
              >
                {deleting ? "Deleting…" : "Permanently delete"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setConfirmOpen(false);
                  setConfirmText("");
                }}
                className="rounded-full border border-line-bright px-6 py-3 text-[0.85rem] text-ash transition-colors hover:text-chalk"
              >
                Cancel
              </button>
            </div>
            <p className="micro mt-5 leading-relaxed text-smoke">
              This removes your profile, progress, activities and your login. You can sign
              up again any time, but nothing will be restored.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
