import type { AppLocale } from "@/lib/i18n/types";
import { defaultLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import ruMessages from "@/messages/ru.json";
import type { Dictionary } from "@/lib/i18n/types";

/** @deprecated Use `getDictionary(locale).faq` or messages JSON directly. */
export const faqItems = ruMessages.faq;

export async function getFaqItemsForLocale(locale: AppLocale = defaultLocale) {
  const dict = await getDictionary(locale);
  return dict.faq;
}

export type { Dictionary };
