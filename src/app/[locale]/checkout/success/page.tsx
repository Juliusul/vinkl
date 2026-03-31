import { setRequestLocale } from "next-intl/server";
import { stripe } from "@/lib/stripe/client";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ClearCartOnSuccess } from "@/components/checkout/clear-cart-on-success";
import Link from "next/link";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ payment_intent?: string; payment_intent_client_secret?: string }>;
};

export default async function CheckoutSuccessPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { payment_intent } = await searchParams;
  setRequestLocale(locale);

  let customerName: string | null = null;
  let customerEmail: string | null = null;

  if (payment_intent) {
    try {
      const pi = await stripe.paymentIntents.retrieve(payment_intent);
      customerName = pi.shipping?.name ?? pi.metadata?.customer_name ?? null;
      customerEmail = pi.metadata?.customer_email ?? null;
    } catch {
      // PaymentIntent not found — show generic message
    }
  }

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isLoggedIn = !!user;
  const firstName = customerName?.split(" ")[0] ?? null;

  return (
    <>
      <ClearCartOnSuccess />
      <section style={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "64px 24px", backgroundColor: "#f5f0ea" }}>
        <div style={{ maxWidth: 480, textAlign: "center" }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", backgroundColor: "#2d7a2d", color: "#fff", fontSize: 22, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
            ✓
          </div>

          <p style={{ fontSize: 11, letterSpacing: 3, color: "#888", textTransform: "uppercase", margin: "0 0 8px" }}>
            BESTELLUNG BESTÄTIGT
          </p>

          <h1 style={{ fontFamily: "Georgia, serif", fontSize: 32, fontWeight: 400, margin: "0 0 24px", color: "#1a1a1a" }}>
            {firstName ? `Danke, ${firstName}!` : "Vielen Dank!"}
          </h1>

          <p style={{ fontSize: 15, color: "#666", lineHeight: 1.7, margin: "0 0 8px" }}>
            Deine Bestellung ist eingegangen.
          </p>

          {customerEmail && (
            <p style={{ fontSize: 14, color: "#888", lineHeight: 1.7, margin: "0 0 32px" }}>
              Wir haben dir eine Bestellbestätigung und Rechnung an{" "}
              <strong style={{ color: "#444" }}>{customerEmail}</strong> geschickt.
            </p>
          )}

          <Link
            href={`/${locale}`}
            style={{ display: "inline-block", backgroundColor: "#1a1a1a", color: "#fff", padding: "14px 32px", fontSize: 11, letterSpacing: 2, textDecoration: "none", textTransform: "uppercase" }}
          >
            Zurück zur Startseite
          </Link>

          {!isLoggedIn && customerEmail && (
            <div style={{ marginTop: 40, padding: "24px 28px", backgroundColor: "#fff", border: "1px solid #e0d8d0", textAlign: "left" }}>
              <p style={{ fontSize: 11, letterSpacing: 2, color: "#888", textTransform: "uppercase", margin: "0 0 8px" }}>
                BESTELLUNGEN VERFOLGEN
              </p>
              <p style={{ fontSize: 14, color: "#555", lineHeight: 1.6, margin: "0 0 16px" }}>
                Erstelle ein Konto, um deine Bestellhistorie einzusehen und Rechnungen jederzeit herunterzuladen.
              </p>
              <Link
                href={`/${locale}/account/register?email=${encodeURIComponent(customerEmail)}`}
                style={{ display: "inline-block", backgroundColor: "#f5f0ea", color: "#1a1a1a", padding: "10px 20px", fontSize: 11, letterSpacing: 1, textDecoration: "none", border: "1px solid #c8b89a" }}
              >
                KONTO ERSTELLEN
              </Link>
            </div>
          )}

          {isLoggedIn && (
            <div style={{ marginTop: 24 }}>
              <Link href={`/${locale}/account/orders`} style={{ fontSize: 12, color: "#888", textDecoration: "underline" }}>
                Meine Bestellungen ansehen →
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
