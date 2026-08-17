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
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  // The landing page and the auth screens themselves stay open to everyone.
  // Deliberate funnel choice: a visitor should be able to see what PathFinder
  // is before being asked for anything. The ask happens on the first click
  // *into* the product, not on arrival.
  // `/guide` is deliberately public: it's the parent-facing explainer content,
  // and for an immigrant-family audience, forcing a signup before anyone can
  // read a word about how U.S. admissions works costs more trust than the
  // captured emails are worth. The roadmap (the actual tool) stays gated.
  const isPublic =
    path === "/" ||
    path === "/login" ||
    path === "/signup" ||
    path === "/guide" ||
    path.startsWith("/guide/") ||
    // Shared counselor links. Public by necessity — the recipient has no
    // account. The token plus the narrow SECURITY DEFINER function in
    // migration 0007 is the security boundary, not the session.
    path.startsWith("/s/") ||
    path.startsWith("/auth");

  // API routes authenticate themselves and answer with a JSON status code.
  // Redirecting them would hand a `fetch()` caller a 307 to an HTML signup
  // page, which then fails to parse as JSON and surfaces to the user as a
  // generic "something went wrong" instead of "please sign in". Status codes
  // are for APIs; redirects are for pages. Every route under /api/ starts by
  // verifying the session itself, so this is not a hole.
  const isApi = path.startsWith("/api/");

  // Local-dev-only bypass: skip the gate entirely when running `next dev`.
  //
  // WHY THIS IS SAFE TO LEAVE IN: it keys off `NODE_ENV === "development"`,
  // which `next dev` sets automatically and which a Vercel deployment (which
  // always runs a production build, for both the Production and Preview
  // environments) can never produce. There is no env var to forget to unset —
  // the gate is architecturally off in every deployed context, not just
  // configured off.
  //
  // WHY IT EXISTS: Google sign-in on localhost silently bounces to the
  // production Site URL, because Supabase's allowed redirect list and the
  // Google Cloud OAuth client are configured for the production origin only —
  // that's a dashboard setting, not something a code change can fix, and it
  // would need `http://localhost:3000/auth/callback` added on both sides to
  // work. Rather than block local UI review on that, unauthenticated requests
  // just pass through in dev. Client components still call
  // `supabase.auth.getUser()` and correctly see no user, so this shows the
  // signed-out/no-profile state of gated pages — real login is still the only
  // way to review a personalized view locally.
  const devBypass = process.env.NODE_ENV === "development";

  if (!user && !isPublic && !isApi && !devBypass) {
    const url = request.nextUrl.clone();
    url.pathname = "/signup";
    // Remember where they were headed so they land there after signing up
    // instead of being dumped back on the homepage.
    url.searchParams.set("next", path);
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  // Skip static assets and image optimisation — refreshing a session for a
  // favicon request is pure overhead.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff2?)$).*)",
  ],
};
