"use client";

import { useState, useCallback } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = typeof window !== "undefined" && process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;

const PRICE = 299;
const PRODUCT_NAME = "VINKL Teak Wandregal";
const PRODUCT_DESC = "80 × 25 × 30 cm · Teakholz massiv · stufenlos verstellbar";

// ─── Inner form (has access to Stripe hooks) ──────────────────────────────────
function PaymentForm({ locale, returnUrl }: { locale: string; returnUrl: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    setError(null);

    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: returnUrl },
    });

    if (confirmError) {
      setError(confirmError.message ?? "Zahlung fehlgeschlagen.");
      setLoading(false);
    }
    // On success Stripe redirects — no need to setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 10, letterSpacing: 2, color: "#888", textTransform: "uppercase", margin: "0 0 12px", fontFamily: "monospace" }}>
          ZAHLUNGSMETHODE
        </p>
        <PaymentElement
          options={{
            layout: "tabs",
            fields: { billingDetails: { name: "auto", email: "auto", address: "auto" } },
          }}
        />
      </div>

      {error && (
        <div style={{ backgroundColor: "#fff0f0", border: "1px solid #ffcccc", padding: "12px 16px", marginBottom: 20, fontSize: 13, color: "#c00", fontFamily: "monospace" }}>
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !stripe}
        style={{
          width: "100%",
          backgroundColor: loading ? "#888" : "#1a1a1a",
          color: "#fff",
          border: "none",
          padding: "16px",
          fontSize: 11,
          letterSpacing: 3,
          cursor: loading ? "not-allowed" : "pointer",
          fontFamily: "monospace",
          textTransform: "uppercase",
          transition: "background-color 0.2s",
        }}
      >
        {loading ? "WIRD VERARBEITET …" : `JETZT KAUFEN — ${PRICE} €`}
      </button>

      <p style={{ fontSize: 11, color: "#aaa", textAlign: "center", margin: "12px 0 0", fontFamily: "monospace" }}>
        🔒 SSL-verschlüsselt · Powered by Stripe
      </p>
    </form>
  );
}

// ─── Outer form (collects customer data, then creates PaymentIntent) ──────────
interface Props {
  quantity: number;
  locale: string;
  siteUrl: string;
}

