import { setRequestLocale } from "next-intl/server";
import { AccountLoginForm } from "@/components/account/account-login-form";
import Link from "next/link";

type Props = { params: Promise<{ locale: string }> };

export default async function AccountLoginPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div style={{ maxWidth: 400, margin: "0 auto" }}>
      <p style={{ fontSize: 11, letterSpacing: 3, color: "#888", textTransform: "uppercase", marginBottom: 8 }}>Konto</p>
      <h1 style={{ fontSize: 24, fontWeight: 400, margin: "0 0 32px" }}>Anmelden</h1>
      <AccountLoginForm locale={locale} />
      <p style={{ fontSize: 12, color: "#888", marginTop: 20, fontFamily: "monospace" }}>
        Noch kein Konto?{" "}
        <Link href={`/${locale}/account/register`} style={{ color: "#1a1a1a" }}>Registrieren</Link>
      </p>
    </div>
  );
}
