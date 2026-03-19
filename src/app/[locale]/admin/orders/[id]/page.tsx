import { redirect, notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { AdminNav } from "@/components/admin/admin-nav";
import { OrderActions } from "@/components/admin/order-actions";
import Link from "next/link";
import type { Order, OrderEvent } from "@/types/order";

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

const STATUS_LABELS: Record<string, string> = {
  paid: "Bezahlt — Versand ausstehend",
  shipped: "Versandt",
  returned: "Rückgabe",
  exchanged: "Umtausch",
  refunded: "Erstattet",
};
const STATUS_COLORS: Record<string, string> = {
  paid: "#b85c00", shipped: "#2d7a2d", returned: "#555", exchanged: "#555", refunded: "#c00",
};
const EVENT_LABELS: Record<string, string> = {
  confirmed: "Bestellung eingegangen",
  shipped: "Als versandt markiert",
  returned: "Rückgabe erfasst",
  exchanged: "Umtausch erfasst",
  refunded: "Rückerstattung ausgelöst",
  note_added: "Notiz hinzugefügt",
  email_resent: "Bestätigung erneut gesendet",
};

export default async function AdminOrderDetailPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/admin/login`);

  const { data: order } = await supabaseAdmin.from("orders").select("*").eq("id", id).single();
  if (!order) notFound();

  const { data: events } = await supabaseAdmin
    .from("order_events")
    .select("*")
    .eq("order_id", id)
    .order("created_at", { ascending: true });

  const addr = order.shipping_address;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9f9f9", fontFamily: "monospace" }}>
      <AdminNav locale={locale} active="orders" userEmail={user.email ?? ""} />

      <main style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px" }}>
        {/* Breadcrumb */}
        <div style={{ marginBottom: 20, fontSize: 12, color: "#888" }}>
          <Link href={`/${locale}/admin`} style={{ color: "#888", textDecoration: "none" }}>
            Bestellungen
          </Link>
          {" / "}
          <span>{(order as Order).invoice_number}</span>
        </div>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: 20, margin: "0 0 4px", fontFamily: "Georgia, serif", fontWeight: 400 }}>
              {(order as Order).invoice_number}
            </h1>
            <div style={{ fontSize: 12, color: "#888" }}>
              {new Date((order as Order).created_at).toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" })}
            </div>
          </div>
          <div style={{
            padding: "6px 14px",
            fontSize: 11,
            letterSpacing: 1,
            color: STATUS_COLORS[(order as Order).status] ?? "#555",
            border: `1px solid ${STATUS_COLORS[(order as Order).status] ?? "#ddd"}`,
            fontWeight: "bold",
          }}>
            {STATUS_LABELS[(order as Order).status] ?? (order as Order).status}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
          {/* Customer */}
          <div style={{ backgroundColor: "#fff", border: "1px solid #e0e0e0", padding: "20px 24px" }}>
            <div style={{ fontSize: 10, letterSpacing: 1, color: "#888", marginBottom: 12 }}>KUNDE</div>
            <div style={{ fontSize: 14, marginBottom: 4 }}>{(order as Order).customer_name ?? "–"}</div>
            <div style={{ fontSize: 12, color: "#555", marginBottom: 4 }}>{(order as Order).customer_email}</div>
            {(order as Order).customer_id && (
              <Link
                href={`/${locale}/admin/customers/${(order as Order).customer_id}`}
                style={{ fontSize: 11, color: "#1a1a1a" }}
              >
                → Kundenprofil ansehen
              </Link>
            )}
          </div>

          {/* Shipping address */}
          <div style={{ backgroundColor: "#fff", border: "1px solid #e0e0e0", padding: "20px 24px" }}>
            <div style={{ fontSize: 10, letterSpacing: 1, color: "#888", marginBottom: 12 }}>LIEFERADRESSE</div>
            {addr ? (
              <div style={{ fontSize: 13, lineHeight: 1.7 }}>
                <div>{(order as Order).customer_name}</div>
                <div>{addr.line1}{addr.line2 ? `, ${addr.line2}` : ""}</div>
                <div>{addr.postal_code} {addr.city}</div>
                <div>{addr.country}</div>
              </div>
            ) : (
              <div style={{ fontSize: 12, color: "#888" }}>Keine Adresse gespeichert</div>
            )}
          </div>
        </div>

        {/* Order items */}
        <div style={{ backgroundColor: "#fff", border: "1px solid #e0e0e0", padding: "20px 24px", marginBottom: 24 }}>
          <div style={{ fontSize: 10, letterSpacing: 1, color: "#888", marginBottom: 16 }}>BESTELLPOSITIONEN</div>
          <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: 12, borderBottom: "1px solid #f0f0f0", marginBottom: 12 }}>
            <span style={{ fontSize: 13 }}>VINKL Teak Wandregal</span>
            <span style={{ fontSize: 13, fontWeight: "bold" }}>
              {((order as Order).amount_total / 100).toFixed(2)} €
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#888" }}>
            <span>Stripe Session: <span style={{ fontFamily: "monospace" }}>{(order as Order).stripe_session_id}</span></span>
          </div>
        </div>

        {/* Tracking (if shipped) */}
        {(order as Order).tracking_code && (
          <div style={{ backgroundColor: "#f0fff0", border: "1px solid #c0e8c0", padding: "16px 24px", marginBottom: 24 }}>
            <div style={{ fontSize: 10, letterSpacing: 1, color: "#2d7a2d", marginBottom: 8 }}>SENDUNGSVERFOLGUNG</div>
            <div style={{ fontSize: 13 }}>
              {(order as Order).tracking_url ? (
                <a href={(order as Order).tracking_url!} target="_blank" rel="noopener noreferrer" style={{ color: "#1a1a1a" }}>
                  {(order as Order).tracking_code}
                </a>
              ) : (
                (order as Order).tracking_code
              )}
            </div>
            {(order as Order).shipped_at && (
              <div style={{ fontSize: 11, color: "#666", marginTop: 4 }}>
                Versandt am {new Date((order as Order).shipped_at!).toLocaleDateString("de-DE")}
              </div>
            )}
          </div>
        )}

        {/* Admin notes */}
        {(order as Order).admin_notes && (
          <div style={{ backgroundColor: "#fffbf0", border: "1px solid #e8dfc0", padding: "16px 24px", marginBottom: 24 }}>
            <div style={{ fontSize: 10, letterSpacing: 1, color: "#888", marginBottom: 8 }}>ADMIN-NOTIZ</div>
            <div style={{ fontSize: 13 }}>{(order as Order).admin_notes}</div>
          </div>
        )}

        {/* Actions */}
        <OrderActions order={order as Order} locale={locale} />

        {/* Event timeline */}
        <div style={{ backgroundColor: "#fff", border: "1px solid #e0e0e0", padding: "20px 24px", marginTop: 24 }}>
          <div style={{ fontSize: 10, letterSpacing: 1, color: "#888", marginBottom: 16 }}>VERLAUF</div>
          {events?.map((event: OrderEvent) => (
            <div key={event.id} style={{ display: "flex", gap: 16, paddingBottom: 12, marginBottom: 12, borderBottom: "1px solid #f5f5f5" }}>
              <div style={{ fontSize: 11, color: "#888", whiteSpace: "nowrap", minWidth: 120 }}>
                {new Date(event.created_at).toLocaleDateString("de-DE")}
              </div>
              <div>
                <div style={{ fontSize: 13 }}>{EVENT_LABELS[event.event_type] ?? event.event_type}</div>
                {event.created_by !== "system" && (
                  <div style={{ fontSize: 11, color: "#888" }}>von {event.created_by}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
