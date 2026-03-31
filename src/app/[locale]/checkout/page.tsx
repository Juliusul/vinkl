import { setRequestLocale } from "next-intl/server";
import { CheckoutForm } from "@/components/checkout/checkout-form";
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
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f0ea" }}>
      {/* Minimal header */}
      <header style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "18px 32px", borderBottom: "1px solid #e0d8d0", backgroundColor: "#fff",
      }}>
        <Link href={`/${locale}`} style={{ fontSize: 13, letterSpacing: "0.2em", color: "#1a1a1a", textDecoration: "none", fontWeight: 500, textTransform: "uppercase" }}>
          <span style={{ color: "#c0856a" }}>V</span>INKL
        </Link>
        <span style={{ fontSize: 10, letterSpacing: "0.15em", color: "#aaa", textTransform: "uppercase", fontFamily: "monospace" }}>
          Sichere Zahlung
        </span>
      </header>

      <CheckoutForm quantity={quantity} locale={locale} siteUrl={siteUrl} />
    </div>
  );
}
