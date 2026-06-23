import type { AdminReportItem } from "@/lib/reports-shared";
import { prisma } from "@/lib/prisma";

export async function getPendingAdminReports(): Promise<AdminReportItem[]> {
  const reports = await prisma.report.findMany({
    where: { status: { in: ["PENDING", "IN_REVIEW"] } },
    orderBy: [{ createdAt: "desc" }],
    take: 200,
    include: {
      reporter: { select: { id: true, name: true, email: true } },
      targetUser: { select: { id: true, name: true, email: true, role: true } },
      targetProject: {
        select: {
          id: true,
          slug: true,
          title: true,
          currency: true,
          budget: true,
          reportCount: true,
          underpricedReportCount: true,
          moderationHot: true,
          client: { select: { id: true, name: true, email: true } },
        },
      },
    },
  });

  return reports.map((report) => ({
    id: report.id,
    targetType: report.targetType,
    reason: report.reason,
    details: report.details,
    status: report.status,
    createdAt: report.createdAt.toISOString(),
    reporter: report.reporter,
    targetUser: report.targetUser,
    targetProject: report.targetProject
      ? {
          ...report.targetProject,
          budget: report.targetProject.budget?.toString() ?? null,
        }
      : null,
  }));
}
