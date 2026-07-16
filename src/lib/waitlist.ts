import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Waitlist double-opt-in helpers.
 *
 * The pending signup lives entirely inside a signed token — no
 * database row until the address is confirmed. The HMAC secret is the
 * Resend API key: server-only, long, and already required for the
 * feature to function at all.
 */

const AUDIENCE_NAME = "VINKL Warteliste";

function secret(): string {
  return process.env.RESEND_API_KEY ?? "missing-secret";
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isValidEmail(email: string): boolean {
  // Pragmatic check — the double-opt-in is the real validation.
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) && email.length <= 254;
}

export function waitlistToken(email: string, locale: string): string {
  return createHmac("sha256", secret())
    .update(`waitlist:${normalizeEmail(email)}:${locale}`)
    .digest("hex");
}

export function verifyWaitlistToken(
  email: string,
  locale: string,
  token: string,
): boolean {
  const expected = waitlistToken(email, locale);
  if (token.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(token, "utf8"), Buffer.from(expected, "utf8"));
}

export function emailDomain(): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vinkl.vercel.app";
  try {
    // Sender domains never carry a www — Resend verifies the apex.
    return new URL(siteUrl).hostname.replace(/^www\./, "");
  } catch {
    return "vinkl-design.de";
  }
}

/**
 * Sender address for waitlist mail. Resend only delivers from
 * verified domains — a *.vercel.app host can never be verified, so
 * fall back to Resend's onboarding sender until the real domain is
 * live and verified.
 */
export function waitlistSender(): string {
  const domain = emailDomain();
  if (domain.endsWith(".vercel.app") || domain === "localhost") {
    return "VINKL <onboarding@resend.dev>";
  }
  return `VINKL <warteliste@${domain}>`;
}

export function siteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "https://vinkl.vercel.app";
}

/**
 * Find or create the waitlist audience in Resend. Cached per runtime.
 */
let audienceIdCache: string | null = null;

export async function getWaitlistAudienceId(
  resend: import("resend").Resend,
): Promise<string> {
  if (audienceIdCache) return audienceIdCache;

  const list = await resend.audiences.list();
  const existing = list.data?.data?.find((a) => a.name === AUDIENCE_NAME);
  if (existing) {
    audienceIdCache = existing.id;
    return existing.id;
  }

  const created = await resend.audiences.create({ name: AUDIENCE_NAME });
  if (!created.data?.id) {
    throw new Error(`audience create failed: ${created.error?.message ?? "unknown"}`);
  }
  audienceIdCache = created.data.id;
  return created.data.id;
}
