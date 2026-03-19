"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface Props {
  currentName: string;
  currentEmail: string;
}

export function AccountProfileForm({ currentName, currentEmail }: Props) {
  const router = useRouter();
  const [name, setName] = useState(currentName);
  const [newPassword, setNewPassword] = useState("");
  const [nameSaved, setNameSaved] = useState(false);
  const [pwSaved, setPwSaved] = useState(false);
  const [error, setError] = useState("");

  const inputStyle: React.CSSProperties = { border: "1px solid #ccc", padding: "10px 12px", fontSize: 14, width: "100%", boxSizing: "border-box", fontFamily: "Georgia, serif", backgroundColor: "#fff" };
  const labelStyle: React.CSSProperties = { fontSize: 11, color: "#888", display: "block", marginBottom: 4, fontFamily: "monospace" };

  async function saveName(e: React.FormEvent) {
    e.preventDefault();
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.updateUser({ data: { name } });
    setNameSaved(true);
    setTimeout(() => setNameSaved(false), 2000);
    router.refresh();
  }

  async function savePassword(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (newPassword.length < 8) { setError("Passwort muss mindestens 8 Zeichen haben."); return; }
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) { setError(error.message); return; }
    setPwSaved(true);
    setNewPassword("");
    setTimeout(() => setPwSaved(false), 2000);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      {/* Name */}
      <form onSubmit={saveName}>
        <div style={{ fontSize: 12, letterSpacing: 1, color: "#888", fontFamily: "monospace", marginBottom: 16, textTransform: "uppercase" }}>Name</div>
        <div style={{ marginBottom: 8 }}>
          <label style={labelStyle}>ANZEIGENAME</label>
          <input style={inputStyle} value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div style={{ marginBottom: 8 }}>
          <label style={labelStyle}>E-MAIL</label>
          <input style={{ ...inputStyle, backgroundColor: "#f5f5f5", color: "#888" }} value={currentEmail} disabled />
        </div>
        <button type="submit" style={{ padding: "10px 20px", backgroundColor: nameSaved ? "#2d7a2d" : "#1a1a1a", color: "#fff", border: "none", fontSize: 11, letterSpacing: 1, cursor: "pointer", fontFamily: "monospace" }}>
          {nameSaved ? "✓ GESPEICHERT" : "SPEICHERN"}
        </button>
      </form>

      {/* Password */}
      <form onSubmit={savePassword}>
        <div style={{ fontSize: 12, letterSpacing: 1, color: "#888", fontFamily: "monospace", marginBottom: 16, textTransform: "uppercase" }}>Passwort ändern</div>
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>NEUES PASSWORT</label>
          <input type="password" style={inputStyle} value={newPassword} onChange={e => setNewPassword(e.target.value)} required autoComplete="new-password" />
        </div>
        {error && <div style={{ fontSize: 12, color: "#c00", marginBottom: 12, fontFamily: "monospace" }}>{error}</div>}
        <button type="submit" style={{ padding: "10px 20px", backgroundColor: pwSaved ? "#2d7a2d" : "#1a1a1a", color: "#fff", border: "none", fontSize: 11, letterSpacing: 1, cursor: "pointer", fontFamily: "monospace" }}>
          {pwSaved ? "✓ GESPEICHERT" : "PASSWORT ÄNDERN"}
        </button>
      </form>
    </div>
  );
}
