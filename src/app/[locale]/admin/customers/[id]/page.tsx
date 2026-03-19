import { redirect, notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { AdminNav } from "@/components/admin/admin-nav";
import Link from "next/link";
import type { Order } from "@/types/order";

type Props = { params: Promise<{ locale: string; id: string }> };

const STATUS_COLORS: Record<string, string> = {
  paid: "#b85c00", shipped: "#2d7a2d", returned: "#555", exchanged: "#555", refunded: "#c00",
};

export default async function AdminCustomerDetailPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/admin/login`);

  const { data: { user: customer }, error } = await supabaseAdmin.auth.admin.getUserById(id);
  if (error || !customer) notFound();

  // Get orders by customer_id OR matching email
  const { data: orders } = await supabaseAdmin
    .from("orders")
    .select("*")
    .or(`customer_id.eq.${id},customer_email.eq.${customer.email}`)
    .order("created_at", { ascending: false });

  const totalSpent = (orders ?? []).reduce((sum, o) => sum + (o.status !== "refunded" ? o.amount_total : 0), 0);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9f9f9", fontFamily: "monospace" }}>
      <AdminNav locale={locale} active="customers" userEmail={user.email ?? ""} />
      <main style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px" }}>
        <div style={{ marginBottom: 20, fontSize: 12, color: "#888" }}>
          <Link href={`/${locale}/admin/customers`} style={{ color: "#888", textDecoration: "none" }}>Kunden</Link>
          {" / "}<span>{customer.email}</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
          <div style={{ backgroundColor: "#fff", border: "1px solid #e0e0e0", padding: "20px 24px" }}>
            <div style={{ fontSize: 10, letterSpacing: 1, color: "#888", marginBottom: 12 }}>PROFIL</div>
            <div style={{ fontSize: 14, marginBottom: 4 }}>{customer.user_metadata?.name ?? "–"}</div>
            <div style={{ fontSize: 12, color: "#555", marginBottom: 4 }}>{customer.email}</div>
            <div style={{ fontSize: 11, color: "#888" }}>
              Registriert: {new Date(customer.created_at).toLocaleDateString("de-DE")}
            </div>
          </div>
          <div style={{ backgroundColor: "#fff", border: "1px solid #e0e0e0", padding: "20px 24px" }}>
            <div style={{ fontSize: 10, letterSpacing: 1, color: "#888", marginBottom: 12 }}>STATISTIK</div>
            <div style={{ fontSize: 22, fontWeight: "bold", marginBottom: 4 }}>{(orders ?? []).length}</div>
            <div style={{ fontSize: 12, color: "#888", marginBottom: 12 }}>Bestellungen</div>
            <div style={{ fontSize: 16, fontWeight: "bold" }}>{(totalSpent / 100).toFixed(2)} €</div>
            <div style={{ fontSize: 12, color: "#888" }}>Gesamtumsatz</div>
          </div>
        </div>

        <div style={{ backgroundColor: "#fff", border: "1px solid #e0e0e0" }}>
          <div style={{ padding: "16px 24px", borderBottom: "1px solid #f0f0f0", fontSize: 10, letterSpacing: 1, color: "#888" }}>
            BESTELLUNGEN
          </div>
          {(!orders || orders.length === 0) && (
            <div style={{ padding: "24px", color: "#888", fontSize: 13 }}>Keine Bestellungen.</div>
          )}
          {orders?.map((order: Order) => (
            <Link
              key={order.id}
              href={`/${locale}/admin/orders/${order.id}`}
              style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 80px", padding: "12px 24px", borderTop: "1px solid #f5f5f5", textDecoration: "none", color: "inherit", alignItems: "center" }}
            >
              <span style={{ fontSize: 12, color: "#666" }}>{new Date(order.created_at).toLocaleDateString("de-DE")}</span>
              <span style={{ fontSize: 12, fontFamily: "monospace" }}>{order.invoice_number}</span>
              <span style={{ fontSize: 13, fontWeight: "bold" }}>{(order.amount_total / 100).toFixed(2)} €</span>
              <span style={{ fontSize: 10, letterSpacing: 1, color: STATUS_COLORS[order.status] ?? "#555", fontWeight: "bold" }}>
                {order.status.toUpperCase()}
              </span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
