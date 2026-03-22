"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

interface Props {
  locale: string;
}

export function AdminLoginForm({ locale }: Props) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        setError("E-Mail oder Passwort falsch.");
        return;
      }

      router.push(`/${locale}/admin`);
      router.refresh();
    } catch (err) {
      console.error("Admin login error:", err);
      setError("Anmeldung fehlgeschlagen. Bitte versuche es erneut.");
    } finally {
      setLoading(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    border: "1px solid #ddd",
    padding: "10px 12px",
    fontSize: 13,
    fontFamily: "monospace",
    outline: "none",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 10,
    letterSpacing: 1,
    color: "#888",
    display: "block",
    marginBottom: 4,
    textTransform: "uppercase",
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>E-Mail</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          style={inputStyle}
        />
      </div>
      <div style={{ marginBottom: 24 }}>
        <label style={labelStyle}>Passwort</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
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
          backgroundColor: loading ? "#ccc" : "#1a1a1a",
          color: "#fff",
          border: "none",
          padding: "12px",
          fontSize: 11,
          letterSpacing: 2,
          cursor: loading ? "not-allowed" : "pointer",
          fontFamily: "monospace",
          textTransform: "uppercase",
        }}
      >
        {loading ? "..." : "Anmelden"}
      </button>
    </form>
  );
}
