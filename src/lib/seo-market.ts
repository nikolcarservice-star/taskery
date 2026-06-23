/**
 * @deprecated Import from `@/lib/i18n` instead.
 */
export {
  APP_LOCALES,
  defaultLocale,
  getDictionary,
  getHomeSeo,
  localizedPath,
} from "@/lib/i18n";

export const primaryMarket = {
  countryCode: "EU",
  countryNameRu: "Европе",
  htmlLang: "ru",
  openGraphLocale: "ru_RU",
  hreflang: "ru",
  contentLanguage: "ru",
  inLanguage: "ru",
  regionLabelRu: "Украине, Польше и Европе",
  audienceLabelRu: "заказчиков и фрилансеров",
} as const;

export const homeSeo = {
  title: "Taskery — фриланс-биржа для заказчиков и исполнителей",
  description:
    "Публикуйте проекты и находите фрилансеров в Украине, Польше и Европе. Эскроу-сделки, рейтинг, чат и TaskBoost. Оплата в гривне, злотых и евро.",
  keywords: [] as string[],
} as const;
