import { prisma } from "@/lib/prisma";
import type { AppLocale } from "@/lib/i18n/types";

export type CmsPageItem = {
  id: string;
  slug: string;
  locale: string;
  title: string;
  body: string;
  updatedAt: string;
};

export async function getCmsPages(): Promise<CmsPageItem[]> {
  const pages = await prisma.cmsPage.findMany({
    orderBy: [{ slug: "asc" }, { locale: "asc" }],
  });

  return pages.map((page) => ({
    ...page,
    updatedAt: page.updatedAt.toISOString(),
  }));
}

export async function getCmsPageBySlug(slug: string, locale: AppLocale) {
  return prisma.cmsPage.findUnique({
    where: { slug_locale: { slug, locale } },
    select: { title: true, body: true, updatedAt: true },
  });
}
