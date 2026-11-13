import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/client";
import { vinklProduct } from "@/data/products/vinkl";

export async function POST(req: NextRequest) {
  try {
    const { quantity, finishNatural, finishOiled, locale, name, email, address } = await req.json();
    const qty = Math.max(1, parseInt(quantity) || 1);

    // Finish breakdown (untreated/oiled teak) — human-readable for
    // the owner notification and the invoice line.
    const qtyNatural = Math.max(0, parseInt(finishNatural) || 0);
    const qtyOiled = Math.max(0, parseInt(finishOiled) || 0);
    const finishParts: string[] = [];
    if (qtyNatural > 0) finishParts.push(`Naturbelassen × ${qtyNatural}`);
    if (qtyOiled > 0) finishParts.push(`Geölt × ${qtyOiled}`);
    const finish = finishParts.join(" · ");

    // Single source of truth: the product data (EUR -> cents)
    const unitAmount = Math.round(parseFloat(vinklProduct.price.amount) * 100);
    const amount = unitAmount * qty;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "eur",
      automatic_payment_methods: { enabled: true },
      metadata: {
        quantity: String(qty),
        finish,
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
