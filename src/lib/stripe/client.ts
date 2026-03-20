import Stripe from "stripe";

// Use a build-time placeholder so the module loads during `next build`
// even when env vars are not yet available. The real key is always
// present at runtime (Vercel injects env vars before request handling).
export const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY ?? "sk_placeholder_build_only",
  { apiVersion: "2026-02-25.clover" }
);
