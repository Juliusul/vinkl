import { NextRequest, NextResponse } from "next/server";
import { getTranslations } from "next-intl/server";
import { resend } from "@/lib/email/resend";
import { REPLY_TO_EMAIL } from "@/lib/email/domain";
import { WaitlistConfirmationEmail } from "@/lib/email/templates/waitlist-confirmation";
import {
  isValidEmail,
  normalizeEmail,
  siteUrl,
  waitlistSender,
  waitlistToken,
} from "@/lib/waitlist";
import { routing } from "@/i18n/routing";

/**
 * POST /api/waitlist — step one of the double opt-in.
 * Sends a confirmation link; no data is stored until it is clicked.
 */
export async function POST(req: NextRequest) {
  let body: { email?: string; locale?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const email = normalizeEmail(String(body.email ?? ""));
  const locale = routing.locales.includes(body.locale as "de" | "en")
    ? (body.locale as string)
    : routing.defaultLocale;

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const t = await getTranslations({ locale, namespace: "waitlist.email" });

  const token = waitlistToken(email, locale);
  const confirmUrl = `${siteUrl()}/api/waitlist/confirm?email=${encodeURIComponent(
    email,
  )}&locale=${locale}&token=${token}`;

  const { error } = await resend.emails.send({
    from: waitlistSender(),
    replyTo: REPLY_TO_EMAIL,
    to: email,
    subject: t("subject"),
    react: WaitlistConfirmationEmail({
      confirmUrl,
      preview: t("preview"),
      greeting: t("greeting"),
      body: t("body"),
      button: t("button"),
      ignore: t("ignore"),
    }),
  });

  if (error) {
    console.error("waitlist send failed:", error);
    return NextResponse.json({ error: "send_failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
