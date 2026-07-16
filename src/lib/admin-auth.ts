/**
 * Admin authorization — a Supabase login alone is NOT admin access.
 *
 * Customer accounts use the same Supabase auth pool, so every admin
 * surface must additionally check the email against this allowlist.
 * Configure via ADMIN_EMAILS (comma-separated); OWNER_EMAIL and the
 * brand contact address are always included as a safe default.
 */
export function adminEmails(): string[] {
  const configured = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  const defaults = [
    process.env.OWNER_EMAIL?.trim().toLowerCase() ?? "",
    "hallo@vinkl-design.de",
  ].filter(Boolean);

  return [...new Set([...configured, ...defaults])];
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return adminEmails().includes(email.trim().toLowerCase());
}
