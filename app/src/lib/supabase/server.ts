import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Server-side Supabase client for Server Components, Route Handlers and
 * Server Actions.
 *
 * `cookies()` is async in this version of Next, hence the await. The setAll
 * try/catch is deliberate and not defensive noise: Server Components are not
 * allowed to write cookies, so the call throws there. That is harmless as long
 * as `proxy.ts` is refreshing the session on every request — which it is — so
 * we swallow it rather than crash the render.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component — proxy.ts handles the refresh.
          }
        },
      },
    }
  );
}
