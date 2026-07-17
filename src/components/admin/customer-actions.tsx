"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  customerId: string;
  customerEmail: string;
  confirmed: boolean;
  locale: string;
}

export function CustomerActions({ customerId, customerEmail, confirmed, locale }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState<"delete" | "resend" | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleResend() {
    setBusy("resend");
    setError(null);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/customers/${customerId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "resend_confirmation" }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Fehler beim Senden."); return; }
      setMessage(`Bestätigungsmail an ${customerEmail} gesendet.`);
    } catch {
      setError("Netzwerkfehler.");
    } finally {
      setBusy(null);
    }
  }

  async function handleDelete() {
    const ok = window.confirm(
      `Konto ${customerEmail} endgültig löschen?\n\nBestellungen und Rechnungen bleiben aus steuerlichen Gründen erhalten und sind weiter über die E-Mail-Adresse auffindbar. Nur der Konto-Zugang wird gelöscht.`
    );
    if (!ok) return;
    setBusy("delete");
    setError(null);
    try {
      const res = await fetch(`/api/admin/customers/${customerId}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Löschen fehlgeschlagen."); return; }
      router.push(`/${locale}/admin/customers`);
      router.refresh();
    } catch {
      setError("Netzwerkfehler.");
      setBusy(null);
    }
  }

  const btnStyle: React.CSSProperties = {
    background: "#fff",
    border: "1px solid #ddd",
    padding: "8px 14px",
    fontSize: 11,
    letterSpacing: 1,
    cursor: "pointer",
    fontFamily: "monospace",
  };

  return (
    <div style={{ backgroundColor: "#fff", border: "1px solid #e0e0e0", padding: "20px 24px", marginTop: 24 }}>
      <div style={{ fontSize: 10, letterSpacing: 1, color: "#888", marginBottom: 16 }}>AKTIONEN</div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {!confirmed && (
          <button onClick={handleResend} disabled={busy !== null} style={btnStyle}>
            {busy === "resend" ? "SENDET …" : "BESTÄTIGUNGSMAIL ERNEUT SENDEN"}
          </button>
        )}
        <button
          onClick={handleDelete}
          disabled={busy !== null}
          style={{ ...btnStyle, border: "1px solid #e0b4b4", color: "#c00" }}
        >
          {busy === "delete" ? "LÖSCHT …" : "KONTO LÖSCHEN"}
        </button>
      </div>
      {message && <p style={{ fontSize: 12, color: "#2d7a2d", margin: "12px 0 0", fontFamily: "monospace" }}>{message}</p>}
      {error && <p style={{ fontSize: 12, color: "#c00", margin: "12px 0 0", fontFamily: "monospace" }}>{error}</p>}
    </div>
  );
}
