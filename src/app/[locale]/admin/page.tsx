import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { AdminNav } from "@/components/admin/admin-nav";
import Link from "next/link";
import type { Order } from "@/types/order";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ status?: string; q?: string; page?: string }>;
};

const STATUS_LABELS: Record<string, string> = {
  all: "Alle",
  paid: "Ausstehend",
  shipped: "Versandt",
  returned: "Rückgabe",
  exchanged: "Umtausch",
  refunded: "Erstattet",
};

const STATUS_COLORS: Record<string, string> = {
  paid: "#b85c00",
  shipped: "#2d7a2d",
  returned: "#555",
  exchanged: "#555",
  refunded: "#c00",
};

export default async function AdminPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { status = "all", q = "", page = "1" } = await searchParams;
  setRequestLocale(locale);

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/admin/login`);

  const pageNum = parseInt(page) || 1;
  const pageSize = 20;
  const offset = (pageNum - 1) * pageSize;

  let query = supabaseAdmin
    .from("orders")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + pageSize - 1);

  if (status !== "all") query = query.eq("status", status);
  if (q) query = query.or(`customer_email.ilike.%${q}%,customer_name.ilike.%${q}%,invoice_number.ilike.%${q}%`);

  const { data: orders, count } = await query;
  const totalPages = Math.ceil((count ?? 0) / pageSize);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9f9f9", fontFamily: "monospace" }}>
      <AdminNav locale={locale} active="orders" userEmail={user.email ?? ""} />

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>
        <h1 style={{ fontSize: 18, margin: "0 0 24px", fontFamily: "Georgia, serif", fontWeight: 400 }}>
          Bestellungen
        </h1>

        {/* Filter tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
          {Object.entries(STATUS_LABELS).map(([key, label]) => (
            <Link
              key={key}
              href={`/${locale}/admin?status=${key}${q ? `&q=${q}` : ""}`}
              style={{
                padding: "5px 12px",
                fontSize: 11,
                letterSpacing: 1,
                textDecoration: "none",
                backgroundColor: status === key ? "#1a1a1a" : "#fff",
                color: status === key ? "#fff" : "#444",
                border: "1px solid #ddd",
              }}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Search */}
        <form method="get" style={{ marginBottom: 20 }}>
          <input type="hidden" name="status" value={status} />
          <input
            name="q"
            defaultValue={q}
            placeholder="Suche nach Name, E-Mail, Rechnungsnr. ..."
            style={{
              width: "100%",
              maxWidth: 400,
              border: "1px solid #ddd",
              padding: "8px 12px",
              fontSize: 12,
              fontFamily: "monospace",
            }}
          />
        </form>

        {/* Orders table */}
        <div style={{ backgroundColor: "#fff", border: "1px solid #e0e0e0" }}>
          {/* Header */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr 1fr 1fr 80px", padding: "10px 16px", backgroundColor: "#f5f5f5", fontSize: 10, letterSpacing: 1, color: "#888" }}>
            <span>DATUM</span><span>KUNDE</span><span>RECHNUNG</span><span>BETRAG</span><span>STATUS</span>
          </div>

          {(!orders || orders.length === 0) && (
            <div style={{ padding: "32px 16px", color: "#888", fontSize: 13, textAlign: "center" }}>
              Keine Bestellungen gefunden.
            </div>
          )}

          {orders?.map((order: Order) => (
            <Link
              key={order.id}
              href={`/${locale}/admin/orders/${order.id}`}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 2fr 1fr 1fr 80px",
                padding: "12px 16px",
                borderTop: "1px solid #f0f0f0",
                textDecoration: "none",
                color: "inherit",
                alignItems: "center",
                transition: "background 0.1s",
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#fafafa")}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "")}
            >
              <span style={{ fontSize: 12, color: "#666" }}>
                {new Date(order.created_at).toLocaleDateString("de-DE")}
              </span>
              <div>
                <div style={{ fontSize: 13, color: "#1a1a1a" }}>{order.customer_name ?? "–"}</div>
                <div style={{ fontSize: 11, color: "#888" }}>{order.customer_email}</div>
              </div>
              <span style={{ fontSize: 12, fontFamily: "monospace" }}>{order.invoice_number}</span>
              <span style={{ fontSize: 13, fontWeight: "bold" }}>
                {(order.amount_total / 100).toFixed(2)} €
              </span>
              <span style={{ fontSize: 10, letterSpacing: 1, color: STATUS_COLORS[order.status] ?? "#555", fontWeight: "bold" }}>
                {STATUS_LABELS[order.status] ?? order.status}
              </span>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: "flex", gap: 8, marginTop: 16, justifyContent: "center" }}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={`/${locale}/admin?status=${status}&q=${q}&page=${p}`}
                style={{
                  padding: "4px 10px",
                  fontSize: 12,
                  textDecoration: "none",
                  backgroundColor: p === pageNum ? "#1a1a1a" : "#fff",
                  color: p === pageNum ? "#fff" : "#444",
                  border: "1px solid #ddd",
                }}
              >
                {p}
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
