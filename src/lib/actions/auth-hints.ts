"use server";

import { prisma } from "@/lib/prisma";

export async function isAdminEmail(email: string) {
  const normalized = email.trim().toLowerCase();
  if (!normalized) return false;

  const user = await prisma.user.findUnique({
    where: { email: normalized },
    select: { role: true },
  });

  return user?.role === "ADMIN";
}
