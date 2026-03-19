import { setRequestLocale } from "next-intl/server";
import { AccountRegisterForm } from "@/components/account/account-register-form";
import Link from "next/link";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ email?: string }>;
};

export default async function AccountRegisterPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { email } = await searchParams;
  setRequestLocale(locale);

  return (
    <div style={{ maxWidth: 400, margin: "0 auto" }}>
      <p style={{ fontSize: 11, letterSpacing: 3, color: "#888", textTransform: "uppercase", marginBottom: 8 }}>Konto</p>
      <h1 style={{ fontSize: 24, fontWeight: 400, margin: "0 0 8px" }}>Konto erstellen</h1>
      <p style={{ fontSize: 14, color: "#888", margin: "0 0 32px", fontFamily: "monospace" }}>
        Verfolge deine Bestellungen und lade Rechnungen herunter.
      </p>
      <AccountRegisterForm locale={locale} prefillEmail={email} />
      <p style={{ fontSize: 12, color: "#888", marginTop: 20, fontFamily: "monospace" }}>
        Bereits ein Konto?{" "}
        <Link href={`/${locale}/account/login`} style={{ color: "#1a1a1a" }}>Anmelden</Link>
      </p>
    </div>
  );
}
