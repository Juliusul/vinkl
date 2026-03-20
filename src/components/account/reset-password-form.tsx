"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function ResetPasswordForm({ locale }: { locale: string }) {
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
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
    if (password !== password2) {
      setError("Passwörter stimmen nicht überein.");
      return;
    }
    if (password.length < 8) {
      setError("Passwort muss mindestens 8 Zeichen haben.");
      return;
    }

    setLoading(true);
    setError("");

    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.updateUser({ password });

    setLoading(false);

    if (error) {
      setError("Fehler beim Speichern. Der Link ist möglicherweise abgelaufen.");
      return;
    }

    setDone(true);
  }

  if (done) {
    return (
      <div style={{ fontFamily: "Georgia, serif" }}>
        <div style={{ fontSize: 32, marginBottom: 16 }}>✅</div>
        <h2 style={{ fontSize: 20, fontWeight: 400, margin: "0 0 12px", color: "#1a1a1a" }}>
          Passwort geändert
        </h2>
        <p style={{ fontSize: 14, color: "#555", lineHeight: 1.7, margin: "0 0 24px" }}>
          Dein Passwort wurde erfolgreich aktualisiert. Du kannst dich jetzt anmelden.
        </p>
        <a
          href={`/${locale}/account/orders`}
          style={{
            display: "inline-block",
            backgroundColor: "#1a1a1a",
            color: "#fff",
            padding: "12px 24px",
            fontSize: 11,
            letterSpacing: 2,
            textDecoration: "none",
            fontFamily: "monospace",
          }}
        >
          ZU MEINEN BESTELLUNGEN
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ fontFamily: "monospace" }}>
      <div style={{ marginBottom: 16 }}>
        <label style={{ fontSize: 11, color: "#888", display: "block", marginBottom: 4 }}>
          NEUES PASSWORT (min. 8 Zeichen)
        </label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          autoComplete="new-password"
          style={inputStyle}
        />
      </div>
      <div style={{ marginBottom: 24 }}>
        <label style={{ fontSize: 11, color: "#888", display: "block", marginBottom: 4 }}>
          PASSWORT WIEDERHOLEN
        </label>
        <input
          type="password"
          value={password2}
          onChange={e => setPassword2(e.target.value)}
          required
          autoComplete="new-password"
          style={inputStyle}
        />
      </div>
      {error && (
        <div style={{ fontSize: 12, color: "#c00", marginBottom: 16 }}>{error}</div>
      )}
      <button
        type="submit"
        disabled={loading}
        style={{
          width: "100%",
          backgroundColor: "#1a1a1a",
          color: "#fff",
          border: "none",
          padding: "14px",
          fontSize: 11,
          letterSpacing: 2,
          cursor: loading ? "not-allowed" : "pointer",
          fontFamily: "monospace",
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? "..." : "PASSWORT SPEICHERN"}
      </button>
    </form>
  );
}
