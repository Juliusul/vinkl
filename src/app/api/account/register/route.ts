import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { resend } from "@/lib/email/resend";
import { REPLY_TO_EMAIL, senderAddress } from "@/lib/email/domain";
import { AccountConfirmationEmail } from "@/lib/email/templates/account-confirmation";
import { getTemplateSettings } from "@/lib/supabase/settings";
import { render as renderEmail } from "@react-email/components";
import React from "react";

export const runtime = "nodejs";

/**
 * Server-side account creation + confirmation email.
 *
 * We deliberately do NOT use the client-side supabase.auth.signUp() +
 * Supabase's own auto-dispatched confirmation mail. That mail is built
 * from GoTrue's default template ({{ .ConfirmationURL }}), which links
 * to Supabase's own /verify endpoint and redirects back with session
 * tokens in the URL FRAGMENT — but src/app/auth/confirm/route.ts (our
 * PKCE-style callback) reads token_hash/type from the QUERY STRING,
 * which fragments never reach (browsers never send them to the server).
 * That combination 404'd every real confirmation link.
 *
 * Instead: admin.generateLink() creates the (unconfirmed) user AND
 * returns hashed_token without sending anything, so we build our own
 * query-string link and send our own branded mail via Resend — same
 * pipeline as every other transactional email in this app.
 */
export async function POST(req: NextRequest) {
  const { name, email, password, locale } = await req.json();

  if (!email || !password || typeof password !== "string" || password.length < 8) {
    return NextResponse.json({ error: "E-Mail und ein Passwort mit mindestens 8 Zeichen sind erforderlich." }, { status: 400 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vinkl-design.de";
  const loc = locale === "en" ? "en" : "de";

  const { data, error } = await supabaseAdmin.auth.admin.generateLink({
    type: "signup",
    email,
    password,
    options: { data: { name: name ?? "" } },
  });

  if (error) {
    if (error.code === "email_exists") {
      return NextResponse.json({ error: "Für diese E-Mail existiert bereits ein Konto. Bitte melde dich an." }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const confirmUrl = `${siteUrl}/auth/confirm?token_hash=${data.properties.hashed_token}&type=signup&next=/${loc}/account/orders`;
  const firstName = (name ?? "").split(" ")[0] ?? "";

  try {
    const settings = await getTemplateSettings();
    const html = await renderEmail(
      React.createElement(AccountConfirmationEmail, {
        firstName,
        confirmUrl,
        emailConfirmHeading: settings.email_confirm_heading,
        emailConfirmBody: settings.email_confirm_body,
        emailFooter: settings.email_footer,
      })
    );
    await resend.emails.send({
      from: senderAddress("konto"),
      replyTo: REPLY_TO_EMAIL,
      to: email,
      subject: "Bestätige dein VINKL-Konto",
      html,
    });
  } catch (err) {
    console.error("Account confirmation email error:", err);
    // Das Konto existiert bereits (unbestätigt) — der Kunde kann die
    // Bestätigung im Checkout/Login erneut anstoßen. Kein 500 hier,
    // sonst denkt der Client, die Registrierung sei fehlgeschlagen.
  }

  return NextResponse.json({ success: true, userId: data.user?.id ?? null });
}
