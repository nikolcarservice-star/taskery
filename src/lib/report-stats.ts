import type { ReportReason } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import {
  ACTIVE_REPORT_STATUSES,
  UNDERPRICED_REPORT_THRESHOLD,
} from "@/lib/reports-shared";

export async function recalculateProjectReportStats(projectId: string) {
  const activeReports = await prisma.report.findMany({
    where: {
      targetProjectId: projectId,
      status: { in: ACTIVE_REPORT_STATUSES },
    },
    select: { reporterId: true, reason: true },
  });

  const uniqueReporters = new Set(activeReports.map((r) => r.reporterId));
  const reportCount = uniqueReporters.size;
  const underpricedReportCount = new Set(
    activeReports
      .filter((r) => r.reason === ("UNDERPRICED" as ReportReason))
      .map((r) => r.reporterId),
  ).size;

  const moderationHot = underpricedReportCount >= UNDERPRICED_REPORT_THRESHOLD;
  const hiddenFromCatalog = moderationHot;

  await prisma.project.update({
    where: { id: projectId },
    data: {
      reportCount,
      underpricedReportCount,
      moderationHot,
      hiddenFromCatalog,
    },
  });

  return { reportCount, underpricedReportCount, moderationHot };
}

export async function hasUserReportedProject(
  reporterId: string,
  projectId: string,
): Promise<boolean> {
  const existing = await prisma.report.findFirst({
    where: {
      reporterId,
      targetProjectId: projectId,
      status: { in: ACTIVE_REPORT_STATUSES },
    },
    select: { id: true },
  });

  return Boolean(existing);
}

export async function hasUserReportedUser(
  reporterId: string,
  targetUserId: string,
): Promise<boolean> {
  const existing = await prisma.report.findFirst({
    where: {
      reporterId,
      targetUserId,
      status: { in: ACTIVE_REPORT_STATUSES },
    },
    select: { id: true },
  });

  return Boolean(existing);
}
