import type { ReportReason, ReportStatus, ReportTargetType } from "@/generated/prisma/client";

export const UNDERPRICED_REPORT_THRESHOLD = Number(
  process.env.REPORT_UNDERPRICED_THRESHOLD ?? "5",
);

export const ACTIVE_REPORT_STATUSES: ReportStatus[] = ["PENDING", "IN_REVIEW"];

export const PROJECT_REPORT_REASONS: ReportReason[] = [
  "UNDERPRICED",
  "SPAM",
  "FRAUD",
  "IRRELEVANT",
  "POLICY_VIOLATION",
  "OTHER",
];

export const USER_REPORT_REASONS: ReportReason[] = [
  "HARASSMENT",
  "FRAUD",
  "SPAM",
  "FAKE_PROFILE",
  "OTHER",
];

export type ReportSummary = {
  reportCount: number;
  underpricedReportCount: number;
  moderationHot: boolean;
  threshold: number;
};

export type ProjectReportBadge = "none" | "warning" | "hot";

export function getProjectReportBadge(
  reportCount: number,
  underpricedReportCount: number,
  moderationHot: boolean,
): ProjectReportBadge {
  if (moderationHot || underpricedReportCount >= UNDERPRICED_REPORT_THRESHOLD) {
    return "hot";
  }
  if (reportCount > 0) {
    return "warning";
  }
  return "none";
}

export type AdminReportItem = {
  id: string;
  targetType: ReportTargetType;
  reason: ReportReason;
  details: string | null;
  status: ReportStatus;
  createdAt: string;
  reporter: { id: string; name: string | null; email: string };
  targetUser: { id: string; name: string | null; email: string; role: string } | null;
  targetProject: {
    id: string;
    slug: string;
    title: string;
    currency: string;
    budget: string | null;
    reportCount: number;
    underpricedReportCount: number;
    moderationHot: boolean;
    client: { id: string; name: string | null; email: string };
  } | null;
};
