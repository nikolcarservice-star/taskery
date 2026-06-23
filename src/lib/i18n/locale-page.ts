import { notFound } from "next/navigation";
import { APP_LOCALES, isAppLocale } from "@/lib/i18n/config";
import type { AppLocale } from "@/lib/i18n/types";

export function generateStaticParams() {
  return APP_LOCALES.map((locale) => ({ locale }));
}

export async function requireAppLocale(
  params: Promise<{ locale: string }>,
): Promise<AppLocale> {
  const { locale } = await params;

  if (!isAppLocale(locale)) {
    notFound();
  }

  return locale;
}
