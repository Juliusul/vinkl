/**
 * Sending domain — single source of truth.
 *
 * All transactional mail goes out from mail.vinkl-design.de, verified
 * in Resend (SPF/DKIM/DMARC on the subdomain, not the apex). This is
 * deliberately NOT derived from NEXT_PUBLIC_SITE_URL: the apex domain
 * (vinkl-design.de) carries the real hallo@ mailbox's own MX records,
 * and pointing sender infrastructure at it would collide with them.
 * A dedicated subdomain also keeps transactional/bulk sending
 * reputation isolated from that mailbox.
 *
 * Every customer-facing email should set replyTo to the real mailbox
 * (hallo@vinkl-design.de) so replies land where a human reads them.
 */
export const MAIL_DOMAIN =
  process.env.EMAIL_SEND_DOMAIN ?? "mail.vinkl-design.de";

export const REPLY_TO_EMAIL = "hallo@vinkl-design.de";

export function senderAddress(localPart: string, displayName = "VINKL"): string {
  return `${displayName} <${localPart}@${MAIL_DOMAIN}>`;
}
