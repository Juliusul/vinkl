import type { Locale } from "./i18n";

export const siteConfig = {
  name: "VINKL",
  url: "https://vinkl.com",
  defaultLocale: "de" as Locale,
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
