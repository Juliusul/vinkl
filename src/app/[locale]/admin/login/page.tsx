import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { setRequestLocale } from "next-intl/server";

type Props = { params: Promise<{ locale: string }> };

export default async function AdminLoginPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f5f0ea",
        fontFamily: "monospace",
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          padding: "48px 40px",
          width: "100%",
          maxWidth: 400,
        }}
      >
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 11, letterSpacing: 3, color: "#888", marginBottom: 4 }}>
            ADMIN
          </div>
          <h1 style={{ fontSize: 20, margin: 0, fontFamily: "Georgia, serif", fontWeight: 400 }}>
            VINKL Backend
          </h1>
        </div>
        <AdminLoginForm locale={locale} />
      </div>
    </main>
  );
}
