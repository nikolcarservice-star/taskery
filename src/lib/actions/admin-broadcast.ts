"use server";

import { logAdminAction } from "@/lib/admin-audit";
import { hasAdminPermission } from "@/lib/admin-permissions";
import { auth } from "@/lib/auth";
import { createUserNotificationsBatch } from "@/lib/create-user-notification";
import { prisma } from "@/lib/prisma";
import type { Role } from "@/generated/prisma/client";
import { isUserCurrentlyBanned } from "@/lib/user-ban";
import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";

export type BroadcastAudience = "ALL" | "FREELANCERS" | "CLIENTS";

export type BroadcastActionState = {
  error?: string;
  success?: boolean;
  recipientCount?: number;
};

async function requireBroadcastAdmin() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return { error: "Доступ запрещён" } as const;
  }

  const admin = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, adminPermissions: true, adminActive: true },
  });

  if (!admin?.adminActive) {
    return { error: "Аккаунт деактивирован" } as const;
  }

  if (!hasAdminPermission(admin.adminPermissions, "STAFF_MANAGE")) {
    return { error: "Недостаточно прав" } as const;
  }

  return { admin } as const;
}

function parseAudience(value: string | null): BroadcastAudience | null {
  if (value === "ALL" || value === "FREELANCERS" || value === "CLIENTS") {
    return value;
  }
  return null;
}

function normalizeLink(raw: string | null): string | null {
  const link = raw?.trim();
  if (!link) return null;
  if (!link.startsWith("/")) return null;
  return link;
}

export async function adminSendBroadcast(
  _prevState: BroadcastActionState,
  formData: FormData,
): Promise<BroadcastActionState> {
  const authResult = await requireBroadcastAdmin();
  if ("error" in authResult) return { error: authResult.error };

  const title = (formData.get("title") as string | null)?.trim();
  const body = (formData.get("body") as string | null)?.trim();
  const link = normalizeLink(formData.get("link") as string | null);
  const audience = parseAudience(formData.get("audience") as string | null);
  const confirm = formData.get("confirm") === "on";

  if (!title || title.length < 3) {
    return { error: "Заголовок должен быть не короче 3 символов" };
  }

  if (!body || body.length < 5) {
    return { error: "Текст уведомления слишком короткий" };
  }

  if (title.length > 120) {
    return { error: "Заголовок не длиннее 120 символов" };
  }

  if (body.length > 2000) {
    return { error: "Текст не длиннее 2000 символов" };
  }

  if (!audience) {
    return { error: "Выберите аудиторию" };
  }

  if (formData.get("link") && !link) {
    return { error: "Ссылка должна начинаться с /" };
  }

  if (!confirm) {
    return { error: "Подтвердите отправку рассылки" };
  }

  const roleFilter =
    audience === "FREELANCERS"
      ? { role: "FREELANCER" as Role }
      : audience === "CLIENTS"
        ? { role: "CLIENT" as Role }
        : { role: { in: ["FREELANCER", "CLIENT"] as Role[] } };

  const candidates = await prisma.user.findMany({
    where: {
      deletedAt: null,
      ...roleFilter,
    },
    select: {
      id: true,
      bannedAt: true,
      bannedUntil: true,
      deletedAt: true,
    },
  });

  const userIds = candidates
    .filter((user) => !isUserCurrentlyBanned(user))
    .map((user) => user.id);

  if (userIds.length === 0) {
    return { error: "Нет получателей для выбранной аудитории" };
  }

  const broadcastId = randomUUID();
  const notifications = userIds.map((userId) => ({
    userId,
    type: "ADMIN_BROADCAST" as const,
    title,
    body,
    link,
    metadata: {
      broadcastId,
      audience,
      adminId: authResult.admin.id,
    },
  }));

  await createUserNotificationsBatch(notifications);

  await logAdminAction(authResult.admin.id, "BROADCAST_SEND", {
    targetType: "broadcast",
    targetId: broadcastId,
    details: {
      audience,
      recipientCount: userIds.length,
      title,
      link,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/mobile/broadcast");
  revalidatePath("/notifications");

  return { success: true, recipientCount: userIds.length };
}
