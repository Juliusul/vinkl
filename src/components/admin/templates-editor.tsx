"use client";

import { useState } from "react";

interface Props {
  settings: Record<string, string>;
}

const FIELDS = [
  { section: "Firmeninformationen (Rechnung)" },
  { key: "seller_name", label: "Firmenname / Name" },
  { key: "seller_address", label: "Adresse (einzeilig)" },
  { key: "seller_vat_id", label: "USt-IdNr." },
  { key: "seller_iban", label: "IBAN" },
  { key: "seller_bank", label: "Bank" },
  { key: "seller_tax_rate", label: "Mehrwertsteuersatz (%)" },
  { section: "E-Mail Texte" },
  { key: "email_greeting", label: "Begrüßungstext (Bestellbestätigung)" },
  { key: "email_footer", label: "Fußzeile (alle E-Mails)" },
  { key: "shipping_days_de", label: "Lieferzeit Deutschland" },
  { key: "shipping_days_intl", label: "Lieferzeit Österreich/Schweiz" },
  { key: "return_policy", label: "Rückgabebedingungen" },
] as const;

type Field = { section: string } | { key: string; label: string };

export function TemplatesEditor({ settings }: Props) {
  const [values, setValues] = useState<Record<string, string>>(settings);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  async function handleSave(key: string) {
    setSaving(key);
    try {
      await fetch("/api/admin/templates", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value: values[key] }),
      });
      setSaved(key);
      setTimeout(() => setSaved(null), 2000);
    } finally {
      setSaving(null);
    }
  }

  const inputStyle: React.CSSProperties = {
    border: "1px solid #ddd",
    padding: "8px 10px",
    fontSize: 12,
    fontFamily: "monospace",
    width: "100%",
    boxSizing: "border-box",
    backgroundColor: "#fff",
  };

  return (
    <div>
      {(FIELDS as unknown as Field[]).map((field, i) => {
        if ("section" in field) {
          return (
            <div key={i} style={{ fontSize: 10, letterSpacing: 2, color: "#888", textTransform: "uppercase", marginTop: i === 0 ? 0 : 32, marginBottom: 16, borderBottom: "1px solid #e0e0e0", paddingBottom: 8 }}>
              {field.section}
            </div>
          );
        }

        return (
          <div key={field.key} style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 11, color: "#555", display: "block", marginBottom: 4 }}>
              {field.label}
            </label>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                style={inputStyle}
                value={values[field.key] ?? ""}
                onChange={e => setValues(v => ({ ...v, [field.key]: e.target.value }))}
                onKeyDown={e => { if (e.key === "Enter") handleSave(field.key); }}
              />
              <button
                onClick={() => handleSave(field.key)}
                disabled={saving === field.key}
                style={{
                  padding: "0 16px",
                  fontSize: 11,
                  border: "1px solid #1a1a1a",
                  backgroundColor: saved === field.key ? "#2d7a2d" : "#1a1a1a",
                  color: "#fff",
                  cursor: "pointer",
                  fontFamily: "monospace",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                {saved === field.key ? "✓" : saving === field.key ? "..." : "Speichern"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
