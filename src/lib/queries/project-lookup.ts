import { prisma } from "@/lib/prisma";
import {
  generateUniqueProjectSlug,
  hasNonAsciiSlug,
  normalizeProjectSlugParam,
} from "@/lib/slug";
import { redirect } from "next/navigation";

type ProjectRecord = {
  id: string;
  slug: string;
  title: string;
};

export async function findProjectBySlugOrId(slugOrId: string) {
  const normalized = normalizeProjectSlugParam(slugOrId);
  const candidates = Array.from(new Set([slugOrId, normalized]));

  for (const candidate of candidates) {
    const bySlug = await prisma.project.findUnique({
      where: { slug: candidate },
    });

    if (bySlug) {
      return bySlug;
    }
  }

  const byId = await prisma.project.findUnique({
    where: { id: slugOrId },
  });

  if (byId) {
    return byId;
  }

  if (normalized !== slugOrId) {
    const byNormalizedId = await prisma.project.findUnique({
      where: { id: normalized },
    });

    if (byNormalizedId) {
      return byNormalizedId;
    }
  }

  return null;
}

export async function ensureAsciiProjectSlug(project: ProjectRecord) {
  if (!hasNonAsciiSlug(project.slug)) {
    return project;
  }

  const nextSlug = await generateUniqueProjectSlug(project.title, async (slug) => {
    const found = await prisma.project.findFirst({
      where: {
        slug,
        NOT: { id: project.id },
      },
      select: { id: true },
    });

    return Boolean(found);
  });

  const updated = await prisma.project.update({
    where: { id: project.id },
    data: { slug: nextSlug },
    select: { id: true, slug: true, title: true },
  });

  return updated;
}

export async function resolveProjectSlug(slugOrId: string) {
  const project = await findProjectBySlugOrId(slugOrId);

  if (!project) {
    return null;
  }

  const canonical = await ensureAsciiProjectSlug(project);
  const normalized = normalizeProjectSlugParam(slugOrId);
  const matchesCanonicalSlug =
    slugOrId === canonical.slug || normalized === canonical.slug;

  if (!matchesCanonicalSlug && slugOrId === canonical.id) {
    redirect(`/projects/${canonical.slug}`);
  }

  if (
    !matchesCanonicalSlug &&
    (slugOrId === project.slug || normalized === project.slug)
  ) {
    redirect(`/projects/${canonical.slug}`);
  }

  return canonical;
}
