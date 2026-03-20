import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Supabase PKCE Auth Callback
 * Handles: email confirmation, password reset, magic links.
 * Supabase redirects to /auth/confirm?token_hash=...&type=...&next=...
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as
    | "signup"
    | "recovery"
    | "email_change"
    | null;
  const next = searchParams.get("next") ?? "/de/account/orders";

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  if (token_hash && type) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.verifyOtp({ token_hash, type });

    if (!error) {
      return NextResponse.redirect(`${siteUrl}${next}`);
    }
  }

  // Error: redirect to login with message
  return NextResponse.redirect(
    `${siteUrl}/de/account/login?error=link_ungueltig`
  );
}
