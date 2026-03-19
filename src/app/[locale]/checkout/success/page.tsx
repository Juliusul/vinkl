import { setRequestLocale } from "next-intl/server";
import { stripe } from "@/lib/stripe/client";
import { ClearCartOnSuccess } from "@/components/checkout/clear-cart-on-success";
import Link from "next/link";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ session_id?: string }>;
};

export default async function CheckoutSuccessPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { session_id } = await searchParams;
  setRequestLocale(locale);

  let customerName: string | null = null;
  let customerEmail: string | null = null;

  if (session_id) {
    try {
      const session = await stripe.checkout.sessions.retrieve(session_id);
      customerName = session.customer_details?.name ?? null;
      customerEmail = session.customer_details?.email ?? null;
    } catch {
      // Session not found — show generic message
    }
  }

  const firstName = customerName?.split(" ")[0] ?? null;

  return (
    <>
      <ClearCartOnSuccess />
      <section
        style={{
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "64px 24px",
          backgroundColor: "#f5f0ea",
        }}
      >
        <div style={{ maxWidth: 480, textAlign: "center" }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              backgroundColor: "#2d7a2d",
              color: "#fff",
              fontSize: 22,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px",
            }}
          >
            ✓
          </div>

          <p style={{ fontSize: 11, letterSpacing: 3, color: "#888", textTransform: "uppercase", margin: "0 0 8px" }}>
            BESTELLUNG BESTÄTIGT
          </p>

          <h1
            style={{
              fontFamily: "Georgia, serif",
              fontSize: 32,
              fontWeight: 400,
              margin: "0 0 24px",
              color: "#1a1a1a",
            }}
          >
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
            style={{
              display: "inline-block",
              backgroundColor: "#1a1a1a",
              color: "#fff",
              padding: "14px 32px",
              fontSize: 11,
              letterSpacing: 2,
              textDecoration: "none",
              textTransform: "uppercase",
            }}
          >
            Zurück zur Startseite
          </Link>
        </div>
      </section>
    </>
  );
}
