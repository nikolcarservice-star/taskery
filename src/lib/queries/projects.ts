import { Prisma } from "@/generated/prisma/client";

export type ProjectSearchParams = {
  q?: string;
  category?: string;
  minBudget?: string;
  maxBudget?: string;
  sort?: string;
};

export function buildOpenProjectsWhere(
  params: ProjectSearchParams,
): Prisma.ProjectWhereInput {
  const conditions: Prisma.ProjectWhereInput[] = [{ status: "OPEN" }];

  const query = params.q?.trim();
  if (query) {
    conditions.push({
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ],
    });
  }

  if (params.category) {
    conditions.push({ categoryId: params.category });
  }

  const minBudget = params.minBudget ? Number(params.minBudget) : NaN;
  const maxBudget = params.maxBudget ? Number(params.maxBudget) : NaN;

  if (Number.isFinite(minBudget)) {
    conditions.push({
      OR: [{ budget: { gte: minBudget } }, { budget: null }],
    });
  }

  if (Number.isFinite(maxBudget)) {
    conditions.push({
      OR: [{ budget: { lte: maxBudget } }, { budget: null }],
    });
  }

  return conditions.length === 1 ? conditions[0]! : { AND: conditions };
}

export function getProjectOrderBy(sort?: string) {
  if (sort === "budget_desc") {
    return [{ budget: "desc" as const }, { createdAt: "desc" as const }];
  }
  if (sort === "budget_asc") {
    return [{ budget: "asc" as const }, { createdAt: "desc" as const }];
  }
  // Featured first, then by date
  return [
    { isFeatured: "desc" as const },
    { featuredUntil: "desc" as const },
    { createdAt: "desc" as const },
  ];
}
