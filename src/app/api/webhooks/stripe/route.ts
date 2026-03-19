import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/client";
import { generateInvoicePdf } from "@/lib/invoice/generate";
import { resend } from "@/lib/email/resend";
import { OrderConfirmationEmail } from "@/lib/email/templates/order-confirmation";
import { OrderNotificationEmail } from "@/lib/email/templates/order-notification";
import { generateInvoiceNumber } from "@/lib/invoice/number";
import { render as renderEmail } from "@react-email/components";
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

  if (event.type === "checkout.session.completed") {
    const session = await stripe.checkout.sessions.retrieve(event.data.object.id, {
      expand: ["line_items"],
    });

    const customerEmail = session.customer_details?.email;
    const customerName = session.customer_details?.name ?? "Kunde";
    const invoiceNumber = generateInvoiceNumber(session.id, session.created);
    const ownerEmail = process.env.OWNER_EMAIL!;
    const accountingEmail = process.env.ACCOUNTING_EMAIL ?? ownerEmail;

    try {
      // Generate PDF invoice
      const pdfBuffer = await generateInvoicePdf(session);
      const pdfBase64 = pdfBuffer.toString("base64");

      // Email to customer (with invoice PDF)
      if (customerEmail) {
        const html = await renderEmail(
          React.createElement(OrderConfirmationEmail, { session })
        );
        await resend.emails.send({
          from: `VINKL <bestellungen@${getEmailDomain()}>`,
          to: customerEmail,
          subject: `Deine VINKL Bestellung ${invoiceNumber}`,
          html,
          attachments: [
            {
              filename: `Rechnung-${invoiceNumber}.pdf`,
              content: pdfBase64,
            },
          ],
        });
      }

      // Notification to owner + accounting (with invoice PDF)
      const notifHtml = await renderEmail(
        React.createElement(OrderNotificationEmail, { session })
      );
      const recipients = [...new Set([ownerEmail, accountingEmail])];
      await resend.emails.send({
        from: `VINKL Shop <bestellungen@${getEmailDomain()}>`,
        to: recipients,
        subject: `Neue Bestellung ${invoiceNumber} — ${customerName}`,
        html: notifHtml,
        attachments: [
          {
            filename: `Rechnung-${invoiceNumber}.pdf`,
            content: pdfBase64,
          },
        ],
      });
    } catch (err) {
      console.error("Email/PDF error:", err);
      // Don't return 500 — Stripe would retry. Log and continue.
    }
  }

  return NextResponse.json({ received: true });
}

function getEmailDomain(): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "localhost:3000";
  try {
    return new URL(siteUrl).hostname;
  } catch {
    return "vinkl.de";
  }
}
