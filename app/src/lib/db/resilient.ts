/**
 * Surviving a migration that hasn't been run yet.
 *
 * This exists because it has now happened twice, and both times a missing
 * column took down a working feature in a way that looked like a code bug:
 *
 *   • migration 0004 not run → `target_colleges` undefined → the whole
 *     account page crashed on `.length`.
 *   • migration 0005 not run → `chat_messages.kind` missing → every chat
 *     insert and every history read failed, so Ask AI looked completely
 *     broken while the model and the key were both fine.
 *
 * Migrations are applied by hand in the Supabase dashboard, so "someone
 * forgot one" is a normal operating state, not an exceptional one — and it can
 * differ between local and production. A feature degrading (no history, no
 * kind separation) is acceptable; a feature dying is not.
 *
 * These helpers retry once without the newer column when Postgres says the
 * column doesn't exist. They deliberately do NOT swallow other errors.
 */

/** Postgres undefined_column, plus the PostgREST schema-cache equivalent. */
export function isMissingColumn(error: unknown): boolean {
  const e = error as { code?: string; message?: string } | null;
  if (!e) return false;
  if (e.code === "42703") return true;
  return /column .* does not exist|could not find the '.*' column/i.test(
    e.message ?? ""
  );
}

/**
 * Run `withColumn`; if it fails only because the column is missing, run
 * `without`. Returns the payload of whichever succeeded.
 */
export async function tolerateMissingColumn<T>(
  withColumn: () => PromiseLike<{ data: T; error: unknown }>,
  without: () => PromiseLike<{ data: T; error: unknown }>
): Promise<{ data: T; error: unknown; degraded: boolean }> {
  const first = await withColumn();
  if (!first.error) return { ...first, degraded: false };
  if (!isMissingColumn(first.error)) return { ...first, degraded: false };

  const second = await without();
  return { ...second, degraded: true };
}
