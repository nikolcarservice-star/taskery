import { prisma } from "@/lib/prisma";

export type AdminCategoryItem = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  skillCount: number;
  projectCount: number;
};

export type AdminSkillItem = {
  id: string;
  name: string;
  slug: string;
  categoryId: string | null;
  categoryName: string | null;
  freelancerCount: number;
};

export async function getAdminCatalogOverview() {
  const [categories, skills] = await Promise.all([
    prisma.category.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: { select: { skills: true, projects: true } },
      },
    }),
    prisma.skill.findMany({
      orderBy: { name: "asc" },
      include: {
        category: { select: { id: true, name: true } },
        _count: { select: { freelancers: true } },
      },
    }),
  ]);

  return {
    categories: categories.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      skillCount: category._count.skills,
      projectCount: category._count.projects,
    })),
    skills: skills.map((skill) => ({
      id: skill.id,
      name: skill.name,
      slug: skill.slug,
      categoryId: skill.categoryId,
      categoryName: skill.category?.name ?? null,
      freelancerCount: skill._count.freelancers,
    })),
  };
}
