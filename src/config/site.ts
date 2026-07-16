import type { Locale } from "./i18n";

export const siteConfig = {
  name: "VINKL",
  url: "https://vinkl-design.de",
  defaultLocale: "de" as Locale,
} as const;

/**
 * Launch state — flips the site from pre-order to in-stock.
 * Set `preOrder: false` on launch day (early August 2026); the
 * product schema and availability messaging read from here.
 */
export const launchConfig = {
  preOrder: true,
  availabilityStarts: "2026-08-01",
} as const;

export const siteMetadata: Record<Locale, { title: string; description: string }> = {
  de: {
    title: "VINKL — Möbel und Objekte",
    description: "Architektonische Möbel und Objekte für den modernen Wohnraum.",
  },
  en: {
    title: "VINKL — Furniture and Objects",
    description: "Architectural furniture and objects for modern living.",
  },
};
