import { isAdminEmail } from "@/lib/admin-auth";
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { stripe } from "@/lib/stripe/client";
import { resend } from "@/lib/email/resend";
import { REPLY_TO_EMAIL, senderAddress } from "@/lib/email/domain";
import { RefundNotificationEmail } from "@/lib/email/templates/refund-notification";
import { getTemplateSettings } from "@/lib/supabase/settings";
import { render as renderEmail } from "@react-email/components";
import React from "react";

export const runtime = "nodejs";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdminEmail(user.email)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { amount, reason } = await req.json(); // amount in Cent (optional = full refund)

  const { data: order } = await supabaseAdmin.from("orders").select("*").eq("id", id).single();
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  // stripe_session_id stores the PaymentIntent id (checkout uses Stripe
  // Elements + PaymentIntents directly, not Checkout Sessions — see
  // resend-email/route.ts). Retrieving it via checkout.sessions.retrieve()
  // threw a Stripe "resource_missing" error for every refund attempt.
  const refund = await stripe.refunds.create({
    payment_intent: order.stripe_session_id,
    ...(amount ? { amount } : {}),
    reason: reason === "duplicate" ? "duplicate" : reason === "fraudulent" ? "fraudulent" : "requested_by_customer",
  });

  const { error: updateError } = await supabaseAdmin.from("orders").update({
    status: "refunded",
    refund_amount: refund.amount,
    stripe_refund_id: refund.id,
    refunded_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }).eq("id", id);
  // Das Geld ist bei diesem Punkt bereits bei Stripe erstattet — ein
  // fehlgeschlagenes DB-Update darf trotzdem nicht unbemerkt bleiben,
  // sonst zeigt der Admin weiterhin den alten Status.
  if (updateError) {
    return NextResponse.json({ error: `Stripe-Erstattung war erfolgreich (${refund.id}), aber die Bestellung konnte nicht aktualisiert werden: ${updateError.message}` }, { status: 500 });
  }

  await supabaseAdmin.from("order_events").insert({
    order_id: id,
    event_type: "refunded",
    data: { refund_id: refund.id, amount: refund.amount, reason },
    created_by: user.email ?? "admin",
  });

  // Kunde bekam bisher NIE eine Bestätigung, dass die Erstattung
  // ausgelöst wurde, obwohl die Vorlage dafür schon existierte.
  try {
    const settings = await getTemplateSettings();
    const html = await renderEmail(
      React.createElement(RefundNotificationEmail, {
        customerName: order.customer_name ?? order.customer_email,
        invoiceNumber: order.invoice_number,
        refundAmount: refund.amount / 100,
        currency: (refund.currency ?? order.currency ?? "eur").toUpperCase(),
        emailFooter: settings.email_footer,
      })
    );
    await resend.emails.send({
      from: senderAddress("bestellungen"),
      replyTo: REPLY_TO_EMAIL,
      to: order.customer_email,
      subject: `Erstattung für Bestellung ${order.invoice_number}`,
      html,
    });
  } catch (err) {
    console.error("Refund notification email error:", err);
    // Erstattung ist bereits erfolgt — ein Mailfehler darf die
    // Admin-Aktion nicht als fehlgeschlagen melden.
  }

  return NextResponse.json({ success: true, refund_id: refund.id });
}
