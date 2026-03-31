import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/client";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { generateInvoicePdfFromPaymentIntent } from "@/lib/invoice/generate";
import { resend } from "@/lib/email/resend";
import { OrderConfirmationEmail } from "@/lib/email/templates/order-confirmation";
import { OrderNotificationEmail } from "@/lib/email/templates/order-notification";
import { generateInvoiceNumber } from "@/lib/invoice/number";
import { getTemplateSettings } from "@/lib/supabase/settings";
import { render as renderEmail } from "@react-email/components";
import type Stripe from "stripe";
import React from "react";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature") ?? "";

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "payment_intent.succeeded") {
    const pi = event.data.object as Stripe.PaymentIntent;
    await handlePaymentIntent(pi);
  }

  return NextResponse.json({ received: true });
}

async function handlePaymentIntent(pi: Stripe.PaymentIntent) {
  const meta = pi.metadata ?? {};
  const customerEmail = meta.customer_email ?? "";
  const customerName = meta.customer_name ?? null;
  const invoiceNumber = generateInvoiceNumber(pi.id, pi.created);
  const ownerEmail = process.env.OWNER_EMAIL ?? "";
  const accountingEmail = process.env.ACCOUNTING_EMAIL ?? ownerEmail;

  const addr = pi.shipping?.address ?? null;
  const shippingAddress = addr ? {
    line1: addr.line1 ?? "",
    line2: addr.line2 ?? "",
    city: addr.city ?? "",
    postal_code: addr.postal_code ?? "",
    country: addr.country ?? "",
  } : null;

  // ── 1. Save order to Supabase ──
  try {
    const { data: orderData } = await supabaseAdmin
      .from("orders")
      .upsert({
        stripe_session_id: pi.id,   // payment intent id als unique key
        invoice_number: invoiceNumber,
        customer_email: customerEmail,
        customer_name: customerName,
        shipping_address: shippingAddress,
        amount_total: pi.amount ?? 0,
        currency: pi.currency ?? "eur",
        status: "paid",
        updated_at: new Date().toISOString(),
      }, { onConflict: "stripe_session_id" })
      .select("id")
      .single();

    if (orderData?.id) {
      const { data: userData } = await supabaseAdmin.auth.admin.listUsers();
      const matchingUser = userData?.users?.find(u => u.email === customerEmail);
      if (matchingUser) {
        await supabaseAdmin
          .from("orders")
          .update({ customer_id: matchingUser.id })
          .eq("id", orderData.id);
      }

      await supabaseAdmin.from("order_events").insert({
        order_id: orderData.id,
        event_type: "confirmed",
        data: { invoice_number: invoiceNumber },
        created_by: "system",
      });
    }
  } catch (err) {
    console.error("Supabase save error:", err);
  }

  // ── 2. Generate PDF + send emails ──
  try {
    const settings = await getTemplateSettings();
    const pdfBuffer = await generateInvoicePdfFromPaymentIntent(pi, invoiceNumber);
    const pdfBase64 = pdfBuffer.toString("base64");

    if (customerEmail) {
      const html = await renderEmail(
        React.createElement(OrderConfirmationEmail, {
          paymentIntent: pi,
          invoiceNumber,
          emailGreeting: settings.email_greeting,
          emailFooter: settings.email_footer,
        })
      );
      await resend.emails.send({
        from: `VINKL <bestellungen@${getEmailDomain()}>`,
        to: customerEmail,
        subject: `Deine VINKL Bestellung ${invoiceNumber}`,
        html,
        attachments: [{ filename: `Rechnung-${invoiceNumber}.pdf`, content: pdfBase64 }],
      });
    }

    if (ownerEmail) {
      const notifHtml = await renderEmail(
        React.createElement(OrderNotificationEmail, { paymentIntent: pi, invoiceNumber })
      );
      const recipients = [...new Set([ownerEmail, accountingEmail].filter(Boolean))];
      await resend.emails.send({
        from: `VINKL Shop <bestellungen@${getEmailDomain()}>`,
        to: recipients,
        subject: `Neue Bestellung ${invoiceNumber} — ${customerName ?? customerEmail}`,
        html: notifHtml,
        attachments: [{ filename: `Rechnung-${invoiceNumber}.pdf`, content: pdfBase64 }],
      });
    }
  } catch (err) {
    console.error("Email/PDF error:", err);
  }
}

function getEmailDomain(): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "localhost:3000";
  try { return new URL(siteUrl).hostname; } catch { return "vinkl.de"; }
}
