"use client";

import { useCallback, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

interface Props {
  quantity: number;
  locale: string;
}

export function EmbeddedCheckoutForm({ quantity, locale }: Props) {
  const [error, setError] = useState<string | null>(null);

  const fetchClientSecret = useCallback(async () => {
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity, locale }),
      });
      const data = await res.json();
      if (!res.ok || !data.clientSecret) {
        setError("Checkout konnte nicht gestartet werden. Bitte versuche es erneut.");
        return "";
      }
      return data.clientSecret as string;
    } catch {
      setError("Netzwerkfehler. Bitte versuche es erneut.");
      return "";
    }
  }, [quantity, locale]);

  if (!stripePromise) {
    return (
      <div style={{ textAlign: "center", padding: "80px 0", color: "#888", fontSize: 13 }}>
        Stripe ist nicht konfiguriert. Bitte{" "}
        <code>NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</code> in Vercel setzen und neu deployen.
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "80px 0" }}>
        <p style={{ color: "#c00", fontSize: 14, marginBottom: 16 }}>{error}</p>
        <button
          onClick={() => setError(null)}
          style={{ padding: "10px 24px", backgroundColor: "#1a1a1a", color: "#fff", border: "none", cursor: "pointer", fontSize: 11, letterSpacing: 2 }}
        >
          NOCHMAL VERSUCHEN
        </button>
      </div>
    );
  }

  return (
    <EmbeddedCheckoutProvider
      stripe={stripePromise}
      options={{ fetchClientSecret }}
    >
      <EmbeddedCheckout />
    </EmbeddedCheckoutProvider>
  );
}
