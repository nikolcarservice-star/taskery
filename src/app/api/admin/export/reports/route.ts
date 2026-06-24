import { NextResponse } from "next/server";

import { hasAdminPermission } from "@/lib/admin-permissions";
import { auth } from "@/lib/auth";
import { buildCsvResponse, csvEscape } from "@/lib/csv-export";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const admin = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { adminActive: true, adminPermissions: true },
  });

  if (
    !admin?.adminActive ||
    !hasAdminPermission(admin.adminPermissions, "MODERATION")
  ) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const reports = await prisma.report.findMany({
    orderBy: { createdAt: "desc" },
    take: 5000,
    select: {
      id: true,
      targetType: true,
      reason: true,
      status: true,
      createdAt: true,
      reporter: { select: { email: true } },
      targetUser: { select: { email: true } },
      targetProject: { select: { slug: true, title: true } },
    },
  });

  const header =
    "id,date,status,targetType,reason,reporterEmail,targetUserEmail,projectSlug,projectTitle";
  const rows = reports.map((report) =>
    [
      report.id,
      report.createdAt.toISOString(),
      report.status,
      report.targetType,
      csvEscape(report.reason),
      csvEscape(report.reporter.email),
      csvEscape(report.targetUser?.email ?? ""),
      csvEscape(report.targetProject?.slug ?? ""),
      csvEscape(report.targetProject?.title ?? ""),
    ].join(","),
  );

  return buildCsvResponse([header, ...rows], "taskery-reports");
}
