import {
  DEFAULT_SETTINGS,
  type UserSettingsData,
} from "@/lib/settings-shared";
import { getUserLocalePreferences } from "@/lib/i18n/user-locale";
import { prisma } from "@/lib/prisma";

export async function getUserSettings(userId: string): Promise<UserSettingsData> {
  const [user, localePrefs] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        email: true,
        twoFactorEnabled: true,
        settings: true,
      },
    }),
    getUserLocalePreferences(userId),
  ]);

  if (!user) {
    throw new Error("User not found");
  }

  const settings = user.settings;

  return {
    email: user.email,
    twoFactorEnabled: user.twoFactorEnabled,
    emailProjectDigest: settings?.emailProjectDigest ?? DEFAULT_SETTINGS.emailProjectDigest,
    emailNewMessages: settings?.emailNewMessages ?? DEFAULT_SETTINGS.emailNewMessages,
    emailServiceInfo: settings?.emailServiceInfo ?? DEFAULT_SETTINGS.emailServiceInfo,
    emailPromotions: settings?.emailPromotions ?? DEFAULT_SETTINGS.emailPromotions,
    emailNews: settings?.emailNews ?? DEFAULT_SETTINGS.emailNews,
    emailBlogDigest: settings?.emailBlogDigest ?? DEFAULT_SETTINGS.emailBlogDigest,
    pushBrowser: settings?.pushBrowser ?? DEFAULT_SETTINGS.pushBrowser,
    soundNewMessages: settings?.soundNewMessages ?? DEFAULT_SETTINGS.soundNewMessages,
    telegramLinked: Boolean(settings?.telegramChatId),
    telegramMessages: settings?.telegramMessages ?? DEFAULT_SETTINGS.telegramMessages,
    interfaceLanguage: localePrefs.interfaceLanguage,
    autoTranslate: localePrefs.autoTranslate,
    theme: settings?.theme ?? DEFAULT_SETTINGS.theme,
  };
}

export async function ensureUserSettings(userId: string) {
  const settings = await prisma.userSettings.upsert({
    where: { userId },
    create: { userId },
    update: {},
  });

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { interfaceLanguage: true, autoTranslate: true },
  });

  if (
    user &&
    settings.preferredLocale !== user.interfaceLanguage
  ) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        interfaceLanguage: settings.preferredLocale,
        autoTranslate: settings.autoTranslate,
      },
    });
  }

  return settings;
}
