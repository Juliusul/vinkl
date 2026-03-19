import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

// Called after registration to link existing orders with matching email to the new user
export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: "email required" }, { status: 400 });

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Link all unlinked orders with matching email to this user
  await supabaseAdmin
    .from("orders")
    .update({ customer_id: user.id })
    .eq("customer_email", email)
    .is("customer_id", null);

  return NextResponse.json({ success: true });
}
