"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  adminTelegramConfigured,
  getAdminTelegramBotUsername,
} from "@/lib/telegram/admin-bot";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";

export type AdminTelegramLinkState = {
  error?: string;
  success?: boolean;
  token?: string;
  botUsername?: string | null;
  linked?: boolean;
  alertsEnabled?: boolean;
};

const LINK_TTL_MS = 15 * 60 * 1000;

async function requireActiveAdmin() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return { error: "ACCESS_DENIED" } as const;
  }

  const admin = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, adminActive: true },
  });

  if (!admin?.adminActive) {
    return { error: "ADMIN_ACCOUNT_DEACTIVATED" } as const;
  }

  return { admin } as const;
}

export async function createAdminTelegramLinkToken(): Promise<AdminTelegramLinkState> {
  const authResult = await requireActiveAdmin();
  if ("error" in authResult) {
    return { error: authResult.error };
  }

  if (!adminTelegramConfigured()) {
    return { error: "NOT_CONFIGURED" };
  }

  const token = nanoid(10);
  const expiresAt = new Date(Date.now() + LINK_TTL_MS);

  await prisma.userSettings.upsert({
    where: { userId: authResult.admin.id },
    create: {
      userId: authResult.admin.id,
      adminTelegramLinkToken: token,
      adminTelegramLinkExpiresAt: expiresAt,
    },
    update: {
      adminTelegramLinkToken: token,
      adminTelegramLinkExpiresAt: expiresAt,
    },
  });

  revalidatePath("/admin/overview");
  revalidatePath("/admin/mobile");

  return {
    success: true,
    token,
    botUsername: getAdminTelegramBotUsername(),
    linked: false,
  };
}

export async function disconnectAdminTelegram(): Promise<AdminTelegramLinkState> {
  const authResult = await requireActiveAdmin();
  if ("error" in authResult) {
    return { error: authResult.error };
  }

  await prisma.userSettings.updateMany({
    where: { userId: authResult.admin.id },
    data: {
      adminTelegramChatId: null,
      adminTelegramUserId: null,
      adminTelegramAlerts: true,
      adminTelegramLinkToken: null,
      adminTelegramLinkExpiresAt: null,
    },
  });

  revalidatePath("/admin/overview");
  revalidatePath("/admin/mobile");

  return { success: true, linked: false };
}

export async function getAdminTelegramLinkStatus(): Promise<AdminTelegramLinkState> {
  const authResult = await requireActiveAdmin();
  if ("error" in authResult) {
    return { error: authResult.error };
  }

  const settings = await prisma.userSettings.findUnique({
    where: { userId: authResult.admin.id },
    select: {
      adminTelegramChatId: true,
      adminTelegramAlerts: true,
      adminTelegramLinkToken: true,
      adminTelegramLinkExpiresAt: true,
    },
  });

  return {
    linked: Boolean(settings?.adminTelegramChatId),
    alertsEnabled: settings?.adminTelegramAlerts ?? true,
    botUsername: getAdminTelegramBotUsername(),
    token:
      settings?.adminTelegramLinkToken &&
      settings.adminTelegramLinkExpiresAt &&
      settings.adminTelegramLinkExpiresAt > new Date()
        ? settings.adminTelegramLinkToken
        : undefined,
  };
}

export async function setAdminTelegramAlertsEnabled(
  enabled: boolean,
): Promise<AdminTelegramLinkState> {
  const authResult = await requireActiveAdmin();
  if ("error" in authResult) {
    return { error: authResult.error };
  }

  const settings = await prisma.userSettings.findUnique({
    where: { userId: authResult.admin.id },
    select: { adminTelegramChatId: true },
  });

  if (!settings?.adminTelegramChatId) {
    return { error: "NOT_LINKED" };
  }

  await prisma.userSettings.update({
    where: { userId: authResult.admin.id },
    data: { adminTelegramAlerts: enabled },
  });

  revalidatePath("/admin/overview");
  revalidatePath("/admin/mobile");

  return { success: true, linked: true, alertsEnabled: enabled };
}
