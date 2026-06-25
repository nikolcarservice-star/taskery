import type { AdminPermission } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { isTelegramUserAllowedForAdminBot } from "@/lib/telegram/admin-bot";

export type ResolvedAdmin = {
  id: string;
  adminPermissions: AdminPermission[];
  adminActive: boolean;
  adminTelegramChatId: string | null;
  adminTelegramUserId: string | null;
};

export async function resolveUserByTelegramChat(chatId: string) {
  const settings = await prisma.userSettings.findFirst({
    where: { telegramChatId: String(chatId) },
    select: {
      userId: true,
      user: {
        select: { id: true, role: true, name: true },
      },
    },
  });

  return settings?.user ?? null;
}

export async function resolveAdminByTelegramChat(
  chatId: string | number,
  telegramUserId?: number,
): Promise<ResolvedAdmin | null> {
  if (
    telegramUserId != null &&
    !isTelegramUserAllowedForAdminBot(telegramUserId)
  ) {
    return null;
  }

  const settings = await prisma.userSettings.findFirst({
    where: { adminTelegramChatId: String(chatId) },
    select: {
      adminTelegramChatId: true,
      adminTelegramUserId: true,
      user: {
        select: {
          id: true,
          role: true,
          adminActive: true,
          adminPermissions: true,
        },
      },
    },
  });

  if (!settings?.user || settings.user.role !== "ADMIN" || !settings.user.adminActive) {
    return null;
  }

  if (
    telegramUserId != null &&
    settings.adminTelegramUserId &&
    settings.adminTelegramUserId !== String(telegramUserId)
  ) {
    return null;
  }

  return {
    id: settings.user.id,
    adminPermissions: settings.user.adminPermissions,
    adminActive: settings.user.adminActive,
    adminTelegramChatId: settings.adminTelegramChatId,
    adminTelegramUserId: settings.adminTelegramUserId,
  };
}
