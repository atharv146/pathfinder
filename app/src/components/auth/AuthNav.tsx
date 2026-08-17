"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

/**
 * Nav auth control: "Get started" when signed out, an account/sign-out pair
 * when signed in.
 *
 * Subscribes to `onAuthStateChange` rather than reading the user once, so the
 * header updates immediately after sign-in/out without a full reload — and
 * stays correct if the session is revoked in another tab.
 *
 * Renders the signed-out state while `user` is undefined (still loading) so
 * there is never a flash of an account menu for a logged-out visitor.
 */
export function AuthNav() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Missing config means auth isn't wired up yet — stay quiet rather than
    // throwing on every page load.
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      setReady(true);
      return;
    }

    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
      setReady(true);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  if (!ready || !user) {
    // Both options shown side by side rather than a single "Get started".
    // A returning student should never have to guess that the signup button
    // is also where you log in.
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/login"
          className="rounded-full px-4 py-2 text-[0.72rem] uppercase tracking-[0.18em] text-ash transition-colors hover:text-chalk"
        >
          Log in
        </Link>
        <Link
          href="/signup"
          className="rounded-full bg-chalk px-5 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-ink transition-colors hover:bg-white"
        >
          Sign up
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      {/* Signed-in-only destinations live here rather than in the main nav —
          showing a link that just bounces you to a signup wall is worse than
          not showing it. */}
      <Link
        href="/activities"
        className="micro hidden text-ash transition-colors hover:text-chalk sm:inline"
      >
        :Activities
      </Link>
      <Link
        href="/stats"
        className="micro hidden text-ash transition-colors hover:text-chalk sm:inline"
      >
        :Details
      </Link>
      {/* The email doubles as the account link — it's the affordance people
          already expect to be clickable in a header. */}
      <Link
        href="/account"
        className="micro hidden max-w-[10rem] truncate text-smoke transition-colors hover:text-chalk lg:inline"
      >
        {user.email}
      </Link>
      <button
        type="button"
        onClick={signOut}
        className="rounded-full border border-line-bright px-5 py-2 text-[0.72rem] uppercase tracking-[0.18em] text-chalk transition-colors hover:border-chalk"
      >
        Sign out
      </button>
    </div>
  );
}
