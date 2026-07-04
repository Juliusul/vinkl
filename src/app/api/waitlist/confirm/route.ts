import { NextRequest, NextResponse } from "next/server";
import { resend } from "@/lib/email/resend";
import {
  getWaitlistAudienceId,
  isValidEmail,
  normalizeEmail,
  siteUrl,
  verifyWaitlistToken,
  waitlistSender,
} from "@/lib/waitlist";
import { routing } from "@/i18n/routing";

/**
 * GET /api/waitlist/confirm — step two of the double opt-in.
 * Verifies the signed token, stores the contact in the Resend
 * audience, notifies the owner, and lands the visitor back on the
 * homepage with a confirmation state.
 */
export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const email = normalizeEmail(params.get("email") ?? "");
  const localeParam = params.get("locale") ?? routing.defaultLocale;
  const locale = routing.locales.includes(localeParam as "de" | "en")
    ? localeParam
    : routing.defaultLocale;
  const token = params.get("token") ?? "";

  const redirect = (state: "confirmed" | "error") =>
    NextResponse.redirect(new URL(`/${locale}?waitlist=${state}`, siteUrl()));

  if (!isValidEmail(email) || !verifyWaitlistToken(email, locale, token)) {
    return redirect("error");
  }

  let stored = false;

  try {
    const audienceId = await getWaitlistAudienceId(resend);
    const result = await resend.contacts.create({
      audienceId,
      email,
      unsubscribed: false,
    });
    // An already-existing contact is a success for our purposes.
    stored = !result.error || /exists/i.test(result.error.message ?? "");
  } catch (err) {
    console.error("waitlist audience store failed:", err);
  }

  // Owner notification — best effort, also serves as a backup record.
  try {
    const owner = process.env.OWNER_EMAIL;
    if (owner) {
      await resend.emails.send({
        from: waitlistSender(),
        to: owner,
        subject: `Warteliste: ${email}`,
        text: `Neue bestätigte Eintragung auf der VINKL Warteliste:\n\n${email}\nSprache: ${locale}\nZeit: ${new Date().toISOString()}`,
      });
      stored = true;
    }
  } catch (err) {
    console.error("waitlist owner notification failed:", err);
  }

  return redirect(stored ? "confirmed" : "error");
}
