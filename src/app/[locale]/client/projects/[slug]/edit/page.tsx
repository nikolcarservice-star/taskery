import { ProjectEditForm } from "@/components/ProjectEditForm";
import { getDictionary } from "@/lib/i18n/dictionary";
import { requireAppLocale } from "@/lib/i18n/locale-page";
import { localizedPath } from "@/lib/i18n/routing";
import { createMetadata } from "@/lib/metadata";
import { prisma } from "@/lib/prisma";
import { resolveProjectSlug } from "@/lib/queries/project-lookup";
import { requireClient } from "@/lib/session";
import { stripeEnabled } from "@/lib/stripe-config";
import { notFound, redirect } from "next/navigation";

type EditPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: EditPageProps) {
  const locale = await requireAppLocale(params);
  const dict = await getDictionary(locale);
  const p = dict.pages.client.projects.editPage;

  return createMetadata({
    title: p.title,
    description: p.title,
    path: "/client/projects",
    locale,
    noIndex: true,
  });
}

export default async function ClientEditProjectPage({ params }: EditPageProps) {
  const locale = await requireAppLocale(params);
  const dict = await getDictionary(locale);
  const p = dict.pages.client.projects.editPage;
  const l = (path: string) => localizedPath(locale, path);
  const session = await requireClient(l("/client/projects"));
  const { slug: slugOrId } = await params;

  const resolved = await resolveProjectSlug(slugOrId);
  if (!resolved) notFound();

  const project = await prisma.project.findUnique({
    where: { id: resolved.id },
  });

  if (!project) notFound();

  if (
    project.clientId !== session.user.id &&
    session.user.role !== "ADMIN"
  ) {
    redirect(l("/client/projects"));
  }

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
      <h1 className="text-2xl font-bold text-zinc-900">{p.title}</h1>
      <p className="mt-2 text-sm text-zinc-600">{project.title}</p>

      <div className="mt-8">
        <ProjectEditForm
          project={project}
          categories={categories}
          stripeEnabled={stripeEnabled}
        />
      </div>
    </div>
  );
}
