"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Order } from "@/types/order";

interface Props {
  order: Order;
  locale: string;
}

export function OrderActions({ order, locale }: Props) {
  const router = useRouter();
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Ship form state
  const [trackingCode, setTrackingCode] = useState("");
  const [trackingUrl, setTrackingUrl] = useState("");

  // Return form state
  const [returnType, setReturnType] = useState<"returned" | "exchanged">("returned");
  const [returnNotes, setReturnNotes] = useState("");

  // Refund form state
  const [refundFull, setRefundFull] = useState(true);
  const [refundAmount, setRefundAmount] = useState("");
  const [refundReason, setRefundReason] = useState("requested_by_customer");

  async function apiCall(endpoint: string, body: object) {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`/api/admin/orders/${order.id}/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Fehler");
      setMessage("✓ Erfolgreich");
      setActivePanel(null);
      router.refresh();
    } catch (err) {
      setMessage(`✗ ${err instanceof Error ? err.message : "Fehler"}`);
    } finally {
      setLoading(false);
    }
  }

  const btnStyle = (color = "#1a1a1a"): React.CSSProperties => ({
    padding: "8px 16px",
    fontSize: 11,
    letterSpacing: 1,
    border: `1px solid ${color}`,
    backgroundColor: "transparent",
    color,
    cursor: "pointer",
    fontFamily: "monospace",
    textTransform: "uppercase",
  });

  const panelStyle: React.CSSProperties = {
    backgroundColor: "#f9f9f9",
    border: "1px solid #e0e0e0",
    padding: "20px 24px",
    marginTop: 12,
  };

  const inputStyle: React.CSSProperties = {
    border: "1px solid #ddd",
    padding: "8px 10px",
    fontSize: 12,
    fontFamily: "monospace",
    width: "100%",
    boxSizing: "border-box",
  };

  return (
    <div style={{ backgroundColor: "#fff", border: "1px solid #e0e0e0", padding: "20px 24px" }}>
      <div style={{ fontSize: 10, letterSpacing: 1, color: "#888", marginBottom: 16 }}>AKTIONEN</div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {order.status === "paid" && (
          <button style={btnStyle("#2d7a2d")} onClick={() => setActivePanel(activePanel === "ship" ? null : "ship")}>
            Versand markieren
          </button>
        )}
        {(order.status === "shipped") && (
          <button style={btnStyle("#555")} onClick={() => setActivePanel(activePanel === "return" ? null : "return")}>
            Rückgabe / Umtausch
          </button>
        )}
        {order.status !== "refunded" && (
          <button style={btnStyle("#c00")} onClick={() => setActivePanel(activePanel === "refund" ? null : "refund")}>
            Rückerstattung
          </button>
        )}
        <button style={btnStyle()} onClick={() => apiCall("resend-email", {})}>
          Bestätigung erneut senden
        </button>
      </div>

      {message && (
        <div style={{ marginTop: 12, fontSize: 12, color: message.startsWith("✓") ? "#2d7a2d" : "#c00" }}>
          {message}
        </div>
      )}

      {/* Ship panel */}
      {activePanel === "ship" && (
        <div style={panelStyle}>
          <div style={{ fontSize: 12, fontWeight: "bold", marginBottom: 12 }}>Versand markieren</div>
          <div style={{ marginBottom: 10 }}>
            <label style={{ fontSize: 10, color: "#888", display: "block", marginBottom: 4 }}>TRACKING-NUMMER *</label>
            <input style={inputStyle} value={trackingCode} onChange={e => setTrackingCode(e.target.value)} placeholder="1Z999AA10123456784" />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 10, color: "#888", display: "block", marginBottom: 4 }}>TRACKING-URL (optional)</label>
            <input style={inputStyle} value={trackingUrl} onChange={e => setTrackingUrl(e.target.value)} placeholder="https://www.dhl.de/..." />
          </div>
          <button
            onClick={() => apiCall("ship", { trackingCode, trackingUrl: trackingUrl || undefined })}
            disabled={loading || !trackingCode.trim()}
            style={{ ...btnStyle("#2d7a2d"), backgroundColor: "#2d7a2d", color: "#fff", opacity: loading ? 0.6 : 1 }}
          >
            {loading ? "..." : "Versandbestätigung senden"}
          </button>
        </div>
      )}

      {/* Return panel */}
      {activePanel === "return" && (
        <div style={panelStyle}>
          <div style={{ fontSize: 12, fontWeight: "bold", marginBottom: 12 }}>Rückgabe / Umtausch</div>
          <div style={{ marginBottom: 10 }}>
            <label style={{ fontSize: 10, color: "#888", display: "block", marginBottom: 4 }}>TYP</label>
            <select style={inputStyle} value={returnType} onChange={e => setReturnType(e.target.value as "returned" | "exchanged")}>
              <option value="returned">Rückgabe</option>
              <option value="exchanged">Umtausch</option>
            </select>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 10, color: "#888", display: "block", marginBottom: 4 }}>NOTIZ</label>
            <textarea style={{ ...inputStyle, height: 80, resize: "vertical" }} value={returnNotes} onChange={e => setReturnNotes(e.target.value)} />
          </div>
          <button
            onClick={() => apiCall("return", { type: returnType, notes: returnNotes })}
            disabled={loading}
            style={{ ...btnStyle("#555"), backgroundColor: "#555", color: "#fff", opacity: loading ? 0.6 : 1 }}
          >
            {loading ? "..." : "Erfassen"}
          </button>
        </div>
      )}

      {/* Refund panel */}
      {activePanel === "refund" && (
        <div style={panelStyle}>
          <div style={{ fontSize: 12, fontWeight: "bold", marginBottom: 12 }}>Rückerstattung</div>
          <div style={{ marginBottom: 10 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, cursor: "pointer" }}>
              <input type="checkbox" checked={refundFull} onChange={e => setRefundFull(e.target.checked)} />
              Volle Rückerstattung ({(order.amount_total / 100).toFixed(2)} €)
            </label>
          </div>
          {!refundFull && (
            <div style={{ marginBottom: 10 }}>
              <label style={{ fontSize: 10, color: "#888", display: "block", marginBottom: 4 }}>BETRAG (€)</label>
              <input style={inputStyle} type="number" min="0.01" step="0.01" value={refundAmount} onChange={e => setRefundAmount(e.target.value)} placeholder="z.B. 149.50" />
            </div>
          )}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 10, color: "#888", display: "block", marginBottom: 4 }}>GRUND</label>
            <select style={inputStyle} value={refundReason} onChange={e => setRefundReason(e.target.value)}>
              <option value="requested_by_customer">Kundenwunsch</option>
              <option value="duplicate">Doppelte Bestellung</option>
              <option value="fraudulent">Betrügerisch</option>
            </select>
          </div>
          <button
            onClick={() => apiCall("refund", {
              amount: refundFull ? undefined : Math.round(parseFloat(refundAmount) * 100),
              reason: refundReason,
            })}
            disabled={loading || (!refundFull && !refundAmount)}
            style={{ ...btnStyle("#c00"), backgroundColor: "#c00", color: "#fff", opacity: loading ? 0.6 : 1 }}
          >
            {loading ? "..." : "Rückerstattung auslösen"}
          </button>
        </div>
      )}
    </div>
  );
}
