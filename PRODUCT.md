# PRODUCT.md — VINKL

> Captured from `ai/sessions/session-2026-02-23.md` and the live codebase. Register: **brand** (design IS the product — an editorial product/brand site, not an app UI).

## What it is

VINKL is a European architectural furniture brand (formerly WINKL). The flagship — and currently only — product is an **adjustable teak corner wall shelf** that flexes from 85° to 95° to fit imperfect walls. €299. The site is a single-product editorial storefront: it sells one object the way a gallery presents one piece.

## Who it's for

Design-literate buyers of premium home objects — people who care about material honesty, craft, and rooms with character ("schiefe Wände, gewachsene Ecken"). Bilingual DE (default) / EN audience, Europe.

## Voice — three words

**Architectural · honest · quietly confident.** Not loud, not minimalist-for-its-own-sake. The copy speaks in short declaratives ("Deine Wände sind nicht gerade. Unsere Regale wissen das."). Restraint that reads as taste, never as emptiness.

## Surfaces

- `/[locale]` — homepage, 7 editorial sections (hero → philosophy → featured object → adapts → angle → material → future). The hero is a scroll-driven product film (`hero-cinema.tsx`): a 300vh runway scrubs a dolly-in from the wide room to the shelf close-up; 4K/720p variants in `public/videos/`.
- `/[locale]/objects` + `/objects/vinkl` — product detail (gallery, story, specs, use-cases, purchase panel, sticky mobile CTA)
- `/[locale]/journal` — editorial index
- `/[locale]/about` — 6-section brand narrative
- `/[locale]/account/*`, `/admin/*`, `/checkout/*` — account, custom checkout, order management (functional app surfaces)

## Stack

Next.js 16 App Router · TypeScript · Tailwind CSS v4 (`@theme inline` tokens) · next-intl (DE/EN, `localePrefix: always`) · Supabase (auth/orders) · Stripe (custom checkout) · Resend (mail). Shopify layer scaffolded behind a mapper pattern but using static fallback data (`src/data/products/vinkl.ts`).

## Non-negotiables

- **Identity is committed and preserved**: cream `#F5F0EB` body, terracotta `#E8630A` accent, ink `#2C2C2E`; serif display + sans body; `border-radius: 0` everywhere; 4px spacing rhythm.
- Bilingual — every string lives in `src/messages/{de,en}.json`; never hard-code copy.
- `prefers-reduced-motion` respected globally.
- Images are localized (`images` translation namespace for alt text) and WebP-optimized.

## Known gaps (from session log)

Shopify not connected (static fallback); no mobile hamburger nav; journal entries are teasers (no article pages).
