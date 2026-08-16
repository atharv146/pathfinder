"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ProfileDetails } from "@/components/account/ProfileDetails";
import type { Profile } from "@/lib/db/types";

const GRADES = [6, 7, 8, 9, 10, 11, 12];

/**
 * Account settings: change your grade, see progress, delete everything.
 *
 * Deletion is not optional polish. This app stores data belonging to minors,
 * and "let me remove my data" is a baseline expectation as well as a legal one
 * under COPPA/GDPR-style regimes. It is implemented as a real cascading delete
 * (see the `on delete cascade` FKs in migration 0001), not a soft "deactivated"
 * flag — a student who asks to be forgotten should actually be forgotten.
 */
export function AccountPanel() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [email, setEmail] = useState("");
  const [doneCount, setDoneCount] = useState(0);
  const [activityCount, setActivityCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

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

      const [{ data: p }, { count: pc }, { count: ac }] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
        supabase
          .from("roadmap_progress")
          .select("*", { count: "exact", head: true }),
        supabase.from("activities").select("*", { count: "exact", head: true }),
      ]);

      setProfile((p as Profile) ?? null);
      setDoneCount(pc ?? 0);
      setActivityCount(ac ?? 0);
      setLoading(false);
    };
    load();
  }, []);

  const setGrade = async (grade: number) => {
    if (!profile) return;
    setProfile({ ...profile, grade });
    setSaved(false);
    const supabase = createClient();
    await supabase.from("profiles").update({ grade }).eq("id", profile.id);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  };

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

      <section>
        <p className="micro mb-4 text-smoke">Your grade</p>
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-7 sm:gap-3">
          {GRADES.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setGrade(g)}
              aria-pressed={profile?.grade === g}
              className={`display rounded-lg border py-4 text-xl transition-all sm:py-5 sm:text-2xl ${
                profile?.grade === g
                  ? "border-accent bg-accent/10 text-chalk"
                  : "border-line text-ash hover:border-line-bright hover:text-chalk"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
        {saved && <p className="micro mt-3 text-signal">✓ Saved</p>}
      </section>

      <section className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line">
        <div className="bg-ink-2 p-5 sm:p-6">
          <p className="display text-3xl text-chalk sm:text-4xl">{doneCount}</p>
          <p className="micro mt-2 text-smoke">Roadmap items done</p>
        </div>
        <div className="bg-ink-2 p-5 sm:p-6">
          <p className="display text-3xl text-chalk sm:text-4xl">{activityCount}</p>
          <p className="micro mt-2 text-smoke">Activities saved</p>
        </div>
      </section>

      {/* Optional profile fields. Rendered only once the profile has loaded —
          every field inside is nullable, so there is nothing to show until we
          know what's already filled in. */}
      {profile && <ProfileDetails profile={profile} />}

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
