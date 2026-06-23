import { ProjectForm } from "@/components/ProjectForm";
import { getDictionary } from "@/lib/i18n/dictionary";
import { requireAppLocale } from "@/lib/i18n/locale-page";
import { localizedPath } from "@/lib/i18n/routing";
import { createMetadata } from "@/lib/metadata";
import { prisma } from "@/lib/prisma";
import { requireClient } from "@/lib/session";

type NewProjectPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: NewProjectPageProps) {
  const locale = await requireAppLocale(params);
  const dict = await getDictionary(locale);
  const p = dict.pages.client.projects.newPage;

  return createMetadata({
    title: p.title,
    description: p.intro,
    path: "/client/projects/new",
    locale,
    noIndex: true,
  });
}

export default async function ClientNewProjectPage({ params }: NewProjectPageProps) {
  const locale = await requireAppLocale(params);
  const dict = await getDictionary(locale);
  const p = dict.pages.client.projects.newPage;

  await requireClient(localizedPath(locale, "/client/projects/new"));

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
      <h1 className="text-2xl font-bold text-zinc-900">{p.title}</h1>
      <p className="mt-2 text-sm text-zinc-600">{p.intro}</p>

      {categories.length === 0 ? (
        <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
          {p.noCategories}
        </div>
      ) : (
        <div className="mt-8">
          <ProjectForm categories={categories} />
        </div>
      )}
    </div>
  );
}
