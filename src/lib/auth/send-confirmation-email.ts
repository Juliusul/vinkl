import { supabaseAdmin } from "@/lib/supabase/admin";
import { resend } from "@/lib/email/resend";
import { REPLY_TO_EMAIL, senderAddress } from "@/lib/email/domain";
import { AccountConfirmationEmail } from "@/lib/email/templates/account-confirmation";
import { getTemplateSettings } from "@/lib/supabase/settings";
import { render as renderEmail } from "@react-email/components";
import React from "react";

/**
 * Creates (or, for an already-unconfirmed account, re-issues) a signup
 * confirmation and sends our own branded mail via Resend.
 *
 * Never uses Supabase's built-in auto-dispatch (client signUp() /
 * auth.resend()) — that sends GoTrue's default template, which links to
 * /verify and redirects back with tokens in a URL fragment our own
 * src/app/auth/confirm/route.ts (a query-string token_hash reader) can
 * never see. See account-confirmation.tsx / api/account/register for
 * the full story.
 */
export async function sendConfirmationEmail(
  email: string,
  opts: { name?: string; password?: string; locale?: "de" | "en" } = {}
): Promise<{ ok: true; userId: string } | { ok: false; status: number; error: string }> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vinkl-design.de";
  const loc = opts.locale === "en" ? "en" : "de";

  // generateLink requires a password only when it's also creating the
  // user (first-time signup). Re-issuing a link for an existing
  // unconfirmed user works without one.
  const { data, error } = await supabaseAdmin.auth.admin.generateLink({
    type: "signup",
    email,
    password: opts.password ?? crypto.randomUUID(),
    options: opts.name !== undefined ? { data: { name: opts.name } } : {},
  });

  if (error) {
    if (error.code === "email_exists") {
      return { ok: false, status: 409, error: "Für diese E-Mail existiert bereits ein bestätigtes Konto." };
    }
    return { ok: false, status: 400, error: error.message };
  }

  const confirmUrl = `${siteUrl}/auth/confirm?token_hash=${data.properties.hashed_token}&type=signup&next=/${loc}/account/orders`;
  const firstName = (opts.name ?? data.user?.user_metadata?.name ?? "").split(" ")[0] ?? "";

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

  return { ok: true, userId: data.user?.id ?? "" };
}
