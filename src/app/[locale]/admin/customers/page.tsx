import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { AdminNav } from "@/components/admin/admin-nav";
import Link from "next/link";

type Props = { params: Promise<{ locale: string }> };

export default async function AdminCustomersPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/admin/login`);

  const { data: authData } = await supabaseAdmin.auth.admin.listUsers({ perPage: 200 });
  const users = authData?.users ?? [];

  // Count orders per user email
  const { data: orders } = await supabaseAdmin.from("orders").select("customer_email");
  const orderCounts: Record<string, number> = {};
  for (const o of orders ?? []) {
    orderCounts[o.customer_email] = (orderCounts[o.customer_email] ?? 0) + 1;
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9f9f9", fontFamily: "monospace" }}>
      <AdminNav locale={locale} active="customers" userEmail={user.email ?? ""} />
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>
        <h1 style={{ fontSize: 18, margin: "0 0 24px", fontFamily: "Georgia, serif", fontWeight: 400 }}>
          Kunden ({users.length})
        </h1>

        <div style={{ backgroundColor: "#fff", border: "1px solid #e0e0e0" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 2fr 1fr 1fr", padding: "10px 16px", backgroundColor: "#f5f5f5", fontSize: 10, letterSpacing: 1, color: "#888" }}>
            <span>NAME</span><span>E-MAIL</span><span>BESTELLUNGEN</span><span>REGISTRIERT</span>
          </div>
          {users.length === 0 && (
            <div style={{ padding: "32px 16px", color: "#888", fontSize: 13, textAlign: "center" }}>Noch keine Kunden.</div>
          )}
          {users.map((u) => (
            <Link
              key={u.id}
              href={`/${locale}/admin/customers/${u.id}`}
              style={{ display: "grid", gridTemplateColumns: "2fr 2fr 1fr 1fr", padding: "12px 16px", borderTop: "1px solid #f0f0f0", textDecoration: "none", color: "inherit", alignItems: "center" }}
            >
              <span style={{ fontSize: 13 }}>{u.user_metadata?.name ?? "–"}</span>
              <span style={{ fontSize: 12, color: "#555" }}>{u.email}</span>
              <span style={{ fontSize: 13 }}>{orderCounts[u.email ?? ""] ?? 0}</span>
              <span style={{ fontSize: 12, color: "#888" }}>{new Date(u.created_at).toLocaleDateString("de-DE")}</span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