export function CheckoutForm({ quantity, locale, siteUrl }: Props) {
  const [step, setStep] = useState<"info" | "payment">("info");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loadingIntent, setLoadingIntent] = useState(false);
  const [intentError, setIntentError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [line1, setLine1] = useState("");
  const [city, setCity] = useState("");
  const [postal, setPostal] = useState("");
  const [country, setCountry] = useState("DE");

  const total = PRICE * quantity;

  const handleInfoSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingIntent(true);
    setIntentError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quantity,
          locale,
          name,
          email,
          address: { line1, city, postal_code: postal, country },
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.clientSecret) {
        setIntentError(data.detail ?? "Fehler beim Starten des Checkouts.");
        return;
      }
      setClientSecret(data.clientSecret);
      setStep("payment");
    } catch {
      setIntentError("Netzwerkfehler. Bitte versuche es erneut.");
    } finally {
      setLoadingIntent(false);
    }
  }, [quantity, locale, name, email, line1, city, postal, country]);

  const input: React.CSSProperties = {
    width: "100%", border: "1px solid #ddd", padding: "11px 14px",
    fontSize: 14, fontFamily: "Georgia, serif", boxSizing: "border-box",
    backgroundColor: "#fff", outline: "none", color: "#1a1a1a",
  };
  const label: React.CSSProperties = {
    fontSize: 10, letterSpacing: 2, color: "#888", display: "block",
    marginBottom: 5, fontFamily: "monospace", textTransform: "uppercase",
  };
  const field: React.CSSProperties = { marginBottom: 16 };

  const returnUrl = `${siteUrl}/${locale}/checkout/success`;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 48, maxWidth: 900, margin: "0 auto", padding: "40px 24px", fontFamily: "Georgia, serif" }}>

      {/* ── Left: form ─────────────────────────────── */}
      <div>
        {step === "info" ? (
          <form onSubmit={handleInfoSubmit}>
            <p style={{ fontSize: 10, letterSpacing: 2, color: "#888", textTransform: "uppercase", margin: "0 0 16px", fontFamily: "monospace" }}>
              KONTAKT
            </p>
            <div style={field}>
              <label style={label}>Name</label>
              <input style={input} type="text" value={name} onChange={e => setName(e.target.value)} required autoComplete="name" placeholder="Max Mustermann" />
            </div>
            <div style={{ ...field, marginBottom: 32 }}>
              <label style={label}>E-Mail</label>
              <input style={input} type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" placeholder="max@mustermann.de" />
            </div>

            <p style={{ fontSize: 10, letterSpacing: 2, color: "#888", textTransform: "uppercase", margin: "0 0 16px", fontFamily: "monospace" }}>
              LIEFERADRESSE
            </p>
            <div style={field}>
              <label style={label}>Straße &amp; Hausnummer</label>
              <input style={input} type="text" value={line1} onChange={e => setLine1(e.target.value)} required autoComplete="street-address" placeholder="Musterstraße 1" />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 12, marginBottom: 16 }}>
              <div>
                <label style={label}>PLZ</label>
                <input style={input} type="text" value={postal} onChange={e => setPostal(e.target.value)} required autoComplete="postal-code" placeholder="10115" maxLength={10} />
              </div>
              <div>
                <label style={label}>Stadt</label>
                <input style={input} type="text" value={city} onChange={e => setCity(e.target.value)} required autoComplete="address-level2" placeholder="Berlin" />
              </div>
            </div>
            <div style={{ ...field, marginBottom: 32 }}>
              <label style={label}>Land</label>
              <select style={{ ...input, cursor: "pointer" }} value={country} onChange={e => setCountry(e.target.value)}>
                <option value="DE">Deutschland</option>
                <option value="AT">Österreich</option>
                <option value="CH">Schweiz</option>
                <option value="LU">Luxemburg</option>
                <option value="BE">Belgien</option>
                <option value="NL">Niederlande</option>
              </select>
            </div>

            {intentError && (
              <div style={{ backgroundColor: "#fff0f0", border: "1px solid #ffcccc", padding: "12px 16px", marginBottom: 16, fontSize: 13, color: "#c00", fontFamily: "monospace" }}>
                {intentError}
              </div>
            )}

            <button
              type="submit"
              disabled={loadingIntent}
              style={{ width: "100%", backgroundColor: loadingIntent ? "#888" : "#1a1a1a", color: "#fff", border: "none", padding: "16px", fontSize: 11, letterSpacing: 3, cursor: loadingIntent ? "not-allowed" : "pointer", fontFamily: "monospace", textTransform: "uppercase" }}
            >
              {loadingIntent ? "…" : "WEITER ZUR ZAHLUNG"}
            </button>
          </form>
        ) : (
          <div>
            {/* Summary of entered info */}
            <div style={{ backgroundColor: "#f9f7f4", padding: "16px 20px", marginBottom: 32, fontSize: 13, color: "#555", lineHeight: 1.7 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <strong style={{ color: "#1a1a1a" }}>{name}</strong> · {email}<br />
                  {line1}, {postal} {city}, {country}
                </div>
                <button
                  onClick={() => setStep("info")}
                  style={{ background: "none", border: "none", fontSize: 11, color: "#888", cursor: "pointer", textDecoration: "underline", fontFamily: "monospace", padding: 0, whiteSpace: "nowrap" }}
                >
                  Ändern
                </button>
              </div>
            </div>

            {clientSecret && stripePromise && (
              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret,
                  appearance: {
                    theme: "stripe",
                    variables: {
                      colorPrimary: "#1a1a1a",
                      colorBackground: "#ffffff",
                      colorText: "#1a1a1a",
                      colorDanger: "#c00",
                      fontFamily: "Georgia, serif",
                      borderRadius: "0px",
                      fontSizeBase: "14px",
                    },
                    rules: {
                      ".Input": { border: "1px solid #ddd", boxShadow: "none", padding: "11px 14px" },
                      ".Input:focus": { border: "1px solid #1a1a1a", boxShadow: "none" },
                      ".Label": { fontFamily: "monospace", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#888" },
                      ".Tab": { border: "1px solid #ddd", boxShadow: "none" },
                      ".Tab--selected": { border: "1px solid #1a1a1a", boxShadow: "none" },
                    },
                  },
                }}
              >
                <PaymentForm locale={locale} returnUrl={returnUrl} />
              </Elements>
            )}
          </div>
        )}
      </div>

      {/* ── Right: order summary ────────────────────── */}
      <div>
        <div style={{ position: "sticky", top: 32, backgroundColor: "#f9f7f4", padding: "28px 24px" }}>
          <p style={{ fontSize: 10, letterSpacing: 2, color: "#888", textTransform: "uppercase", margin: "0 0 20px", fontFamily: "monospace" }}>
            BESTELLÜBERSICHT
          </p>
          <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
            <div style={{ width: 64, height: 64, backgroundColor: "#e8e0d8", flexShrink: 0 }} />
            <div>
              <p style={{ fontSize: 13, color: "#1a1a1a", margin: "0 0 4px", fontWeight: 500 }}>{PRODUCT_NAME}</p>
              <p style={{ fontSize: 11, color: "#888", margin: "0 0 4px", lineHeight: 1.5 }}>{PRODUCT_DESC}</p>
              <p style={{ fontSize: 11, color: "#888", margin: 0, fontFamily: "monospace" }}>Menge: {quantity}</p>
            </div>
          </div>
          <div style={{ borderTop: "1px solid #e0d8d0", paddingTop: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#888", marginBottom: 8, fontFamily: "monospace" }}>
              <span>Zwischensumme</span>
              <span>{total},00 €</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#888", marginBottom: 16, fontFamily: "monospace" }}>
              <span>Versand</span>
              <span>Kostenlos</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, color: "#1a1a1a", fontWeight: 500, fontFamily: "monospace" }}>
              <span>GESAMT</span>
              <span>{total},00 €</span>
            </div>
            <p style={{ fontSize: 10, color: "#aaa", margin: "8px 0 0", fontFamily: "monospace" }}>
              Inkl. 19% MwSt. · Rechnung per E-Mail
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
