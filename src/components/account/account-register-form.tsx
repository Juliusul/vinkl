"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

interface Props {
  locale: string;
  prefillEmail?: string;
}

export function AccountRegisterForm({ locale, prefillEmail }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState(prefillEmail ?? "");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== password2) { setError("Passwörter stimmen nicht überein."); return; }
    if (password.length < 8) { setError("Passwort muss mindestens 8 Zeichen haben."); return; }
    setLoading(true);
    setError("");

    const supabase = createSupabaseBrowserClient();
    const siteUrl = window.location.origin;

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
        emailRedirectTo: `${siteUrl}/auth/confirm?next=/${locale}/account/orders`,
      },
    });

    if (signUpError) { setError(signUpError.message); setLoading(false); return; }

    // Link existing orders to this account via API
    await fetch("/api/account/link-orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    // If Supabase returned a session directly (email confirmation disabled),
    // we're already logged in — show success either way.
    const needsConfirmation = !data.session;
    if (!needsConfirmation) {
      // Already confirmed / auto-confirmed → go to orders
      window.location.href = `/${locale}/account/orders`;
      return;
    }

    setDone(true);
    setLoading(false);
  }

  const inputStyle: React.CSSProperties = { border: "1px solid #ccc", padding: "10px 12px", fontSize: 14, width: "100%", boxSizing: "border-box", fontFamily: "Georgia, serif", backgroundColor: "#fff" };
  const labelStyle: React.CSSProperties = { fontSize: 11, color: "#888", display: "block", marginBottom: 4, fontFamily: "monospace" };

  if (done) {
    return (
      <div style={{ fontFamily: "Georgia, serif" }}>
        <div style={{ fontSize: 32, marginBottom: 16 }}>✉️</div>
        <h2 style={{ fontSize: 20, fontWeight: 400, margin: "0 0 12px", color: "#1a1a1a" }}>
          Fast geschafft!
        </h2>
        <p style={{ fontSize: 14, color: "#555", lineHeight: 1.7, margin: "0 0 16px" }}>
          Wir haben eine Bestätigungs-E-Mail an <strong>{email}</strong> gesendet.
          Bitte klicke auf den Link in der E-Mail, um dein Konto zu aktivieren.
        </p>
        <p style={{ fontSize: 12, color: "#888", lineHeight: 1.6 }}>
          Keine E-Mail erhalten? Schau in deinen Spam-Ordner oder{" "}
          <button
            onClick={() => setDone(false)}
            style={{ background: "none", border: "none", color: "#1a1a1a", textDecoration: "underline", cursor: "pointer", fontSize: 12, padding: 0 }}
          >
            versuche es erneut
          </button>.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>NAME</label>
        <input type="text" value={name} onChange={e => setName(e.target.value)} required autoComplete="name" style={inputStyle} />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>E-MAIL</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" style={inputStyle} />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>PASSWORT (min. 8 Zeichen)</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required autoComplete="new-password" style={inputStyle} />
      </div>
      <div style={{ marginBottom: 24 }}>
        <label style={labelStyle}>PASSWORT WIEDERHOLEN</label>
        <input type="password" value={password2} onChange={e => setPassword2(e.target.value)} required autoComplete="new-password" style={inputStyle} />
      </div>
      {error && <div style={{ fontSize: 12, color: "#c00", marginBottom: 16, fontFamily: "monospace" }}>{error}</div>}
      <button type="submit" disabled={loading} style={{ width: "100%", backgroundColor: "#1a1a1a", color: "#fff", border: "none", padding: "14px", fontSize: 11, letterSpacing: 2, cursor: loading ? "not-allowed" : "pointer", fontFamily: "monospace", opacity: loading ? 0.7 : 1 }}>
        {loading ? "..." : "KONTO ERSTELLEN"}
      </button>
    </form>
  );
}
