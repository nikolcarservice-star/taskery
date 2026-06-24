import { isAppLocale, defaultLocale } from "@/lib/i18n/config";
import type { AppLocale } from "@/lib/i18n/types";
import { prisma } from "@/lib/prisma";

export type UserLocalePreferences = {
  interfaceLanguage: AppLocale;
  autoTranslate: boolean;
};

export function parseInterfaceLanguage(value: string | null | undefined): AppLocale {
  if (value && isAppLocale(value)) {
    return value;
  }
  return defaultLocale;
}

const emailLocaleSelect = {
  interfaceLanguage: true,
  settings: { select: { preferredLocale: true } },
} as const;

export async function getEmailLocaleForUser(userId: string): Promise<AppLocale> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: emailLocaleSelect,
  });

  if (!user) {
    return defaultLocale;
  }

  return parseInterfaceLanguage(
    user.interfaceLanguage ?? user.settings?.preferredLocale,
  );
}

export async function getEmailLocaleForEmail(email: string): Promise<AppLocale> {
  const user = await prisma.user.findUnique({
    where: { email },
    select: emailLocaleSelect,
  });

  if (!user) {
    return defaultLocale;
  }

  return parseInterfaceLanguage(
    user.interfaceLanguage ?? user.settings?.preferredLocale,
  );
}

export async function getUserLocalePreferences(
  userId: string,
): Promise<UserLocalePreferences> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      interfaceLanguage: true,
      autoTranslate: true,
      settings: { select: { preferredLocale: true, autoTranslate: true } },
    },
  });

  if (!user) {
    return { interfaceLanguage: defaultLocale, autoTranslate: true };
  }

  return {
    interfaceLanguage: parseInterfaceLanguage(
      user.interfaceLanguage ?? user.settings?.preferredLocale,
    ),
    autoTranslate: user.autoTranslate ?? user.settings?.autoTranslate ?? true,
  };
}

export async function updateUserLocalePreferences(
  userId: string,
  data: Partial<UserLocalePreferences>,
) {
  const updateUser: { interfaceLanguage?: string; autoTranslate?: boolean } = {};
  const updateSettings: { preferredLocale?: string; autoTranslate?: boolean } = {};

  if (data.interfaceLanguage !== undefined) {
    updateUser.interfaceLanguage = data.interfaceLanguage;
    updateSettings.preferredLocale = data.interfaceLanguage;
  }

  if (data.autoTranslate !== undefined) {
    updateUser.autoTranslate = data.autoTranslate;
    updateSettings.autoTranslate = data.autoTranslate;
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: updateUser,
    }),
    prisma.userSettings.upsert({
      where: { userId },
      create: {
        userId,
        preferredLocale: data.interfaceLanguage ?? defaultLocale,
        autoTranslate: data.autoTranslate ?? true,
      },
      update: updateSettings,
    }),
  ]);
}
