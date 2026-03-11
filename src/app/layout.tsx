import type { ReactNode } from "react";

/**
 * Root layout — minimal shell.
 *
 * The actual <html lang="..."> tag with locale-specific metadata
 * lives in app/[locale]/layout.tsx. This root layout exists because
 * Next.js requires it, but delegates everything to the locale layout.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
