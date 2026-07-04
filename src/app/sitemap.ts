import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vinkl.vercel.app";

/** Public, indexable routes (locale-prefixed). */
const ROUTES: Array<{ path: string; priority: number; changeFrequency: "weekly" | "monthly" }> = [
  { path: "", priority: 1, changeFrequency: "weekly" },
  { path: "/objects", priority: 0.9, changeFrequency: "weekly" },
  { path: "/objects/vinkl", priority: 0.9, changeFrequency: "weekly" },
  { path: "/journal", priority: 0.6, changeFrequency: "monthly" },
  { path: "/journal/winkel-messen", priority: 0.6, changeFrequency: "monthly" },
  { path: "/about", priority: 0.5, changeFrequency: "monthly" },
  { path: "/legal/imprint", priority: 0.1, changeFrequency: "monthly" },
  { path: "/legal/privacy", priority: 0.1, changeFrequency: "monthly" },
  { path: "/legal/terms", priority: 0.1, changeFrequency: "monthly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.flatMap(({ path, priority, changeFrequency }) =>
    routing.locales.map((locale) => ({
      url: `${BASE}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency,
      priority,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((l) => [l, `${BASE}/${l}${path}`]),
        ),
      },
    })),
  );
}
