"use client";

import { useState } from "react";

interface Props {
  sessionId: string;
  secret: string;
}

export function AdminShipForm({ sessionId, secret }: Props) {
  const [trackingCode, setTrackingCode] = useState("");
  const [trackingUrl, setTrackingUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!trackingCode.trim()) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/ship", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          trackingCode: trackingCode.trim(),
          trackingUrl: trackingUrl.trim() || undefined,
          secret,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Fehler");
      }

      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unbekannter Fehler");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div style={{ fontSize: 12, color: "#2d7a2d", fontWeight: "bold" }}>
        ✓ Versandbestätigung wurde gesendet!
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8, alignItems: "flex-end", flexWrap: "wrap" }}>
      <div>
        <label style={{ fontSize: 10, color: "#888", display: "block", marginBottom: 3 }}>
          TRACKING-NUMMER *
        </label>
        <input
          type="text"
          value={trackingCode}
          onChange={(e) => setTrackingCode(e.target.value)}
          placeholder="1Z999AA10123456784"
          required
          style={{
            border: "1px solid #ccc",
            borderRadius: 3,
            padding: "6px 10px",
            fontSize: 12,
            fontFamily: "monospace",
            width: 200,
          }}
        />
      </div>
      <div>
        <label style={{ fontSize: 10, color: "#888", display: "block", marginBottom: 3 }}>
          TRACKING-URL (optional)
        </label>
        <input
          type="url"
          value={trackingUrl}
          onChange={(e) => setTrackingUrl(e.target.value)}
          placeholder="https://www.dhl.de/..."
          style={{
            border: "1px solid #ccc",
            borderRadius: 3,
            padding: "6px 10px",
            fontSize: 12,
            width: 220,
          }}
        />
      </div>
      <button
        type="submit"
        disabled={loading || !trackingCode.trim()}
        style={{
          backgroundColor: loading ? "#ccc" : "#1a1a1a",
          color: "#fff",
          border: "none",
          borderRadius: 3,
          padding: "7px 16px",
          fontSize: 11,
          letterSpacing: 1,
          cursor: loading ? "not-allowed" : "pointer",
          fontFamily: "monospace",
        }}
      >
        {loading ? "SENDE..." : "VERSANDBESTÄTIGUNG SENDEN"}
      </button>
      {error && <div style={{ fontSize: 11, color: "red", width: "100%" }}>{error}</div>}
    </form>
  );
}
