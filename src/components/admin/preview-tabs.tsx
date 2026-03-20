"use client";

import { useState } from "react";

interface Tab {
  key: string;
  label: string;
  kind: "email" | "pdf";
  html?: string;
  pdfUrl?: string;
}

interface Props {
  tabs: Tab[];
}

export function PreviewTabs({ tabs }: Props) {
  const [active, setActive] = useState(tabs[0]?.key ?? "");

  const current = tabs.find((t) => t.key === active);

  return (
    <div>
      {/* Tab bar */}
      <div style={{
        display: "flex",
        gap: 0,
        borderBottom: "1px solid #e0e0e0",
        marginBottom: 24,
        flexWrap: "wrap",
      }}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActive(tab.key)}
            style={{
              background: "none",
              border: "none",
              borderBottom: active === tab.key ? "2px solid #1a1a1a" : "2px solid transparent",
              padding: "10px 20px",
              fontSize: 11,
              letterSpacing: 1,
              fontFamily: "monospace",
              color: active === tab.key ? "#1a1a1a" : "#888",
              cursor: "pointer",
              textTransform: "uppercase",
              marginBottom: -1,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Badge showing type */}
      {current && (
        <div style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{
            fontSize: 9,
            letterSpacing: 2,
            textTransform: "uppercase",
            backgroundColor: current.kind === "pdf" ? "#e8f0fe" : "#f0f9e8",
            color: current.kind === "pdf" ? "#2d5ab4" : "#2d7a2d",
            padding: "3px 8px",
            borderRadius: 2,
          }}>
            {current.kind === "pdf" ? "PDF" : "E-Mail HTML"}
          </span>
          <span style={{ fontSize: 11, color: "#aaa" }}>
            {current.kind === "pdf"
              ? "Rechnung wird als A4-PDF gerendert (Musterdaten)"
              : "E-Mail-Vorlage mit Musterdaten — so sieht der Kunde die Mail"}
          </span>
        </div>
      )}

      {/* Preview frame */}
      {current?.kind === "email" && current.html && (
        <div style={{
          border: "1px solid #e0e0e0",
          borderRadius: 4,
          overflow: "hidden",
          backgroundColor: "#f5f5f5",
          padding: 16,
        }}>
          <iframe
            srcDoc={current.html}
            style={{
              width: "100%",
              height: 680,
              border: "none",
              borderRadius: 2,
              display: "block",
            }}
            title={`Vorschau: ${current.label}`}
          />
        </div>
      )}

      {current?.kind === "pdf" && current.pdfUrl && (
        <div style={{
          border: "1px solid #e0e0e0",
          borderRadius: 4,
          overflow: "hidden",
          backgroundColor: "#f5f5f5",
          padding: 16,
        }}>
          <object
            data={current.pdfUrl}
            type="application/pdf"
            style={{
              width: "100%",
              height: 840,
              border: "none",
              borderRadius: 2,
              display: "block",
            }}
          >
            {/* Fallback wenn Browser kein PDF-Plugin hat */}
            <div style={{ padding: 32, textAlign: "center", color: "#888" }}>
              <p style={{ marginBottom: 12, fontSize: 13 }}>PDF kann nicht direkt angezeigt werden.</p>
              <a
                href={current.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-block",
                  backgroundColor: "#1a1a1a",
                  color: "#fff",
                  padding: "10px 20px",
                  fontSize: 11,
                  letterSpacing: 1,
                  textDecoration: "none",
                  fontFamily: "monospace",
                }}
              >
                PDF IN NEUEM TAB ÖFFNEN ↗
              </a>
            </div>
          </object>
          <div style={{ marginTop: 12, textAlign: "center", display: "flex", gap: 24, justifyContent: "center" }}>
            <a
              href={current.pdfUrl}
              download="Rechnung-Vorschau.pdf"
              style={{ fontSize: 11, color: "#888", textDecoration: "underline", fontFamily: "monospace", letterSpacing: 1 }}
            >
              PDF herunterladen
            </a>
            <a
              href={current.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: 11, color: "#888", textDecoration: "underline", fontFamily: "monospace", letterSpacing: 1 }}
            >
              In neuem Tab öffnen ↗
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
