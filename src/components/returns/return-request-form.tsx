"use client";

import { useState } from "react";

export function ReturnRequestForm({ locale }: { locale: string }) {
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [confirmWithdrawal, setConfirmWithdrawal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const inputStyle: React.CSSProperties = {
    border: "1px solid #ccc",
    padding: "10px 12px",
    fontSize: 14,
    width: "100%",
    boxSizing: "border-box",
    fontFamily: "Georgia, serif",
    backgroundColor: "#fff",
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/returns/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderNumber, email, confirmWithdrawal }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Das hat nicht geklappt. Bitte versuche es erneut."); return; }
      setDone(true);
    } catch {
      setError("Netzwerkfehler. Bitte versuche es erneut.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div style={{ fontFamily: "Georgia, serif" }}>
        <div style={{ fontSize: 32, marginBottom: 16 }}>✉️</div>
        <h2 style={{ fontSize: 20, fontWeight: 400, margin: "0 0 12px", color: "#1a1a1a" }}>
          Unterwegs
        </h2>
        <p style={{ fontSize: 14, color: "#555", lineHeight: 1.7, margin: "0 0 16px" }}>
          Falls Bestellnummer und E-Mail zusammenpassen, haben wir dir gerade
          die Rücksendeadresse und Anleitung geschickt. Bitte prüfe auch
          deinen Spam-Ordner.
        </p>
        <a href={`/${locale}`} style={{ fontSize: 12, color: "#888", textDecoration: "underline" }}>
          ← Zurück zur Startseite
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ fontFamily: "monospace" }}>
      <div style={{ marginBottom: 16 }}>
        <label style={{ fontSize: 11, color: "#888", display: "block", marginBottom: 4 }}>
          BESTELLNUMMER
        </label>
        <input
          type="text"
          value={orderNumber}
          onChange={e => setOrderNumber(e.target.value)}
          required
          placeholder="VINKL-2026-0001"
          style={inputStyle}
        />
      </div>
      <div style={{ marginBottom: 20 }}>
        <label style={{ fontSize: 11, color: "#888", display: "block", marginBottom: 4 }}>
          E-MAIL (aus deiner Bestellbestätigung)
        </label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          autoComplete="email"
          style={inputStyle}
        />
      </div>
      <div style={{ marginBottom: 24 }}>
        <label style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: "#333", cursor: "pointer", fontFamily: "Georgia, serif", lineHeight: 1.5 }}>
          <input
            type="checkbox"
            checked={confirmWithdrawal}
            onChange={e => setConfirmWithdrawal(e.target.checked)}
            required
            style={{ marginTop: 3 }}
          />
          Ich widerrufe hiermit den Kaufvertrag für diese Bestellung.
        </label>
      </div>
      {error && (
        <div style={{ fontSize: 12, color: "#c00", marginBottom: 16 }}>{error}</div>
      )}
      <button
        type="submit"
        disabled={loading || !confirmWithdrawal}
        style={{
          width: "100%",
          backgroundColor: "#1a1a1a",
          color: "#fff",
          border: "none",
          padding: "14px",
          fontSize: 11,
          letterSpacing: 2,
          cursor: loading || !confirmWithdrawal ? "not-allowed" : "pointer",
          fontFamily: "monospace",
          opacity: loading || !confirmWithdrawal ? 0.6 : 1,
        }}
      >
        {loading ? "..." : "RÜCKSENDUNG ANFORDERN"}
      </button>
      <p style={{ fontSize: 11, color: "#aaa", marginTop: 16, lineHeight: 1.6 }}>
        Die Rücksendung erfolgt innerhalb von 14 Tagen ab Widerruf auf deine
        Kosten. Wir erstatten den Kaufpreis, sobald das Regal bei uns
        eingegangen ist.
      </p>
    </form>
  );
}
