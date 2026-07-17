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
import { Analytics } from "@vercel/analytics/react";
import { CartProvider } from "@/contexts/cart-context";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { heading, sans, serif } from "../fonts";
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
      process.env.NEXT_PUBLIC_SITE_URL ?? "https://vinkl.vercel.app",
    ),
    alternates: {
      languages: {
        de: "/de",
        en: "/en",
      },
    },
    openGraph: {
      type: "website",
      siteName: "VINKL",
      title: meta.title,
      description: meta.description,
      locale: locale === "de" ? "de_DE" : "en_US",
      images: [
        {
          url: "/og.jpg",
          width: 1200,
          height: 630,
          alt: "VINKL — Teak corner shelf",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: ["/og.jpg"],
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
    <html lang={locale} className={`${sans.variable} ${serif.variable} ${heading.variable}`}>
      <body className="flex min-h-screen flex-col bg-bg-cream text-ink-primary font-sans antialiased">
        <NextIntlClientProvider>
          <CartProvider>
            <Header navItems={navItems} />
            <main className="flex-1">{children}</main>
            <Footer />
            <CartDrawer />
          </CartProvider>
          <CookieConsent />
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
