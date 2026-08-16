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
    path.startsWith("/auth");

  // API routes authenticate themselves and answer with a JSON status code.
  // Redirecting them would hand a `fetch()` caller a 307 to an HTML signup
  // page, which then fails to parse as JSON and surfaces to the user as a
  // generic "something went wrong" instead of "please sign in". Status codes
  // are for APIs; redirects are for pages. Every route under /api/ starts by
  // verifying the session itself, so this is not a hole.
  const isApi = path.startsWith("/api/");

  if (!user && !isPublic && !isApi) {
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
