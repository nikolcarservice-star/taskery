"use server";

import type { ReportReason, ReportTargetType } from "@/generated/prisma/client";
import { actionError } from "@/lib/action-errors";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  hasUserReportedProject,
  hasUserReportedUser,
  recalculateProjectReportStats,
} from "@/lib/report-stats";
import {
  PROJECT_REPORT_REASONS,
  USER_REPORT_REASONS,
} from "@/lib/reports-shared";
import { checkRateLimit } from "@/lib/rate-limit";
import { revalidatePath } from "next/cache";

export type ReportState = { error?: string; success?: boolean };

function parseReason(
  value: string | null,
  targetType: ReportTargetType,
): ReportReason | null {
  if (!value) return null;
  const allowed =
    targetType === "PROJECT" ? PROJECT_REPORT_REASONS : USER_REPORT_REASONS;
  return allowed.includes(value as ReportReason)
    ? (value as ReportReason)
    : null;
}

export async function submitReport(
  _prevState: ReportState,
  formData: FormData,
): Promise<ReportState> {
  const session = await auth();
  if (!session?.user?.id) {
    return actionError("AUTH_REQUIRED");
  }

  const reporter = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, bannedAt: true, deletedAt: true },
  });

  if (!reporter || reporter.bannedAt || reporter.deletedAt) {
    return actionError("ACCESS_DENIED");
  }

  const targetType = formData.get("targetType") as ReportTargetType | null;
  const targetProjectId = (formData.get("targetProjectId") as string | null)?.trim();
  const targetUserId = (formData.get("targetUserId") as string | null)?.trim();
  const reason = parseReason(
    (formData.get("reason") as string | null)?.trim() ?? null,
    targetType ?? "PROJECT",
  );
  const details = (formData.get("details") as string | null)?.trim() ?? "";

  if (targetType !== "PROJECT" && targetType !== "USER") {
    return actionError("REQUIRED_FIELDS_MISSING");
  }

  if (!reason) {
    return actionError("REPORT_REASON_REQUIRED");
  }

  if (reason === "OTHER" && details.length < 10) {
    return actionError("REPORT_DETAILS_REQUIRED");
  }

  if (details.length > 2000) {
    return actionError("CONTACT_MESSAGE_TOO_LONG");
  }

  const limited = checkRateLimit(`report:${session.user.id}`, 5, 3_600_000);
  if (!limited.ok) {
    return actionError("RATE_LIMIT_EXCEEDED");
  }

  if (targetType === "PROJECT") {
    if (!targetProjectId) {
      return actionError("PROJECT_NOT_FOUND");
    }

    const project = await prisma.project.findUnique({
      where: { id: targetProjectId },
      select: { id: true, slug: true, clientId: true, blockedAt: true },
    });

    if (!project || project.blockedAt) {
      return actionError("PROJECT_NOT_FOUND");
    }

    if (project.clientId === session.user.id) {
      return actionError("CANNOT_REPORT_SELF");
    }

    if (await hasUserReportedProject(session.user.id, project.id)) {
      return actionError("REPORT_ALREADY_SUBMITTED");
    }

    await prisma.report.create({
      data: {
        reporterId: session.user.id,
        targetType: "PROJECT",
        targetProjectId: project.id,
        reason,
        details: details || null,
      },
    });

    await recalculateProjectReportStats(project.id);

    revalidatePath(`/projects/${project.slug}`);
    revalidatePath("/projects");
    revalidatePath("/admin");

    return { success: true };
  }

  if (!targetUserId) {
    return actionError("USER_NOT_FOUND");
  }

  if (targetUserId === session.user.id) {
    return actionError("CANNOT_REPORT_SELF");
  }

  const targetUser = await prisma.user.findUnique({
    where: { id: targetUserId },
    select: { id: true, role: true, bannedAt: true, deletedAt: true },
  });

  if (!targetUser || targetUser.bannedAt || targetUser.deletedAt) {
    return actionError("USER_NOT_FOUND");
  }

  if (await hasUserReportedUser(session.user.id, targetUserId)) {
    return actionError("REPORT_ALREADY_SUBMITTED");
  }

  await prisma.report.create({
    data: {
      reporterId: session.user.id,
      targetType: "USER",
      targetUserId,
      reason,
      details: details || null,
    },
  });

  revalidatePath(`/freelancers/${targetUserId}`);
  revalidatePath("/admin");

  return { success: true };
}
