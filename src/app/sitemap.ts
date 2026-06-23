import type { MetadataRoute } from "next";
import { APP_LOCALES } from "@/lib/i18n/config";
import { localizedPath } from "@/lib/i18n/routing";
import { prisma } from "@/lib/prisma";
import { absoluteUrl } from "@/lib/seo";

/** Generated at request time so build succeeds without a live database. */
export const dynamic = "force-dynamic";

const PUBLIC_PATHS = [
  { path: "/", changeFrequency: "daily" as const, priority: 1 },
  { path: "/projects", changeFrequency: "hourly" as const, priority: 0.9 },
  { path: "/freelancers", changeFrequency: "hourly" as const, priority: 0.9 },
  { path: "/pricing", changeFrequency: "weekly" as const, priority: 0.8 },
  { path: "/about", changeFrequency: "monthly" as const, priority: 0.6 },
  { path: "/faq", changeFrequency: "monthly" as const, priority: 0.7 },
  { path: "/contact", changeFrequency: "monthly" as const, priority: 0.5 },
  { path: "/register", changeFrequency: "monthly" as const, priority: 0.6 },
  { path: "/login", changeFrequency: "monthly" as const, priority: 0.4 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = APP_LOCALES.flatMap((locale) =>
    PUBLIC_PATHS.map(({ path, changeFrequency, priority }) => ({
      url: absoluteUrl(localizedPath(locale, path)),
      lastModified: new Date(),
      changeFrequency,
      priority,
    })),
  );

  let projects: { slug: string; updatedAt: Date }[] = [];
  let freelancers: { id: string; updatedAt: Date }[] = [];
  let categories: { slug: string }[] = [];

  try {
    [projects, freelancers, categories] = await Promise.all([
      prisma.project.findMany({
        where: { status: "OPEN" },
        select: { slug: true, updatedAt: true },
        orderBy: { updatedAt: "desc" },
        take: 5000,
      }),
      prisma.user.findMany({
        where: { role: "FREELANCER", freelancerProfile: { isNot: null } },
        select: { id: true, updatedAt: true },
        take: 5000,
      }),
      prisma.category.findMany({ select: { slug: true } }),
    ]);
  } catch {
    // Database unavailable — return static pages only.
  }

  const projectPages = APP_LOCALES.flatMap((locale) =>
    projects.map((project) => ({
      url: absoluteUrl(localizedPath(locale, `/projects/${project.slug}`)),
      lastModified: project.updatedAt,
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
  );

  const freelancerPages = APP_LOCALES.flatMap((locale) =>
    freelancers.map((freelancer) => ({
      url: absoluteUrl(localizedPath(locale, `/freelancers/${freelancer.id}`)),
      lastModified: freelancer.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  );

  const categoryPages = APP_LOCALES.flatMap((locale) =>
    categories.map((category) => ({
      url: absoluteUrl(localizedPath(locale, `/projects?category=${category.slug}`)),
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.6,
    })),
  );

  return [...staticPages, ...projectPages, ...freelancerPages, ...categoryPages];
}
