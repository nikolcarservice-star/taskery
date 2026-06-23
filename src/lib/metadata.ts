import type { Metadata } from "next";
import type { AppLocale } from "@/lib/i18n/types";
import { getLocaleConfig } from "@/lib/i18n/config";
import { buildLocaleAlternates, localizedPath, stripLocalePrefix } from "@/lib/i18n/routing";
import { absoluteUrl, siteConfig } from "@/lib/seo";

type PageMeta = {
  title: string;
  description: string;
  path?: string;
  locale?: AppLocale;
  noIndex?: boolean;
  keywords?: string[];
};

export function createMetadata({
  title,
  description,
  path = "",
  locale,
  noIndex = false,
  keywords = [],
}: PageMeta): Metadata {
  const pagePath = locale
    ? localizedPath(locale, stripLocalePrefix(path || "/"))
    : path;
  const url = absoluteUrl(pagePath);
  const fullTitle = title.includes(siteConfig.name)
    ? title
    : `${title} | ${siteConfig.name}`;

  const localeConfig = locale ? getLocaleConfig(locale) : null;
  const hreflangPath = locale ? stripLocalePrefix(path || "/") : undefined;

  return {
    title: fullTitle,
    description,
    keywords: [...siteConfig.keywords, ...keywords],
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: url,
      languages: locale && hreflangPath !== undefined
        ? buildLocaleAlternates(hreflangPath)
        : undefined,
    },
    openGraph: {
      type: "website",
      locale: localeConfig?.openGraphLocale ?? siteConfig.locale,
      url,
      siteName: siteConfig.name,
      title: fullTitle,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
    other: localeConfig
      ? {
          "content-language": localeConfig.contentLanguage,
        }
      : undefined,
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
  };
}
