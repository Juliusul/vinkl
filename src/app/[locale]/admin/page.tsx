import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe/client";
import { AdminShipForm } from "@/components/admin/admin-ship-form";
import { generateInvoiceNumber } from "@/lib/invoice/number";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ secret?: string }>;
};

export default async function AdminPage({ searchParams }: Props) {
  const { secret } = await searchParams;

  if (secret !== process.env.ADMIN_SECRET) {
    redirect("/");
  }

  // Fetch last 20 completed checkout sessions from Stripe
  const sessions = await stripe.checkout.sessions.list({
    limit: 20,
    expand: ["data.line_items"],
  });

  const orders = sessions.data
    .filter((s) => s.payment_status === "paid")
    .map((s) => ({
      id: s.id,
      invoiceNumber: generateInvoiceNumber(s.id, s.created),
      customerName: s.customer_details?.name ?? "–",
      customerEmail: s.customer_details?.email ?? "–",
      amount: ((s.amount_total ?? 0) / 100).toLocaleString("de-DE", { minimumFractionDigits: 2 }),
      date: new Date(s.created * 1000).toLocaleDateString("de-DE"),
      shipped: s.metadata?.shipped === "true",
      trackingCode: s.metadata?.trackingCode ?? null,
      shippedAt: s.metadata?.shippedAt
        ? new Date(s.metadata.shippedAt).toLocaleDateString("de-DE")
        : null,
    }));

  return (
    <main style={{ fontFamily: "monospace", padding: "40px 32px", maxWidth: 900, margin: "0 auto" }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 11, letterSpacing: 3, color: "#888", marginBottom: 4 }}>ADMIN</div>
        <h1 style={{ fontSize: 22, margin: 0 }}>VINKL — Bestellungen</h1>
      </div>

      {orders.length === 0 && (
        <p style={{ color: "#888" }}>Noch keine Bestellungen.</p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {orders.map((order) => (
          <div
            key={order.id}
            style={{
              border: "1px solid #e0e0e0",
              borderRadius: 4,
              padding: "20px 24px",
              backgroundColor: order.shipped ? "#f9fff9" : "#fff",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div>
                <div style={{ fontWeight: "bold", fontSize: 14 }}>{order.invoiceNumber}</div>
                <div style={{ color: "#666", fontSize: 12 }}>{order.date}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: "bold" }}>{order.amount} €</div>
                <div
                  style={{
                    fontSize: 11,
                    color: order.shipped ? "#2d7a2d" : "#b85c00",
                    fontWeight: "bold",
                    letterSpacing: 1,
                  }}
                >
                  {order.shipped ? "✓ VERSANDT" : "AUSSTEHEND"}
                </div>
              </div>
            </div>

            <div style={{ fontSize: 12, color: "#444", marginBottom: order.shipped ? 8 : 16 }}>
              {order.customerName} · {order.customerEmail}
            </div>

            {order.shipped && order.trackingCode && (
              <div style={{ fontSize: 12, color: "#2d7a2d", marginBottom: 8 }}>
                Tracking: {order.trackingCode} · Versandt am {order.shippedAt}
              </div>
            )}

            {!order.shipped && (
              <AdminShipForm sessionId={order.id} secret={secret!} />
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
