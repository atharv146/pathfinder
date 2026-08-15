"use client";

import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser-side Supabase client.
 *
 * Both values here are safe to expose — the anon key is a *publishable* key
 * whose power is bounded entirely by Row Level Security policies on the
 * database. It is not a secret. The service-role key IS a secret and must
 * never appear in any file under `src/`.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
