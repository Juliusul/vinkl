import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import { EmbeddedCheckoutForm } from "@/components/checkout/embedded-checkout";
import Link from "next/link";

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ quantity?: string }>;
}

export default async function CheckoutPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { quantity: qStr } = await searchParams;
  setRequestLocale(locale);

  const quantity = Math.max(1, parseInt(qStr ?? "1") || 1);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f5f0ea",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Minimal header */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 32px",
          borderBottom: "1px solid #e0d8d0",
          backgroundColor: "#fff",
        }}
      >
        <Link
          href={`/${locale}`}
          style={{
            fontSize: 13,
            letterSpacing: "0.2em",
            color: "#1a1a1a",
            textDecoration: "none",
            fontWeight: 500,
            textTransform: "uppercase",
          }}
        >
          <span style={{ color: "#c0856a" }}>V</span>INKL
        </Link>
        <span
          style={{
            fontSize: 11,
            letterSpacing: "0.15em",
            color: "#888",
            textTransform: "uppercase",
          }}
        >
          Sichere Zahlung
        </span>
      </header>

      {/* Stripe Embedded Checkout */}
      <div style={{ flex: 1, padding: "40px 16px" }}>
        <Suspense
          fallback={
            <div
              style={{
                textAlign: "center",
                padding: "80px 0",
                color: "#888",
                fontSize: 13,
                letterSpacing: "0.1em",
              }}
            >
              Wird geladen…
            </div>
          }
        >
          <EmbeddedCheckoutForm quantity={quantity} locale={locale} />
        </Suspense>
      </div>
    </div>
  );
}
