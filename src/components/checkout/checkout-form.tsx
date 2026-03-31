"use client";

import { useState, useCallback } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const stripePromise = typeof window !== "undefined" && process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;

const PRICE = 299;
const PRODUCT_NAME = "VINKL Teak Wandregal";
const PRODUCT_DESC = "80 × 25 × 30 cm · Teakholz massiv · stufenlos verstellbar";

// ─── Stripe payment step ──────────────────────────────────────────────────────
function PaymentForm({ locale, returnUrl, total }: { locale: string; returnUrl: string; total: number }) {
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
  }

  return (
    <form onSubmit={handleSubmit}>
      <p className="co-section-label">ZAHLUNGSMETHODE</p>
      <div style={{ marginBottom: 24 }}>
        <PaymentElement options={{ layout: "tabs", fields: { billingDetails: { name: "auto", email: "auto", address: "auto" } } }} />
      </div>
      {error && <div className="co-error">{error}</div>}
      <button type="submit" disabled={loading || !stripe} className="co-btn-primary">
        {loading ? "WIRD VERARBEITET …" : `JETZT KAUFEN — ${total} €`}
      </button>
      <p style={{ fontSize: 11, color: "#bbb", textAlign: "center", margin: "10px 0 0", fontFamily: "monospace" }}>
        🔒 SSL-verschlüsselt · Powered by Stripe
      </p>
    </form>
  );
}

// ─── Mini login widget ────────────────────────────────────────────────────────
function LoginWidget({ onLoggedIn }: { onLoggedIn: (name: string, email: string) => void }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const supabase = createSupabaseBrowserClient();
      const { data, error: err } = await supabase.auth.signInWithPassword({ email, password });
      if (err || !data.user) { setError("E-Mail oder Passwort falsch."); return; }
      const name = data.user.user_metadata?.name ?? "";
      onLoggedIn(name, data.user.email ?? email);
    } catch {
      setError("Anmeldung fehlgeschlagen.");
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <p style={{ fontSize: 12, color: "#888", margin: "0 0 28px", fontFamily: "monospace" }}>
        Bereits Kunde?{" "}
        <button onClick={() => setOpen(true)} style={{ background: "none", border: "none", color: "#1a1a1a", fontSize: 12, cursor: "pointer", textDecoration: "underline", padding: 0, fontFamily: "monospace" }}>
          Anmelden
        </button>
        {" "}um Daten vorauszufüllen.
      </p>
    );
  }

  return (
    <div style={{ border: "1px solid #e0d8d0", padding: "20px", marginBottom: 28, backgroundColor: "#fff" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <p style={{ fontSize: 10, letterSpacing: 2, color: "#888", textTransform: "uppercase", margin: 0, fontFamily: "monospace" }}>KONTO ANMELDEN</p>
        <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", fontSize: 18, color: "#aaa", cursor: "pointer", lineHeight: 1 }}>×</button>
      </div>
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: 12 }}>
          <input
            type="email" value={email} onChange={e => setEmail(e.target.value)} required
            placeholder="E-Mail" autoComplete="email"
            style={{ width: "100%", border: "1px solid #ddd", padding: "10px 12px", fontSize: 14, fontFamily: "Georgia, serif", boxSizing: "border-box", backgroundColor: "#fafafa" }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <input
            type="password" value={password} onChange={e => setPassword(e.target.value)} required
            placeholder="Passwort" autoComplete="current-password"
            style={{ width: "100%", border: "1px solid #ddd", padding: "10px 12px", fontSize: 14, fontFamily: "Georgia, serif", boxSizing: "border-box", backgroundColor: "#fafafa" }}
          />
        </div>
        {error && <p style={{ fontSize: 12, color: "#c00", margin: "0 0 10px", fontFamily: "monospace" }}>{error}</p>}
        <button type="submit" disabled={loading} style={{ width: "100%", backgroundColor: "#1a1a1a", color: "#fff", border: "none", padding: "11px", fontSize: 10, letterSpacing: 2, cursor: loading ? "not-allowed" : "pointer", fontFamily: "monospace", textTransform: "uppercase" }}>
          {loading ? "…" : "ANMELDEN"}
        </button>
      </form>
    </div>
  );
}

