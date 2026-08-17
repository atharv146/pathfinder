"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

/**
 * Mobile navigation.
 *
 * WHY THIS EXISTS: the desktop nav is `hidden sm:flex` and had no small-screen
 * counterpart, so on a phone the only links in the header were Log in / Sign
 * up — there was literally no way to reach the roadmap or the guide. On a
 * phone-first audience that's not a polish issue, it's the site being
 * unusable.
 *
 * Deliberately a full-screen sheet rather than a cramped dropdown: tap targets
 * stay large, which matters more than compactness for the devices this
 * audience actually uses.
 */
export function MobileNav({
  links,
}: {
  links: { href: string; label: string }[];
}) {
  const [open, setOpen] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const pathname = usePathname();

  // Close on navigation — otherwise the sheet stays open over the new page.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll only while the sheet is open, and always restore it.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return;
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setSignedIn(!!data.user));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) =>
      setSignedIn(!!session?.user)
    );
    return () => sub.subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const all = signedIn
    ? [
        ...links,
        { href: "/activities", label: "Activities" },
        { href: "/stats", label: "Your details" },
        { href: "/account", label: "Account" },
      ]
    : links;

  return (
    <div className="sm:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Open menu"}
        className="relative z-[60] flex h-10 w-10 flex-col items-center justify-center gap-[5px]"
      >
        <span
          className={`h-[1.5px] w-5 bg-chalk transition-transform duration-300 ${
            open ? "translate-y-[6.5px] rotate-45" : ""
          }`}
        />
        <span
          className={`h-[1.5px] w-5 bg-chalk transition-opacity duration-200 ${
            open ? "opacity-0" : ""
          }`}
        />
        <span
          className={`h-[1.5px] w-5 bg-chalk transition-transform duration-300 ${
            open ? "-translate-y-[6.5px] -rotate-45" : ""
          }`}
        />
      </button>

      <div
        className={`fixed inset-0 z-50 bg-ink transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <nav className="flex h-full flex-col justify-center gap-2 px-8">
          {all.map((l, i) => (
            <Link
              key={l.href}
              href={l.href}
              className="display border-b border-line py-5 text-4xl text-chalk transition-transform duration-300"
              style={{
                transform: open ? "translateY(0)" : "translateY(12px)",
                opacity: open ? 1 : 0,
                transitionDelay: open ? `${80 + i * 45}ms` : "0ms",
              }}
            >
              {l.label}
            </Link>
          ))}

          <div className="mt-10 flex flex-col gap-3">
            {signedIn ? (
              <button
                type="button"
                onClick={signOut}
                className="rounded-full border border-line-bright px-6 py-4 text-sm text-chalk"
              >
                Sign out
              </button>
            ) : (
              <>
                <Link
                  href="/signup"
                  className="rounded-full bg-chalk px-6 py-4 text-center text-sm font-semibold text-ink"
                >
                  Sign up
                </Link>
                <Link
                  href="/login"
                  className="rounded-full border border-line-bright px-6 py-4 text-center text-sm text-chalk"
                >
                  Log in
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
}
