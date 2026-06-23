import { googleEnabled } from "@/lib/auth";
import { RegisterPageClient } from "@/components/RegisterPageClient";
import { getDictionary } from "@/lib/i18n/dictionary";
import { requireAppLocale } from "@/lib/i18n/locale-page";
import { createMetadata } from "@/lib/metadata";

type RegisterPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: RegisterPageProps) {
  const locale = await requireAppLocale(params);
  const dict = await getDictionary(locale);

  return createMetadata({
    title: dict.meta.register.title,
    description: dict.meta.register.description,
    path: "/register",
    locale,
    noIndex: true,
  });
}

export default async function RegisterPage({ params }: RegisterPageProps) {
  const locale = await requireAppLocale(params);
  const dict = await getDictionary(locale);

  return (
    <RegisterPageClient googleEnabled={googleEnabled} locale={locale} dict={dict} />
  );
}
