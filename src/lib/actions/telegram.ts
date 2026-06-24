"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  getTelegramBotUsername,
  telegramConfigured,
} from "@/lib/telegram";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";

export type TelegramLinkState = {
  error?: string;
  success?: boolean;
  token?: string;
  botUsername?: string | null;
  linked?: boolean;
  chatLinked?: boolean;
};

const LINK_TTL_MS = 15 * 60 * 1000;

export async function createTelegramLinkToken(): Promise<TelegramLinkState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "AUTH_REQUIRED" };
  }

  if (!telegramConfigured()) {
    return { error: "NOT_CONFIGURED" };
  }

  const token = nanoid(10);
  const expiresAt = new Date(Date.now() + LINK_TTL_MS);

  await prisma.userSettings.upsert({
    where: { userId: session.user.id },
    create: {
      userId: session.user.id,
      telegramLinkToken: token,
      telegramLinkExpiresAt: expiresAt,
    },
    update: {
      telegramLinkToken: token,
      telegramLinkExpiresAt: expiresAt,
    },
  });

  revalidatePath("/dashboard/settings");
  revalidatePath("/client/settings");

  return {
    success: true,
    token,
    botUsername: getTelegramBotUsername(),
    linked: false,
  };
}

export async function disconnectTelegram(): Promise<TelegramLinkState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "AUTH_REQUIRED" };
  }

  await prisma.userSettings.updateMany({
    where: { userId: session.user.id },
    data: {
      telegramChatId: null,
      telegramMessages: false,
      telegramLinkToken: null,
      telegramLinkExpiresAt: null,
    },
  });

  revalidatePath("/dashboard/settings");
  revalidatePath("/client/settings");

  return { success: true, linked: false };
}

export async function getTelegramLinkStatus(): Promise<TelegramLinkState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "AUTH_REQUIRED" };
  }

  const settings = await prisma.userSettings.findUnique({
    where: { userId: session.user.id },
    select: {
      telegramChatId: true,
      telegramMessages: true,
      telegramLinkToken: true,
      telegramLinkExpiresAt: true,
    },
  });

  return {
    linked: Boolean(settings?.telegramChatId),
    chatLinked: Boolean(settings?.telegramChatId),
    botUsername: getTelegramBotUsername(),
    token:
      settings?.telegramLinkToken &&
      settings.telegramLinkExpiresAt &&
      settings.telegramLinkExpiresAt > new Date()
        ? settings.telegramLinkToken
        : undefined,
  };
}

export async function setTelegramMessagesEnabled(
  enabled: boolean,
): Promise<TelegramLinkState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "AUTH_REQUIRED" };
  }

  const settings = await prisma.userSettings.findUnique({
    where: { userId: session.user.id },
    select: { telegramChatId: true },
  });

  if (!settings?.telegramChatId) {
    return { error: "NOT_LINKED" };
  }

  await prisma.userSettings.update({
    where: { userId: session.user.id },
    data: { telegramMessages: enabled },
  });

  revalidatePath("/dashboard/settings");
  revalidatePath("/client/settings");

  return { success: true, linked: true };
}
