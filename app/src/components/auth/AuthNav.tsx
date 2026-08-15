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
    return (
      <Link
        href="/signup"
        className="rounded-full border border-line-bright px-5 py-2 text-[0.72rem] uppercase tracking-[0.18em] text-chalk transition-colors hover:border-chalk"
      >
        Get started
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <span className="micro hidden max-w-[12rem] truncate text-smoke sm:inline">
        {user.email}
      </span>
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
