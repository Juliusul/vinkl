import type { ReactNode } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { siteMetadata } from "@/config/site";
import type { Locale } from "@/config/i18n";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CookieConsent } from "@/components/ui/cookie-consent";
import "../globals.css";

// ── Static params for all locales ──

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// ── Dynamic metadata per locale ──

type MetadataProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: MetadataProps): Promise<Metadata> {
  const { locale } = await params;
  const meta = siteMetadata[locale as Locale] ?? siteMetadata.de;

  return {
    title: {
      default: meta.title,
      template: `%s — VINKL`,
    },
    description: meta.description,
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
    ),
    alternates: {
      languages: {
        de: "/de",
        en: "/en",
      },
    },
  };
}

// ── Layout ──

type LayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "common" });

  // Navigation labels derived from translations
  const navItems = [
    { href: "/objects", label: t("nav.objects") },
    { href: "/journal", label: t("nav.journal") },
    { href: "/about", label: t("nav.about") },
  ];

  return (
    <html lang={locale}>
      <body className="flex min-h-screen flex-col bg-bg-cream text-ink-primary font-sans antialiased">
        <NextIntlClientProvider>
          <Header navItems={navItems} />
          <main className="flex-1">{children}</main>
          <Footer />
          <CookieConsent />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
