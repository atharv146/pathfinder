import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * OAuth + email-confirmation landing point.
 *
 * Supabase redirects here with a short-lived `code`, which we exchange for a
 * session cookie. This must be a Route Handler rather than a page — the
 * exchange writes cookies, which a Server Component cannot do.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const redirectTo = searchParams.get("next") ?? "/";

  // Supabase reports provider-side failures (user hit "cancel", etc.) here.
  const error = searchParams.get("error_description") ?? searchParams.get("error");
  if (error) {
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(error)}`
    );
  }

  if (code) {
    const supabase = await createClient();
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    if (!exchangeError) {
      // Only allow relative paths — an open redirect here would let a crafted
      // link bounce a freshly-authenticated user to an attacker's page.
      const safeNext = redirectTo.startsWith("/") ? redirectTo : "/";

      // First-time users go through onboarding before anything else, carrying
      // their original destination so it still resolves afterwards. Checked
      // here rather than in proxy.ts so it costs one query at sign-in instead
      // of a profile lookup on every single request.
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("onboarded_at")
          .eq("id", user.id)
          .maybeSingle();

        if (!profile?.onboarded_at) {
          return NextResponse.redirect(
            `${origin}/onboarding?next=${encodeURIComponent(safeNext)}`
          );
        }
      }

      return NextResponse.redirect(`${origin}${safeNext}`);
    }
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(exchangeError.message)}`
    );
  }

  return NextResponse.redirect(`${origin}/login?error=Missing%20auth%20code`);
}
