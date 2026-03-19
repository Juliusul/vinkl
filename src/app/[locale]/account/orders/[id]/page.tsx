import { setRequestLocale } from "next-intl/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import type { Order, OrderEvent } from "@/types/order";

type Props = { params: Promise<{ locale: string; id: string }> };

const STATUS_DE: Record<string, string> = {
  paid: "In Bearbeitung", shipped: "Versandt", returned: "Rückgabe", exchanged: "Umtausch", refunded: "Erstattet",
};
const EVENT_DE: Record<string, string> = {
  confirmed: "Bestellung eingegangen", shipped: "Versandt", returned: "Rückgabe eingeleitet",
  exchanged: "Umtausch eingeleitet", refunded: "Rückerstattung erfolgt",
};

export default async function AccountOrderDetailPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/account/login`);

  const { data: order } = await supabaseAdmin.from("orders").select("*").eq("id", id).eq("customer_id", user.id).single();
  if (!order) notFound();

  const { data: events } = await supabaseAdmin
    .from("order_events")
    .select("*")
    .eq("order_id", id)
    .in("event_type", ["confirmed", "shipped", "returned", "exchanged", "refunded"])
    .order("created_at", { ascending: true });

  const addr = (order as Order).shipping_address;

  return (
    <div>
      <div style={{ marginBottom: 20, fontSize: 12, fontFamily: "monospace", color: "#888" }}>
        <Link href={`/${locale}/account/orders`} style={{ color: "#888", textDecoration: "none" }}>Bestellungen</Link>
        {" / "}{(order as Order).invoice_number}
      </div>

      <h2 style={{ fontSize: 20, fontWeight: 400, margin: "0 0 24px" }}>{(order as Order).invoice_number}</h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
        <div style={{ backgroundColor: "#fff", border: "1px solid #e0d8d0", padding: "16px 20px" }}>
          <div style={{ fontSize: 10, letterSpacing: 1, color: "#888", fontFamily: "monospace", marginBottom: 8 }}>STATUS</div>
          <div style={{ fontSize: 14 }}>{STATUS_DE[(order as Order).status] ?? (order as Order).status}</div>
        </div>
        <div style={{ backgroundColor: "#fff", border: "1px solid #e0d8d0", padding: "16px 20px" }}>
          <div style={{ fontSize: 10, letterSpacing: 1, color: "#888", fontFamily: "monospace", marginBottom: 8 }}>BETRAG</div>
          <div style={{ fontSize: 14, fontWeight: "bold" }}>{((order as Order).amount_total / 100).toFixed(2)} €</div>
        </div>
      </div>

      {addr && (
        <div style={{ backgroundColor: "#fff", border: "1px solid #e0d8d0", padding: "16px 20px", marginBottom: 20 }}>
          <div style={{ fontSize: 10, letterSpacing: 1, color: "#888", fontFamily: "monospace", marginBottom: 8 }}>LIEFERADRESSE</div>
          <div style={{ fontSize: 13, lineHeight: 1.7 }}>
            {(order as Order).customer_name}<br />
            {addr.line1}{addr.line2 ? `, ${addr.line2}` : ""}<br />
            {addr.postal_code} {addr.city}, {addr.country}
          </div>
        </div>
      )}

      {(order as Order).tracking_code && (
        <div style={{ backgroundColor: "#f0fff0", border: "1px solid #c0e8c0", padding: "16px 20px", marginBottom: 20 }}>
          <div style={{ fontSize: 10, letterSpacing: 1, color: "#2d7a2d", fontFamily: "monospace", marginBottom: 8 }}>SENDUNGSVERFOLGUNG</div>
          {(order as Order).tracking_url ? (
            <a href={(order as Order).tracking_url!} target="_blank" rel="noopener noreferrer" style={{ fontSize: 14, color: "#1a1a1a", fontFamily: "monospace" }}>
              {(order as Order).tracking_code}
            </a>
          ) : (
            <span style={{ fontSize: 14, fontFamily: "monospace" }}>{(order as Order).tracking_code}</span>
          )}
        </div>
      )}

      {/* PDF Download */}
      <a
        href={`/api/account/orders/${id}/invoice`}
        style={{ display: "inline-block", marginBottom: 24, padding: "10px 20px", backgroundColor: "#1a1a1a", color: "#fff", fontSize: 11, fontFamily: "monospace", letterSpacing: 1, textDecoration: "none" }}
      >
        RECHNUNG HERUNTERLADEN (PDF)
      </a>

      {/* Timeline */}
      <div style={{ backgroundColor: "#fff", border: "1px solid #e0d8d0", padding: "16px 20px" }}>
        <div style={{ fontSize: 10, letterSpacing: 1, color: "#888", fontFamily: "monospace", marginBottom: 16 }}>VERLAUF</div>
        {events?.map((event: OrderEvent) => (
          <div key={event.id} style={{ display: "flex", gap: 16, paddingBottom: 12, marginBottom: 12, borderBottom: "1px solid #f5f5f5" }}>
            <div style={{ fontSize: 11, color: "#888", fontFamily: "monospace", whiteSpace: "nowrap" }}>
              {new Date(event.created_at).toLocaleDateString("de-DE")}
            </div>
            <div style={{ fontSize: 13 }}>{EVENT_DE[event.event_type] ?? event.event_type}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