// ─── Order summary ────────────────────────────────────────────────────────────
function OrderSummary({ quantity, total, collapsible }: { quantity: number; total: number; collapsible?: boolean }) {
  const [open, setOpen] = useState(!collapsible);

  return (
    <div className="co-summary-box">
      {collapsible && (
        <button className="co-summary-toggle" onClick={() => setOpen(o => !o)}>
          <span style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "#888" }}>
            BESTELLÜBERSICHT
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontFamily: "monospace", fontSize: 13, color: "#1a1a1a", fontWeight: 600 }}>{total},00 €</span>
            <span style={{ fontSize: 10, color: "#aaa" }}>{open ? "▲" : "▼"}</span>
          </span>
        </button>
      )}
      {!collapsible && (
        <p style={{ fontSize: 10, letterSpacing: 2, color: "#888", textTransform: "uppercase", margin: "0 0 20px", fontFamily: "monospace" }}>
          BESTELLÜBERSICHT
        </p>
      )}
      {open && (
        <>
          <div style={{ display: "flex", gap: 14, marginBottom: 20 }}>
            <div style={{ width: 56, height: 56, backgroundColor: "#e8e0d8", flexShrink: 0 }} />
            <div>
              <p style={{ fontSize: 13, color: "#1a1a1a", margin: "0 0 3px", fontWeight: 500 }}>{PRODUCT_NAME}</p>
              <p style={{ fontSize: 11, color: "#888", margin: "0 0 3px", lineHeight: 1.5 }}>{PRODUCT_DESC}</p>
              <p style={{ fontSize: 11, color: "#888", margin: 0, fontFamily: "monospace" }}>Menge: {quantity}</p>
            </div>
          </div>
          <div style={{ borderTop: "1px solid #e0d8d0", paddingTop: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#888", marginBottom: 6, fontFamily: "monospace" }}>
              <span>Zwischensumme</span><span>{total},00 €</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#888", marginBottom: 12, fontFamily: "monospace" }}>
              <span>Versand</span><span>Kostenlos</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "#1a1a1a", fontWeight: 600, fontFamily: "monospace" }}>
              <span>GESAMT</span><span>{total},00 €</span>
            </div>
            <p style={{ fontSize: 10, color: "#aaa", margin: "6px 0 0", fontFamily: "monospace" }}>
              Inkl. 19% MwSt. · Rechnung per E-Mail
            </p>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Main checkout form ───────────────────────────────────────────────────────
interface Props { quantity: number; locale: string; siteUrl: string; }

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
  const [loggedIn, setLoggedIn] = useState(false);

  const total = PRICE * quantity;
  const returnUrl = `${siteUrl}/${locale}/checkout/success`;

  const handleLoggedIn = (n: string, e: string) => {
    if (n) setName(n);
    if (e) setEmail(e);
    setLoggedIn(true);
  };

  const handleInfoSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingIntent(true);
    setIntentError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity, locale, name, email, address: { line1, city, postal_code: postal, country } }),
      });
      const data = await res.json();
      if (!res.ok || !data.clientSecret) { setIntentError(data.detail ?? "Fehler beim Starten des Checkouts."); return; }
      setClientSecret(data.clientSecret);
      setStep("payment");
    } catch { setIntentError("Netzwerkfehler. Bitte versuche es erneut."); }
    finally { setLoadingIntent(false); }
  }, [quantity, locale, name, email, line1, city, postal, country]);

  return (
    <>
      {/* ── Responsive styles ── */}
      <style>{`
        .co-wrap {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0;
          max-width: 860px;
          margin: 0 auto;
          padding: 0;
          font-family: Georgia, serif;
        }
        .co-summary-mobile { display: block; }
        .co-summary-desktop { display: none; }
        .co-form-col { padding: 28px 20px 40px; }
        .co-summary-box { background: #f9f7f4; padding: 20px; }
        .co-summary-toggle {
          display: flex; justify-content: space-between; align-items: center;
          width: 100%; background: none; border: none; cursor: pointer; padding: 0; margin-bottom: 16px;
        }
        .co-section-label {
          font-size: 10px; letter-spacing: 2px; color: #888;
          text-transform: uppercase; margin: 0 0 14px; font-family: monospace;
        }
        .co-input {
          width: 100%; border: 1px solid #ddd; padding: 12px 14px;
          font-size: 15px; font-family: Georgia, serif; box-sizing: border-box;
          background: #fff; outline: none; color: #1a1a1a;
          -webkit-appearance: none; border-radius: 0;
        }
        .co-input:focus { border-color: #1a1a1a; }
        .co-label {
          font-size: 10px; letter-spacing: 2px; color: #888; display: block;
          margin-bottom: 6px; font-family: monospace; text-transform: uppercase;
        }
        .co-field { margin-bottom: 16px; }
        .co-row { display: grid; grid-template-columns: 110px 1fr; gap: 10px; margin-bottom: 16px; }
        .co-btn-primary {
          width: 100%; background: #1a1a1a; color: #fff; border: none;
          padding: 16px; font-size: 11px; letter-spacing: 3px;
          cursor: pointer; font-family: monospace; text-transform: uppercase;
          margin-top: 4px;
        }
        .co-btn-primary:disabled { background: #888; cursor: not-allowed; }
        .co-error {
          background: #fff0f0; border: 1px solid #ffcccc;
          padding: 12px 14px; margin-bottom: 16px;
          font-size: 12px; color: #c00; font-family: monospace;
        }
        .co-info-bar {
          background: #f9f7f4; padding: 14px 16px; margin-bottom: 28px;
          font-size: 13px; color: #555; line-height: 1.6;
          display: flex; justify-content: space-between; align-items: flex-start; gap: 12px;
        }
        .co-divider { border: none; border-top: 1px solid #e0d8d0; margin: 28px 0; }

        @media (min-width: 680px) {
          .co-form-col { padding: 36px 32px 48px; }
          .co-summary-box { padding: 24px; }
          .co-input { font-size: 14px; }
        }

        @media (min-width: 900px) {
          .co-wrap {
            grid-template-columns: 1fr 340px;
            gap: 0;
            padding: 0;
          }
          .co-summary-mobile { display: none; }
          .co-summary-desktop { display: block; }
          .co-form-col { padding: 48px 40px 48px; border-right: 1px solid #e0d8d0; }
          .co-summary-box {
            position: sticky; top: 0;
            height: 100vh; overflow-y: auto;
            padding: 48px 28px;
            background: #f9f7f4;
          }
          .co-summary-toggle { display: none; }
        }
      `}</style>

      <div className="co-wrap">
        {/* ── Mobile order summary (collapsible) ── */}
        <div className="co-summary-mobile">
          <OrderSummary quantity={quantity} total={total} collapsible />
        </div>

        {/* ── Form column ── */}
        <div className="co-form-col">
          {step === "info" ? (
            <form onSubmit={handleInfoSubmit}>
              {/* Login widget */}
              {!loggedIn && <LoginWidget onLoggedIn={handleLoggedIn} />}
              {loggedIn && (
                <p style={{ fontSize: 12, color: "#2d7a2d", marginBottom: 20, fontFamily: "monospace" }}>
                  ✓ Angemeldet · Daten wurden vorausgefüllt
                </p>
              )}

              <p className="co-section-label">KONTAKT</p>
              <div className="co-field">
                <label className="co-label">Name</label>
                <input className="co-input" type="text" value={name} onChange={e => setName(e.target.value)} required autoComplete="name" placeholder="Max Mustermann" />
              </div>
              <div className="co-field" style={{ marginBottom: 28 }}>
                <label className="co-label">E-Mail</label>
                <input className="co-input" type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" placeholder="max@mustermann.de" />
              </div>

              <hr className="co-divider" style={{ margin: "0 0 28px" }} />

              <p className="co-section-label">LIEFERADRESSE</p>
              <div className="co-field">
                <label className="co-label">Straße &amp; Hausnummer</label>
                <input className="co-input" type="text" value={line1} onChange={e => setLine1(e.target.value)} required autoComplete="street-address" placeholder="Musterstraße 1" />
              </div>
              <div className="co-row">
                <div>
                  <label className="co-label">PLZ</label>
                  <input className="co-input" type="text" value={postal} onChange={e => setPostal(e.target.value)} required autoComplete="postal-code" placeholder="10115" maxLength={10} inputMode="numeric" />
                </div>
                <div>
                  <label className="co-label">Stadt</label>
                  <input className="co-input" type="text" value={city} onChange={e => setCity(e.target.value)} required autoComplete="address-level2" placeholder="Berlin" />
                </div>
              </div>
              <div className="co-field" style={{ marginBottom: 28 }}>
                <label className="co-label">Land</label>
                <select className="co-input" style={{ cursor: "pointer" }} value={country} onChange={e => setCountry(e.target.value)}>
                  <option value="DE">Deutschland</option>
                  <option value="AT">Österreich</option>
                  <option value="CH">Schweiz</option>
                  <option value="LU">Luxemburg</option>
                  <option value="BE">Belgien</option>
                  <option value="NL">Niederlande</option>
                </select>
              </div>

              {intentError && <div className="co-error">{intentError}</div>}
              <button type="submit" disabled={loadingIntent} className="co-btn-primary">
                {loadingIntent ? "…" : "WEITER ZUR ZAHLUNG"}
              </button>
            </form>
          ) : (
            <div>
              {/* Summary bar of entered info */}
              <div className="co-info-bar">
                <div>
                  <strong style={{ color: "#1a1a1a" }}>{name}</strong> · {email}<br />
                  {line1}, {postal} {city}, {country}
                </div>
                <button onClick={() => setStep("info")} style={{ background: "none", border: "none", fontSize: 11, color: "#888", cursor: "pointer", textDecoration: "underline", fontFamily: "monospace", padding: 0, flexShrink: 0 }}>
                  Ändern
                </button>
              </div>

              {clientSecret && stripePromise && (
                <Elements stripe={stripePromise} options={{
                  clientSecret,
                  appearance: {
                    theme: "stripe",
                    variables: {
                      colorPrimary: "#1a1a1a", colorBackground: "#ffffff",
                      colorText: "#1a1a1a", colorDanger: "#c00",
                      fontFamily: "Georgia, serif", borderRadius: "0px", fontSizeBase: "15px",
                    },
                    rules: {
                      ".Input": { border: "1px solid #ddd", boxShadow: "none", padding: "12px 14px" },
                      ".Input:focus": { border: "1px solid #1a1a1a", boxShadow: "none" },
                      ".Label": { fontFamily: "monospace", fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: "#888" },
                      ".Tab": { border: "1px solid #ddd", boxShadow: "none", borderRadius: "0" },
                      ".Tab--selected": { border: "1px solid #1a1a1a", boxShadow: "none" },
                    },
                  },
                }}>
                  <PaymentForm locale={locale} returnUrl={returnUrl} total={total} />
                </Elements>
              )}
            </div>
          )}
        </div>

        {/* ── Desktop order summary sidebar ── */}
        <div className="co-summary-desktop">
          <OrderSummary quantity={quantity} total={total} />
        </div>
      </div>
    </>
  );
}
