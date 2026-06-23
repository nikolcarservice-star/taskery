import { DictionaryProvider } from "@/lib/i18n/dictionary-context";
import { getDictionary } from "@/lib/i18n/dictionary";
import { requireAppLocale } from "@/lib/i18n/locale-page";

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export { generateStaticParams } from "@/lib/i18n/locale-page";

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const locale = await requireAppLocale(params);
  const dict = await getDictionary(locale);

  return (
    <DictionaryProvider locale={locale} dict={dict}>
      {children}
    </DictionaryProvider>
  );
}
