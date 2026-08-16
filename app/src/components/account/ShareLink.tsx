"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

/**
 * Student-initiated counselor share link.
 *
 * Per the July 21, 2026 decision, this is the student's to create and the
 * student's to kill. Nobody else can generate one, parents included — the app
 * is not a monitoring channel, and that principle is why this feature took
 * this shape rather than "link a parent account to a student".
 *
 * The copy below tells the student exactly what the recipient will and will
 * not see. That's not decoration: they're about to hand a URL to an adult, and
 * informed consent means knowing the contents before you send it, not after.
 */

type Link = {
  id: string;
  token: string;
  revoked_at: string | null;
  expires_at: string;
  last_viewed_at: string | null;
  created_at: string;
};

function makeToken() {
  // 32 bytes from the platform CSPRNG. Must never be derived from the user id
  // or a timestamp — the token is the only thing protecting the page.
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

export function ShareLink() {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const supabase = createClient();
    const { data, error: e } = await supabase
      .from("share_links")
      .select("id, token, revoked_at, expires_at, last_viewed_at, created_at")
      .order("created_at", { ascending: false });

    if (e) {
      setError(
        e.message.includes("share_links")
          ? "Sharing isn't set up yet — run migration 0007 in Supabase."
          : e.message
      );
    } else {
      setLinks((data as Link[]) ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const create = async () => {
    setBusy(true);
    setError(null);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return setBusy(false);

    const { error: e } = await supabase
      .from("share_links")
      .insert({ user_id: user.id, token: makeToken() });

    if (e) setError(`Couldn't create a link: ${e.message}`);
    else await load();
    setBusy(false);
  };

  const revoke = async (id: string) => {
    setBusy(true);
    const supabase = createClient();
    const { error: e } = await supabase
      .from("share_links")
      .update({ revoked_at: new Date().toISOString() })
      .eq("id", id);
    if (e) setError(`Couldn't revoke: ${e.message}`);
    else await load();
    setBusy(false);
  };

  const copy = async (token: string) => {
    const url = `${window.location.origin}/s/${token}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(token);
      window.setTimeout(() => setCopied(null), 2000);
    } catch {
      setError("Couldn't copy — select the link and copy it manually.");
    }
  };

  if (loading) return null;

  const active = links.filter(
    (l) => !l.revoked_at && new Date(l.expires_at) > new Date()
  );

  return (
    <div className="mt-10 rounded-lg border border-line bg-panel p-6 sm:p-8">
      <h2 className="display-md text-xl text-chalk">
        Share with a counselor
      </h2>
      <p className="mt-2 text-[0.9rem] leading-relaxed text-ash">
        Creates a link you can send to a school counselor, a teacher, or a
        mentor so they can see what you&rsquo;ve been working on. Only you can
        make one, and you can switch it off at any time.
      </p>

      {/* Informed consent: what's in the link, stated before they send it. */}
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-line bg-ink px-4 py-3">
          <p className="micro mb-2 text-accent">They will see</p>
          <ul className="space-y-1 text-[0.85rem] leading-relaxed text-ash">
            <li>Your grade and major interest</li>
            <li>Which roadmap items you&rsquo;ve marked done</li>
            <li>Your activities list</li>
          </ul>
        </div>
        <div className="rounded-xl border border-line bg-ink px-4 py-3">
          <p className="micro mb-2 text-smoke">They will not see</p>
          <ul className="space-y-1 text-[0.85rem] leading-relaxed text-ash">
            <li>Your immigration status</li>
            <li>Your GPA or test scores</li>
            <li>Anything you asked the AI</li>
          </ul>
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-4 text-[0.85rem] text-[#ff7a6b]">
          {error}
        </p>
      )}

      {active.length > 0 && (
        <ul className="mt-6 flex flex-col gap-3">
          {active.map((l) => (
            <li
              key={l.id}
              className="rounded-xl border border-line bg-ink px-4 py-3"
            >
              <p className="break-all font-mono text-[0.78rem] text-chalk">
                /s/{l.token.slice(0, 16)}…
              </p>
              <p className="micro mt-1.5 text-smoke">
                Expires {new Date(l.expires_at).toLocaleDateString()}
                {l.last_viewed_at
                  ? ` · opened ${new Date(l.last_viewed_at).toLocaleDateString()}`
                  : " · not opened yet"}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  onClick={() => copy(l.token)}
                  className="rounded-full bg-accent px-4 py-2 text-[0.82rem] font-semibold text-ink"
                >
                  {copied === l.token ? "Copied" : "Copy link"}
                </button>
                <button
                  onClick={() => revoke(l.id)}
                  disabled={busy}
                  className="rounded-full border border-line-bright px-4 py-2 text-[0.82rem] text-ash hover:text-chalk disabled:opacity-40"
                >
                  Turn off
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {active.length === 0 && (
        <button
          onClick={create}
          disabled={busy}
          className="mt-6 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-ink disabled:opacity-40"
        >
          {busy ? "Creating…" : "Create a share link"}
        </button>
      )}

      <p className="mt-4 text-[0.8rem] leading-relaxed text-smoke">
        Links stop working after 180 days even if you forget about them.
        Anyone with the link can open it, so only send it to someone you trust.
      </p>
    </div>
  );
}
