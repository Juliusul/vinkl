import { setRequestLocale } from "next-intl/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { Order } from "@/types/order";

type Props = { params: Promise<{ locale: string }> };

const STATUS_DE: Record<string, string> = {
  paid: "In Bearbeitung", shipped: "Versandt", returned: "Rückgabe", exchanged: "Umtausch", refunded: "Erstattet",
};
const STATUS_COLORS: Record<string, string> = {
  paid: "#b85c00", shipped: "#2d7a2d", returned: "#555", exchanged: "#555", refunded: "#c00",
};

export default async function AccountOrdersPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/account/login`);

  const { data: orders } = await supabaseAdmin
    .from("orders")
    .select("*")
    .eq("customer_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 400, margin: "0 0 24px" }}>Meine Bestellungen</h2>

      {(!orders || orders.length === 0) && (
        <div style={{ fontFamily: "monospace", fontSize: 13, color: "#888", padding: "32px 0" }}>
          Noch keine Bestellungen vorhanden.
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {orders?.map((order: Order) => (
          <div key={order.id} style={{ backgroundColor: "#fff", padding: "20px 24px", border: "1px solid #e0d8d0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 13, fontFamily: "monospace", color: "#888", marginBottom: 4 }}>{order.invoice_number}</div>
                <div style={{ fontSize: 12, fontFamily: "monospace", color: "#aaa" }}>
                  {new Date(order.created_at).toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" })}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 16, fontWeight: "bold", marginBottom: 4 }}>
                  {(order.amount_total / 100).toFixed(2)} €
                </div>
                <div style={{ fontSize: 10, letterSpacing: 1, color: STATUS_COLORS[order.status] ?? "#555", fontWeight: "bold", fontFamily: "monospace" }}>
                  {STATUS_DE[order.status] ?? order.status}
                </div>
              </div>
            </div>
            <div style={{ fontSize: 13, color: "#555", marginBottom: 12 }}>VINKL Teak Wandregal</div>
            {order.tracking_code && (
              <div style={{ fontSize: 12, fontFamily: "monospace", color: "#2d7a2d", marginBottom: 12 }}>
                Tracking: {order.tracking_url ? (
                  <a href={order.tracking_url} target="_blank" rel="noopener noreferrer" style={{ color: "#2d7a2d" }}>{order.tracking_code}</a>
                ) : order.tracking_code}
              </div>
            )}
            <Link
              href={`/${locale}/account/orders/${order.id}`}
              style={{ fontSize: 11, fontFamily: "monospace", letterSpacing: 1, color: "#1a1a1a", textDecoration: "none", borderBottom: "1px solid #1a1a1a" }}
            >
              DETAILS & RECHNUNG
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
