import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/client";

export async function POST(req: NextRequest) {
  try {
    const { quantity, locale } = await req.json();
    const qty = Math.max(1, parseInt(quantity) || 1);

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID!,
          quantity: qty,
        },
      ],
      success_url: `${baseUrl}/${locale}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/${locale}`,
      shipping_address_collection: {
        allowed_countries: ["DE", "AT", "CH", "LU", "BE", "NL"],
      },
      phone_number_collection: { enabled: false },
      locale: locale === "de" ? "de" : "auto",
      metadata: { quantity: String(qty), locale: locale ?? "de" },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}
