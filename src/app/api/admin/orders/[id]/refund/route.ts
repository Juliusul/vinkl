import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { stripe } from "@/lib/stripe/client";

export const runtime = "nodejs";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { amount, reason } = await req.json(); // amount in Cent (optional = full refund)

  const { data: order } = await supabaseAdmin.from("orders").select("*").eq("id", id).single();
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  // Get payment intent from Stripe session
  const session = await stripe.checkout.sessions.retrieve(order.stripe_session_id);
  if (!session.payment_intent) {
    return NextResponse.json({ error: "No payment intent found" }, { status: 400 });
  }

  const refund = await stripe.refunds.create({
    payment_intent: session.payment_intent as string,
    ...(amount ? { amount } : {}),
    reason: reason === "duplicate" ? "duplicate" : reason === "fraudulent" ? "fraudulent" : "requested_by_customer",
  });

  await supabaseAdmin.from("orders").update({
    status: "refunded",
    refund_amount: refund.amount,
    stripe_refund_id: refund.id,
    refunded_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }).eq("id", id);

  await supabaseAdmin.from("order_events").insert({
    order_id: id,
    event_type: "refunded",
    data: { refund_id: refund.id, amount: refund.amount, reason },
    created_by: user.email ?? "admin",
  });

  return NextResponse.json({ success: true, refund_id: refund.id });
}
