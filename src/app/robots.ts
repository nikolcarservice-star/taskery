import { APP_LOCALES } from "@/lib/i18n/config";
import { siteConfig } from "@/lib/seo";
import type { MetadataRoute } from "next";

const PRIVATE_SEGMENTS = [
  "admin",
  "cabinet",
  "api",
  "profile",
  "dashboard",
  "client",
  "messages",
  "billing",
  "notifications",
];

function localizedPrivatePaths(): string[] {
  const paths = new Set<string>([
    "/admin",
    "/cabinet",
    "/api/",
    "/profile/edit",
    "/dashboard/",
    "/messages/",
    "/billing/",
  ]);

  for (const locale of APP_LOCALES) {
    for (const segment of PRIVATE_SEGMENTS) {
      if (segment === "api") {
        paths.add(`/${locale}/api/`);
        continue;
      }
      paths.add(`/${locale}/${segment}/`);
      if (segment === "profile") {
        paths.add(`/${locale}/profile/edit`);
      }
    }
  }

  return [...paths];
}

export default function robots(): MetadataRoute.Robots {
  const base = siteConfig.url;

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: localizedPrivatePaths(),
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
