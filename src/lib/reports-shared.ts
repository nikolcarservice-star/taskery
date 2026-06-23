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

export type ProjectReportDisplayMode = "underpriced" | "general" | "none";

export type ProjectReportFlagKind =
  | "none"
  | "underpriced"
  | "underpriced_hot"
  | "general";

export function getProjectReportDisplayMode(
  reportCount: number,
  underpricedReportCount: number,
  moderationHot: boolean,
): ProjectReportDisplayMode {
  if (moderationHot || underpricedReportCount > 0) {
    return "underpriced";
  }
  if (reportCount > 0) {
    return "general";
  }
  return "none";
}

export function getProjectReportFlagKind(
  reportCount: number,
  underpricedReportCount: number,
  moderationHot: boolean,
): ProjectReportFlagKind {
  if (moderationHot || underpricedReportCount >= UNDERPRICED_REPORT_THRESHOLD) {
    return "underpriced_hot";
  }
  if (underpricedReportCount > 0) {
    return "underpriced";
  }
  if (reportCount > 0) {
    return "general";
  }
  return "none";
}

export function getOtherReportCount(
  reportCount: number,
  underpricedReportCount: number,
): number {
  return Math.max(0, reportCount - underpricedReportCount);
}

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

export type AdminReportProjectGroup = {
  kind: "project";
  project: NonNullable<AdminReportItem["targetProject"]>;
  reports: AdminReportItem[];
};

export type AdminReportUserGroup = {
  kind: "user";
  user: NonNullable<AdminReportItem["targetUser"]>;
  reports: AdminReportItem[];
};

export type AdminReportGroup = AdminReportProjectGroup | AdminReportUserGroup;

export function groupAdminReports(reports: AdminReportItem[]): AdminReportGroup[] {
  const projectMap = new Map<string, AdminReportProjectGroup>();
  const userMap = new Map<string, AdminReportUserGroup>();

  for (const report of reports) {
    if (report.targetType === "PROJECT" && report.targetProject) {
      const existing = projectMap.get(report.targetProject.id);
      if (existing) {
        existing.reports.push(report);
      } else {
        projectMap.set(report.targetProject.id, {
          kind: "project",
          project: report.targetProject,
          reports: [report],
        });
      }
      continue;
    }

    if (report.targetType === "USER" && report.targetUser) {
      const existing = userMap.get(report.targetUser.id);
      if (existing) {
        existing.reports.push(report);
      } else {
        userMap.set(report.targetUser.id, {
          kind: "user",
          user: report.targetUser,
          reports: [report],
        });
      }
    }
  }

  const sortReports = (items: AdminReportItem[]) =>
    [...items].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

  const groups: AdminReportGroup[] = [
    ...projectMap.values(),
    ...userMap.values(),
  ];

  for (const group of groups) {
    group.reports = sortReports(group.reports);
  }

  return groups.sort((a, b) => {
    const aHot =
      a.kind === "project" ? a.project.moderationHot : false;
    const bHot =
      b.kind === "project" ? b.project.moderationHot : false;
    if (aHot !== bHot) return aHot ? -1 : 1;

    const countDiff = b.reports.length - a.reports.length;
    if (countDiff !== 0) return countDiff;

    const aLatest = new Date(a.reports[0]?.createdAt ?? 0).getTime();
    const bLatest = new Date(b.reports[0]?.createdAt ?? 0).getTime();
    return bLatest - aLatest;
  });
}
