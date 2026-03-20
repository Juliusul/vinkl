"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function AccountLoginForm({ locale }: { locale: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError("E-Mail oder Passwort falsch."); setLoading(false); return; }
    router.push(`/${locale}/account/orders`);
    router.refresh();
  }

  const inputStyle: React.CSSProperties = { border: "1px solid #ccc", padding: "10px 12px", fontSize: 14, width: "100%", boxSizing: "border-box", fontFamily: "Georgia, serif", backgroundColor: "#fff" };

  return (
    <form onSubmit={handleSubmit} style={{ fontFamily: "monospace" }}>
      <div style={{ marginBottom: 16 }}>
        <label style={{ fontSize: 11, color: "#888", display: "block", marginBottom: 4 }}>E-MAIL</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" style={inputStyle} />
      </div>
      <div style={{ marginBottom: 8 }}>
        <label style={{ fontSize: 11, color: "#888", display: "block", marginBottom: 4 }}>PASSWORT</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required autoComplete="current-password" style={inputStyle} />
      </div>
      <div style={{ marginBottom: 24, textAlign: "right" }}>
        <a
          href={`/${locale}/account/forgot-password`}
          style={{ fontSize: 11, color: "#888", textDecoration: "underline", cursor: "pointer" }}
        >
          Passwort vergessen?
        </a>
      </div>
      {error && <div style={{ fontSize: 12, color: "#c00", marginBottom: 16 }}>{error}</div>}
      <button type="submit" disabled={loading} style={{ width: "100%", backgroundColor: "#1a1a1a", color: "#fff", border: "none", padding: "14px", fontSize: 11, letterSpacing: 2, cursor: loading ? "not-allowed" : "pointer", fontFamily: "monospace", opacity: loading ? 0.7 : 1 }}>
        {loading ? "..." : "ANMELDEN"}
      </button>
    </form>
  );
}
