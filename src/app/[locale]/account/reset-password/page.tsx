import { setRequestLocale } from "next-intl/server";
import { ResetPasswordForm } from "@/components/account/reset-password-form";

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function ResetPasswordPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <section style={{ fontFamily: "Georgia, serif", padding: "64px 24px", maxWidth: 440, margin: "0 auto" }}>
      <p style={{ fontSize: 11, letterSpacing: 3, color: "#888", textTransform: "uppercase", margin: "0 0 8px" }}>
        KONTO
      </p>
      <h1 style={{ fontSize: 28, fontWeight: 400, color: "#1a1a1a", margin: "0 0 8px" }}>
        Neues Passwort
      </h1>
      <p style={{ fontSize: 14, color: "#666", lineHeight: 1.6, margin: "0 0 32px" }}>
        Wähle ein neues Passwort für dein Konto.
      </p>
      <ResetPasswordForm locale={locale} />
    </section>
  );
}
