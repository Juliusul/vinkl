import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/client";
import { resend } from "@/lib/email/resend";
import { REPLY_TO_EMAIL, senderAddress } from "@/lib/email/domain";
import { ShippingConfirmationEmail } from "@/lib/email/templates/shipping-confirmation";
import { render as renderEmail } from "@react-email/components";
import React from "react";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const { sessionId, trackingCode, trackingUrl, secret } = await req.json();

  if (secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!sessionId || !trackingCode) {
    return NextResponse.json({ error: "Missing sessionId or trackingCode" }, { status: 400 });
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId);

  const customerEmail = session.customer_details?.email;
  const customerName = session.customer_details?.name ?? "Kunde";

  if (!customerEmail) {
    return NextResponse.json({ error: "No customer email in session" }, { status: 400 });
  }

  // Mark as shipped in Stripe metadata
  await stripe.checkout.sessions.update(sessionId, {
    metadata: {
      ...session.metadata,
      shipped: "true",
      trackingCode,
      shippedAt: new Date().toISOString(),
    },
  });

  // Send shipping confirmation email
  const html = await renderEmail(
    React.createElement(ShippingConfirmationEmail, {
      customerName,
      trackingCode,
      trackingUrl,
    })
  );

  await resend.emails.send({
    from: senderAddress("versand"),
    replyTo: REPLY_TO_EMAIL,
    to: customerEmail,
    subject: "Dein VLip ist unterwegs",
    html,
  });

  return NextResponse.json({ success: true });
}
