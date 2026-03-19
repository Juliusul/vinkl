import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { type, notes } = await req.json(); // type: 'returned' | 'exchanged'
  const status = type === "exchanged" ? "exchanged" : "returned";

  await supabaseAdmin.from("orders").update({
    status,
    returned_at: new Date().toISOString(),
    admin_notes: notes ?? null,
    updated_at: new Date().toISOString(),
  }).eq("id", id);

  await supabaseAdmin.from("order_events").insert({
    order_id: id,
    event_type: status,
    data: { notes },
    created_by: user.email ?? "admin",
  });

  return NextResponse.json({ success: true });
}
