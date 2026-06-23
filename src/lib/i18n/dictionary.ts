import type { AppLocale, Dictionary } from "@/lib/i18n/types";

const dictionaries: Record<AppLocale, () => Promise<Dictionary>> = {
  ru: () => import("@/messages/ru.json").then((module) => module.default),
  uk: () => import("@/messages/uk.json").then((module) => module.default),
  pl: () => import("@/messages/pl.json").then((module) => module.default),
  en: () => import("@/messages/en.json").then((module) => module.default),
};

export async function getDictionary(locale: AppLocale): Promise<Dictionary> {
  return dictionaries[locale]();
}

export function getFaqItems(locale: AppLocale) {
  return dictionaries[locale]().then((dict) => dict.faq);
}
