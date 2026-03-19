import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getTemplateSettings } from "@/lib/supabase/settings";
import { AdminNav } from "@/components/admin/admin-nav";
import { TemplatesEditor } from "@/components/admin/templates-editor";

type Props = { params: Promise<{ locale: string }> };

export default async function AdminTemplatesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/admin/login`);

  const settings = await getTemplateSettings();

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9f9f9", fontFamily: "monospace" }}>
      <AdminNav locale={locale} active="templates" userEmail={user.email ?? ""} />
      <main style={{ maxWidth: 800, margin: "0 auto", padding: "32px 24px" }}>
        <h1 style={{ fontSize: 18, margin: "0 0 8px", fontFamily: "Georgia, serif", fontWeight: 400 }}>Templates & Einstellungen</h1>
        <p style={{ fontSize: 12, color: "#888", marginBottom: 32 }}>
          Diese Einstellungen werden für Rechnungs-PDFs und E-Mail-Vorlagen verwendet.
        </p>
        <TemplatesEditor settings={settings} />
      </main>
    </div>
  );
}
