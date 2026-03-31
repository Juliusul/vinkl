import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/client";

export async function POST(req: NextRequest) {
  try {
    const { quantity, locale, name, email, address } = await req.json();
    const qty = Math.max(1, parseInt(quantity) || 1);

    // Preis: 299 EUR pro Stück
    const unitAmount = 29900;
    const amount = unitAmount * qty;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "eur",
      automatic_payment_methods: { enabled: true },
      metadata: {
        quantity: String(qty),
        locale: locale ?? "de",
        customer_name: name ?? "",
        customer_email: email ?? "",
        shipping_line1: address?.line1 ?? "",
        shipping_line2: address?.line2 ?? "",
        shipping_city: address?.city ?? "",
        shipping_postal_code: address?.postal_code ?? "",
        shipping_country: address?.country ?? "DE",
      },
      ...(email && {
        receipt_email: email,
      }),
      ...(name && address && {
        shipping: {
          name,
          address: {
            line1: address.line1 ?? "",
            line2: address.line2 ?? "",
            city: address.city ?? "",
            postal_code: address.postal_code ?? "",
            country: address.country ?? "DE",
          },
        },
      }),
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Checkout error:", message);
    return NextResponse.json({ error: "Checkout failed", detail: message }, { status: 500 });
  }
}
