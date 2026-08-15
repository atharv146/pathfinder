import { NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

/**
 * Full account deletion.
 *
 * Removing a row from auth.users requires the service-role key, which bypasses
 * RLS entirely and therefore may only ever exist server-side. It is read from
 * SUPABASE_SERVICE_ROLE_KEY — deliberately NOT prefixed NEXT_PUBLIC_, because
 * that prefix is what ships a value to the browser. If this key ever appears
 * in client code, anyone can read or delete every student's data.
 *
 * SECURITY: the user id is taken from the verified session, never from the
 * request body. Accepting an id from the caller would let any signed-in
 * student delete any other student's account by editing one JSON field —
 * the classic IDOR. There is intentionally no parameter to pass here.
 */
export async function POST() {
  const supabase = await createServerClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!serviceKey || !url) {
    // Explicit rather than a generic 500: this is a deployment config gap, and
    // the person hitting it needs to know it isn't their fault.
    return NextResponse.json(
      {
        error:
          "Account deletion isn't configured on the server yet. Your data was not changed.",
      },
      { status: 501 }
    );
  }

  const admin = createAdminClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // Application rows first. The FKs in migration 0001 cascade from auth.users,
  // but deleting explicitly means a failure surfaces here rather than leaving
  // orphaned rows behind if the cascade is ever altered.
  const cleanup = await Promise.all([
    admin.from("activities").delete().eq("user_id", user.id),
    admin.from("roadmap_progress").delete().eq("user_id", user.id),
    admin.from("profiles").delete().eq("id", user.id),
  ]);

  const cleanupError = cleanup.find((r) => r.error)?.error;
  if (cleanupError) {
    return NextResponse.json(
      { error: `Couldn't remove your data: ${cleanupError.message}` },
      { status: 500 }
    );
  }

  const { error: deleteError } = await admin.auth.admin.deleteUser(user.id);
  if (deleteError) {
    return NextResponse.json(
      { error: `Couldn't remove your login: ${deleteError.message}` },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
