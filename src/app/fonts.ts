import { Inter, Spectral } from "next/font/google";

/**
 * Type system — actually loaded, not relying on system fallbacks.
 *
 * Body / UI: Inter (the committed brand sans). Variable, antialiased.
 * Display:   Spectral — a warm, high-structure editorial serif that
 *            carries the "aged with dignity / architectural" voice at
 *            both hero and text sizes. Stands in for the licensed
 *            "PP Editorial New" (which still leads the CSS stack, so a
 *            self-hosted licence drops in without code changes).
 *
 * Both expose CSS variables consumed by the Tailwind `@theme` in
 * globals.css (`--font-sans`, `--font-serif`).
 */

export const sans = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const serif = Spectral({
  subsets: ["latin"],
  display: "swap",
  weight: ["200", "300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-spectral",
});
