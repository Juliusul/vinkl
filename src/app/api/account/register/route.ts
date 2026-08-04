import { NextRequest, NextResponse } from "next/server";
import { sendConfirmationEmail } from "@/lib/auth/send-confirmation-email";

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
 * See lib/auth/send-confirmation-email.ts for the replacement: our own
 * token_hash link + our own branded mail via Resend.
 */
export async function POST(req: NextRequest) {
  const { name, email, password, locale } = await req.json();

  if (!email || !password || typeof password !== "string" || password.length < 8) {
    return NextResponse.json({ error: "E-Mail und ein Passwort mit mindestens 8 Zeichen sind erforderlich." }, { status: 400 });
  }

  const result = await sendConfirmationEmail(email, { name, password, locale });
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json({ success: true, userId: result.userId });
}
