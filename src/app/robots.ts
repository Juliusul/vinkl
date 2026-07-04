import type { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vinkl.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/de/admin", "/en/admin", "/de/account", "/en/account", "/de/checkout", "/en/checkout"],
    },
    sitemap: `${BASE}/sitemap.xml`,
  };
}
