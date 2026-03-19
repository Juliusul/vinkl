"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

interface Props {
  locale: string;
  prefillEmail?: string;
}

export function AccountRegisterForm({ locale, prefillEmail }: Props) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState(prefillEmail ?? "");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== password2) { setError("Passwörter stimmen nicht überein."); return; }
    if (password.length < 8) { setError("Passwort muss mindestens 8 Zeichen haben."); return; }
    setLoading(true);
    setError("");

    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });

    if (error) { setError(error.message); setLoading(false); return; }

    // Link existing orders to this account via API
    await fetch("/api/account/link-orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    router.push(`/${locale}/account/orders`);
    router.refresh();
  }

  const inputStyle: React.CSSProperties = { border: "1px solid #ccc", padding: "10px 12px", fontSize: 14, width: "100%", boxSizing: "border-box", fontFamily: "Georgia, serif", backgroundColor: "#fff" };
  const labelStyle: React.CSSProperties = { fontSize: 11, color: "#888", display: "block", marginBottom: 4, fontFamily: "monospace" };

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
