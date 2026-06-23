import { NextResponse } from "next/server";

import { hasAdminPermission } from "@/lib/admin-permissions";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function csvEscape(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

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
    !hasAdminPermission(admin.adminPermissions, "FINANCE")
  ) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const payments = await prisma.payment.findMany({
    orderBy: { createdAt: "desc" },
    take: 5000,
    select: {
      id: true,
      amount: true,
      currency: true,
      type: true,
      status: true,
      createdAt: true,
      user: { select: { email: true, name: true } },
    },
  });

  const header = "id,date,email,name,type,status,amount,currency";
  const rows = payments.map((payment) =>
    [
      payment.id,
      payment.createdAt.toISOString(),
      csvEscape(payment.user.email),
      csvEscape(payment.user.name ?? ""),
      payment.type,
      payment.status,
      payment.amount.toString(),
      payment.currency,
    ].join(","),
  );

  const csv = [header, ...rows].join("\n");
  const filename = `taskery-payments-${new Date().toISOString().slice(0, 10)}.csv`;

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
