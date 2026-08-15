import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Session refresh on every request.
 *
 * NOTE ON THE FILENAME: this is `proxy.ts`, not `middleware.ts`. Next.js 16
 * renamed Middleware to Proxy; the functionality is identical but the old
 * filename is no longer picked up. Do not "fix" this back to middleware.ts.
 *
 * Supabase auth tokens expire; without a refresh on each request, Server
 * Components would intermittently see a logged-in user as logged out. This
 * reads the session and writes any rotated cookies onto the outgoing response.
 *
 * Per the Next docs, Proxy is explicitly *not* a full authorization layer —
 * it's an optimistic check. Real enforcement lives in RLS policies on the
 * database and in per-route checks, never here alone.
 */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  // Without configuration the app should still boot and render; auth simply
  // stays inert until the keys are supplied.
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return response;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Must be getUser(), not getSession(). getSession() trusts the cookie
  // contents as-is; getUser() revalidates the token against Supabase, which is
  // the only version safe to make decisions on.
  await supabase.auth.getUser();

  return response;
}

export const config = {
  // Skip static assets and image optimisation — refreshing a session for a
  // favicon request is pure overhead.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff2?)$).*)",
  ],
};
