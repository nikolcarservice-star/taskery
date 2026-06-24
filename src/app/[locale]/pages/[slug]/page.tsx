import { getDictionary } from "@/lib/i18n/dictionary";
import { requireAppLocale } from "@/lib/i18n/locale-page";
import { createMetadata } from "@/lib/metadata";
import { getCmsPageBySlug } from "@/lib/queries/admin-cms";
import { notFound } from "next/navigation";

type CmsPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: CmsPageProps) {
  const locale = await requireAppLocale(params);
  const dict = await getDictionary(locale);
  const { slug } = await params;
  const page = await getCmsPageBySlug(slug, locale);

  if (!page) {
    return createMetadata({
      title: dict.meta.pageNotFound.title,
      description: dict.meta.pageNotFound.description,
      path: `/pages/${slug}`,
      locale,
      noIndex: true,
    });
  }

  return createMetadata({
    title: page.title,
    description: page.title,
    path: `/pages/${slug}`,
    locale,
  });
}

export default async function CmsPage({ params }: CmsPageProps) {
  const locale = await requireAppLocale(params);
  const { slug } = await params;
  const page = await getCmsPageBySlug(slug, locale);

  if (!page) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-bold text-zinc-900">{page.title}</h1>
      <article
        className="prose prose-zinc mt-8 max-w-none whitespace-pre-wrap"
        dangerouslySetInnerHTML={{ __html: page.body }}
      />
    </div>
  );
}
