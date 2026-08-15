"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { checkPassword, isValidEmail, friendlyAuthError } from "@/lib/auth/validation";

type Mode = "signin" | "signup";

/**
 * Email/password + Google auth.
 *
 * The password checklist is shown live during signup rather than as an error
 * after submit — for an audience filling this in on a phone, being told the
 * rules up front beats being rejected three times.
 */
export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const params = useSearchParams();
  const isSignup = mode === "signup";

  // `next` is set by proxy.ts when it intercepts a gated route. Only relative
  // paths are honoured — an absolute URL here would be an open redirect.
  const rawNext = params.get("next");
  const next = rawNext && rawNext.startsWith("/") ? rawNext : "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [existing, setExisting] = useState(false);

  const pw = checkPassword(password);
  const emailOk = isValidEmail(email);
  const canSubmit = emailOk && (isSignup ? pw.ok : password.length > 0) && !busy;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setBusy(true);
    setError(null);

    const supabase = createClient();

    if (isSignup) {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      });
      setBusy(false);
      if (error) return setError(friendlyAuthError(error.message));

      // Supabase deliberately does NOT error when the email already exists —
      // that would let anyone probe which addresses have accounts. Instead it
      // returns a decoy user with an empty `identities` array. Detecting that
      // is the only way to tell someone they already have an account rather
      // than leaving them waiting for an email that never arrives.
      if (data.user && data.user.identities?.length === 0) {
        setError("You already have an account with this email. Sign in instead.");
        setExisting(true);
        return;
      }

      // Do NOT route to a logged-in view here — the account is not usable
      // until the email is confirmed.
      setSent(true);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setBusy(false);
    if (error) return setError(friendlyAuthError(error.message));
    router.push(next);
    router.refresh();
  };

  const google = async () => {
    setBusy(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
    if (error) {
      setBusy(false);
      setError(friendlyAuthError(error.message));
    }
    // On success the browser navigates away to Google; no cleanup needed.
  };

  if (sent) {
    return (
      <div className="rounded-lg border border-line bg-panel p-8">
        <h2 className="display-md mb-3 text-2xl text-chalk">Check your email</h2>
        <p className="text-[0.95rem] leading-relaxed text-ash">
          We sent a confirmation link to <span className="text-chalk">{email}</span>. Click
          it to finish creating your account. It can take a minute to arrive — check spam
          if you don&rsquo;t see it.
        </p>
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={google}
        disabled={busy}
        className="flex w-full items-center justify-center gap-3 rounded-full border border-line-bright bg-chalk px-6 py-3.5 text-sm font-semibold text-ink transition-colors hover:bg-white disabled:opacity-50"
      >
        <svg width="17" height="17" viewBox="0 0 48 48" aria-hidden>
          <path fill="#4285F4" d="M45.1 24.5c0-1.6-.1-2.7-.4-4H24v7.3h12.1c-.2 2-1.6 5-4.6 7l7 5.4c4.2-3.9 6.6-9.6 6.6-15.7z" />
          <path fill="#34A853" d="M24 46c6 0 11-2 14.6-5.4l-7-5.4c-1.9 1.3-4.4 2.2-7.6 2.2-5.8 0-10.7-3.8-12.5-9.1l-7.2 5.6C7.9 41 15.4 46 24 46z" />
          <path fill="#FBBC05" d="M11.5 28.3c-.5-1.4-.7-2.8-.7-4.3s.3-2.9.7-4.3l-7.2-5.6C2.8 17 2 20.4 2 24s.8 7 2.3 9.9l7.2-5.6z" />
          <path fill="#EA4335" d="M24 9.5c4.1 0 6.9 1.8 8.5 3.3l6.2-6C34.9 3.3 30 1 24 1 15.4 1 7.9 6 4.3 14.1l7.2 5.6C13.3 13.4 18.2 9.5 24 9.5z" />
        </svg>
        Continue with Google
      </button>

      <div className="my-7 flex items-center gap-4">
        <span className="h-px flex-1 bg-line" />
        <span className="micro text-smoke">or</span>
        <span className="h-px flex-1 bg-line" />
      </div>

      <form onSubmit={submit} noValidate>
        <label className="micro mb-2 block text-smoke" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-5 w-full rounded-md border border-line bg-ink-2 px-4 py-3 text-[0.95rem] text-chalk outline-none transition-colors focus:border-accent"
          placeholder="you@example.com"
        />

        <label className="micro mb-2 block text-smoke" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete={isSignup ? "new-password" : "current-password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onBlur={() => setTouched(true)}
          className="w-full rounded-md border border-line bg-ink-2 px-4 py-3 text-[0.95rem] text-chalk outline-none transition-colors focus:border-accent"
          placeholder={isSignup ? "At least 8 characters" : ""}
        />

        {isSignup && (
          <ul className="mt-4 space-y-1.5">
            {pw.rules.map((r) => (
              <li
                key={r.label}
                className={`flex items-center gap-2 text-[0.8rem] transition-colors ${
                  r.met ? "text-signal" : touched ? "text-ash" : "text-smoke"
                }`}
              >
                <span aria-hidden>{r.met ? "✓" : "○"}</span>
                {r.label}
              </li>
            ))}
          </ul>
        )}

        {error && (
          <div role="alert" className="mt-5">
            <p className="text-[0.85rem] leading-snug text-[#ff7a6b]">{error}</p>
            {existing && (
              <Link
                href="/login"
                className="micro mt-3 inline-block text-chalk underline underline-offset-4 hover:text-accent"
              >
                Go to sign in →
              </Link>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={!canSubmit}
          className="mt-7 w-full rounded-full bg-accent px-6 py-3.5 text-sm font-semibold text-ink transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
        >
          {busy ? "Working…" : isSignup ? "Create account" : "Sign in"}
        </button>
      </form>

      <p className="mt-7 text-center text-[0.85rem] text-ash">
        {isSignup ? "Already have an account? " : "New here? "}
        <Link
          href={isSignup ? "/login" : "/signup"}
          className="text-chalk underline underline-offset-4 hover:text-accent"
        >
          {isSignup ? "Sign in" : "Create one"}
        </Link>
      </p>
    </div>
  );
}
