export type SettingsTab = "service" | "security";

export type UserSettingsData = {
  email: string;
  emailProjectDigest: boolean;
  emailNewMessages: boolean;
  emailServiceInfo: boolean;
  emailPromotions: boolean;
  emailNews: boolean;
  emailBlogDigest: boolean;
  pushBrowser: boolean;
  soundNewMessages: boolean;
  interfaceLanguage: string;
  autoTranslate: boolean;
  theme: string;
};

export const LOCALE_OPTIONS = [
  { value: "ru", label: "Русский", flag: "🇷🇺" },
  { value: "uk", label: "Українська", flag: "🇺🇦" },
  { value: "pl", label: "Polski", flag: "🇵🇱" },
  { value: "en", label: "English", flag: "🇬🇧" },
] as const;

export const THEME_OPTIONS = [
  { value: "light", label: "Стандартная" },
  { value: "dark", label: "Тёмная" },
] as const;

export const DEFAULT_SETTINGS: Omit<UserSettingsData, "email"> = {
  emailProjectDigest: true,
  emailNewMessages: true,
  emailServiceInfo: true,
  emailPromotions: false,
  emailNews: false,
  emailBlogDigest: false,
  pushBrowser: false,
  soundNewMessages: false,
  interfaceLanguage: "ru",
  autoTranslate: true,
  theme: "light",
};
