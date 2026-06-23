import type { AppLocale } from "@/lib/i18n/types";
import { getDictionary } from "@/lib/i18n/dictionary";
import { buildLocaleAlternates } from "@/lib/i18n/routing";
import { getLocaleConfig } from "@/lib/i18n/config";
import { absoluteUrl } from "@/lib/site-url";

export async function getHomeSeo(locale: AppLocale) {
  const dict = await getDictionary(locale);
  const config = getLocaleConfig(locale);

  return {
    ...dict.meta.home,
    locale,
    htmlLang: config.htmlLang,
    openGraphLocale: config.openGraphLocale,
    hreflang: config.hreflang,
    contentLanguage: config.contentLanguage,
    alternates: buildLocaleAlternates("/"),
    canonical: absoluteUrl(`/${locale}`),
  };
}

export { buildLocaleAlternates };
