import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { stripe } from "@/lib/stripe/client";
import { generateInvoicePdfFromPaymentIntent } from "@/lib/invoice/generate";
import { generateInvoiceNumber } from "@/lib/invoice/number";
import { getTemplateSettings } from "@/lib/supabase/settings";
import { resend } from "@/lib/email/resend";
import { OrderConfirmationEmail } from "@/lib/email/templates/order-confirmation";
import { render as renderEmail } from "@react-email/components";
import React from "react";

export const runtime = "nodejs";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { data: order } = await supabaseAdmin.from("orders").select("*").eq("id", id).single();
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  // stripe_session_id now stores the payment_intent id
  const pi = await stripe.paymentIntents.retrieve(order.stripe_session_id);
  const invoiceNumber = order.invoice_number ?? generateInvoiceNumber(pi.id, pi.created);
  const settings = await getTemplateSettings();
  const pdfBuffer = await generateInvoicePdfFromPaymentIntent(pi, invoiceNumber);
  const pdfBase64 = pdfBuffer.toString("base64");

  const html = await renderEmail(React.createElement(OrderConfirmationEmail, {
    paymentIntent: pi,
    invoiceNumber,
    emailGreeting: settings.email_greeting,
    emailFooter: settings.email_footer,
  }));

  const domain = (() => { try { return new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "").hostname; } catch { return "vinkl.de"; } })();
  await resend.emails.send({
    from: `VINKL <bestellungen@${domain}>`,
    to: order.customer_email,
    subject: `Deine VINKL Bestellung ${invoiceNumber} (erneut gesendet)`,
    html,
    attachments: [{ filename: `Rechnung-${invoiceNumber}.pdf`, content: pdfBase64 }],
  });

  await supabaseAdmin.from("order_events").insert({
    order_id: id,
    event_type: "email_resent",
    data: { to: order.customer_email },
    created_by: user.email ?? "admin",
  });

  return NextResponse.json({ success: true });
}
