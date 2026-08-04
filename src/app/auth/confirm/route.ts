import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

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
    const { data, error } = await supabase.auth.verifyOtp({ token_hash, type });

    if (!error) {
      // Link any guest orders placed under this email before the account
      // existed. Must happen here, not client-side after registration —
      // there is never a session to authenticate that call with until
      // this exact moment (accounts stay unconfirmed, sessionless, until
      // this link is clicked).
      if (type === "signup" && data.user?.email) {
        try {
          await supabaseAdmin
            .from("orders")
            .update({ customer_id: data.user.id })
            .eq("customer_email", data.user.email)
            .is("customer_id", null);
        } catch (err) {
          console.error("Order-linking on confirm failed:", err);
        }
      }
      return NextResponse.redirect(`${siteUrl}${next}`);
    }
  }

  // Error: redirect to login with message
  return NextResponse.redirect(
    `${siteUrl}/de/account/login?error=link_ungueltig`
  );
}
