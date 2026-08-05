import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { sendReturnInstructions, isWithinReturnWindow } from "@/lib/orders/send-return-instructions";

export const runtime = "nodejs";

const COOLDOWN_MS = 10 * 60 * 1000; // 10 Minuten zwischen wiederholten Anfragen

/**
 * Public, unauthenticated: lets a guest (no account) request a return by
 * order number + email — the only two facts they're guaranteed to have.
 * Requiring BOTH prevents someone who merely sees an order number (e.g.
 * on a discarded shipping label) from triggering actions on someone
 * else's order.
 *
 * On match, this is a full self-serve Widerruf: the checkbox confirmation
 * IS the required unambiguous withdrawal statement (§ 355 BGB doesn't
 * mandate a specific form), and the return address goes out immediately —
 * no admin step. Whether the order is still within the nominal 14-day
 * window is logged for the admin's later refund decision, not enforced
 * here: telling someone the address is reversible, promising a refund
 * isn't.
 */
export async function POST(req: NextRequest) {
  const { orderNumber, email, confirmWithdrawal } = await req.json();

  if (!orderNumber || !email || confirmWithdrawal !== true) {
    return NextResponse.json({ error: "Bitte fülle alle Felder aus und bestätige den Widerruf." }, { status: 400 });
  }

  const { data: order } = await supabaseAdmin
    .from("orders")
    .select("*")
    .ilike("invoice_number", String(orderNumber).trim())
    .ilike("customer_email", String(email).trim())
    .maybeSingle();

  // Same generic message whether the order or the email didn't match —
  // don't hint at which one was wrong.
  if (!order) {
    return NextResponse.json(
      { error: "Bestellnummer und E-Mail-Adresse passen nicht zusammen. Bitte prüfe deine Bestellbestätigung." },
      { status: 404 }
    );
  }

  // Cooldown against repeat clicks / spam, based on the last request for
  // THIS order — cheap to check, no extra schema needed.
  const { data: recent } = await supabaseAdmin
    .from("order_events")
    .select("created_at")
    .eq("order_id", order.id)
    .eq("event_type", "return_requested")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (recent && Date.now() - new Date(recent.created_at).getTime() < COOLDOWN_MS) {
    return NextResponse.json({ success: true }); // schon unterwegs — wirkt wie Erfolg, kein erneuter Versand
  }

  const result = await sendReturnInstructions(order);
  if (!result.ok) {
    // Interna (z.B. "Adresse nicht konfiguriert") nicht an anonyme
    // Anfragende durchreichen — nur intern loggen.
    console.error("Return-instructions send failed:", result.error);
    return NextResponse.json(
      { error: "Das hat leider nicht geklappt. Bitte schreib uns direkt an hallo@vinkl-design.de." },
      { status: 500 }
    );
  }

  const withinWindow = await isWithinReturnWindow(order);
  await supabaseAdmin.from("order_events").insert({
    order_id: order.id,
    event_type: "return_requested",
    data: { within_window: withinWindow },
    created_by: order.customer_email,
  });

  return NextResponse.json({ success: true });
}
