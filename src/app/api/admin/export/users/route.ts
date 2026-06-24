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
    !hasAdminPermission(admin.adminPermissions, "USERS")
  ) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const users = await prisma.user.findMany({
    where: { role: { not: "ADMIN" } },
    orderBy: { createdAt: "desc" },
    take: 10000,
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      bannedAt: true,
      deletedAt: true,
      createdAt: true,
      twoFactorEnabled: true,
    },
  });

  const header = "id,date,email,name,role,twoFactorEnabled,banned,deleted";
  const rows = users.map((user) =>
    [
      user.id,
      user.createdAt.toISOString(),
      csvEscape(user.email),
      csvEscape(user.name ?? ""),
      user.role,
      user.twoFactorEnabled ? "yes" : "no",
      user.bannedAt ? user.bannedAt.toISOString() : "",
      user.deletedAt ? user.deletedAt.toISOString() : "",
    ].join(","),
  );

  return buildCsvResponse([header, ...rows], "taskery-users");
}
