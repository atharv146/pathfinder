/**
 * Credential validation, shared by the signup form and any server action.
 *
 * Rules agreed with the user: at least 8 characters, containing both letters
 * and at least one number. (The original ask was 6; 8 is the widely-accepted
 * modern floor and length matters far more than composition, so it was raised
 * with their agreement.)
 *
 * These run client-side for fast feedback. Supabase enforces its own minimum
 * server-side too — client validation is UX, never security.
 */

export type PasswordCheck = {
  ok: boolean;
  /** Every rule, so the UI can show a live checklist rather than one error. */
  rules: { label: string; met: boolean }[];
};

export function checkPassword(pw: string): PasswordCheck {
  const rules = [
    { label: "At least 8 characters", met: pw.length >= 8 },
    { label: "Contains a letter", met: /[a-zA-Z]/.test(pw) },
    { label: "Contains a number", met: /[0-9]/.test(pw) },
  ];
  return { ok: rules.every((r) => r.met), rules };
}

/**
 * Deliberately permissive: this only catches obvious typos like a missing `@`
 * or a trailing space. Strict email regexes reject valid addresses, and the
 * only real proof an address works is the verification email.
 */
export function isValidEmail(email: string) {
  const trimmed = email.trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
}

/** Maps Supabase's raw auth errors to something a student can act on. */
export function friendlyAuthError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("already registered") || m.includes("already been registered"))
    return "That email already has an account. Try signing in instead.";
  if (m.includes("invalid login credentials"))
    return "That email and password don't match. Check both and try again.";
  if (m.includes("email not confirmed"))
    return "Check your email and click the confirmation link first.";
  if (m.includes("rate limit") || m.includes("too many"))
    return "Too many attempts. Wait a minute, then try again.";
  return message;
}
