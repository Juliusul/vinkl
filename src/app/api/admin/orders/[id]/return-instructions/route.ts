import { isAdminEmail } from "@/lib/admin-auth";
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { sendReturnInstructions } from "@/lib/orders/send-return-instructions";

export const runtime = "nodejs";

/**
 * Manually triggered by admin once a customer asks to return an order.
 * Sends the return address up front — there's no self-service return
 * request flow yet, and the refund-notification email fires too late
 * (only after the item is already back) to serve as return instructions.
 */
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdminEmail(user.email)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { data: order } = await supabaseAdmin.from("orders").select("*").eq("id", id).single();
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  const result = await sendReturnInstructions(order);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  await supabaseAdmin.from("order_events").insert({
    order_id: id,
    event_type: "return_instructions_sent",
    data: {},
    created_by: user.email ?? "admin",
  });

  return NextResponse.json({ success: true });
}
