"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function ForgotPasswordForm({ locale }: { locale: string }) {
  const [email, setEmail] = useState("");
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

    const supabase = createSupabaseBrowserClient();
    const siteUrl = window.location.origin;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${siteUrl}/auth/confirm?type=recovery&next=/${locale}/account/reset-password`,
    });

    setLoading(false);

    if (error) {
      setError("Es ist ein Fehler aufgetreten. Bitte versuche es erneut.");
      return;
    }

    setDone(true);
  }

  if (done) {
    return (
      <div style={{ fontFamily: "Georgia, serif" }}>
        <div style={{ fontSize: 32, marginBottom: 16 }}>✉️</div>
        <h2 style={{ fontSize: 20, fontWeight: 400, margin: "0 0 12px", color: "#1a1a1a" }}>
          E-Mail gesendet
        </h2>
        <p style={{ fontSize: 14, color: "#555", lineHeight: 1.7, margin: "0 0 16px" }}>
          Wir haben einen Link zum Zurücksetzen deines Passworts an{" "}
          <strong>{email}</strong> gesendet.
          Bitte prüfe auch deinen Spam-Ordner.
        </p>
        <a
          href={`/${locale}/account/login`}
          style={{ fontSize: 12, color: "#888", textDecoration: "underline" }}
        >
          ← Zurück zur Anmeldung
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ fontFamily: "monospace" }}>
      <div style={{ marginBottom: 24 }}>
        <label style={{ fontSize: 11, color: "#888", display: "block", marginBottom: 4 }}>
          E-MAIL
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
        {loading ? "..." : "LINK SENDEN"}
      </button>
      <div style={{ marginTop: 16, textAlign: "center" }}>
        <a
          href={`/${locale}/account/login`}
          style={{ fontSize: 11, color: "#888", textDecoration: "underline" }}
        >
          ← Zurück zur Anmeldung
        </a>
      </div>
    </form>
  );
}
