import { NextResponse } from "next/server";

import { hasAdminPermission, isSuperAdmin } from "@/lib/admin-permissions";
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

  const canExport =
    admin?.adminActive &&
    (hasAdminPermission(admin.adminPermissions, "STAFF_MANAGE") ||
      isSuperAdmin(admin.adminPermissions));

  if (!canExport) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const logs = await prisma.adminAuditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 5000,
    include: {
      admin: { select: { email: true, name: true } },
    },
  });

  const header = "id,date,adminEmail,adminName,action,targetType,targetId";
  const rows = logs.map((log) =>
    [
      log.id,
      log.createdAt.toISOString(),
      csvEscape(log.admin.email),
      csvEscape(log.admin.name ?? ""),
      log.action,
      csvEscape(log.targetType ?? ""),
      csvEscape(log.targetId ?? ""),
    ].join(","),
  );

  return buildCsvResponse([header, ...rows], "taskery-audit");
}
