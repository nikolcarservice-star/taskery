import { prisma } from "@/lib/prisma";

export type PendingProjectItem = {
  id: string;
  slug: string;
  title: string;
  createdAt: string;
  client: { name: string | null; email: string };
  category: { name: string } | null;
};

export async function getPendingModerationProjects(): Promise<PendingProjectItem[]> {
  const projects = await prisma.project.findMany({
    where: { status: "PENDING_MODERATION" },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      slug: true,
      title: true,
      createdAt: true,
      client: { select: { name: true, email: true } },
      category: { select: { name: true } },
    },
  });

  return projects.map((project) => ({
    ...project,
    createdAt: project.createdAt.toISOString(),
  }));
}
