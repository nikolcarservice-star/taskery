import { AuthPageShell } from "@/components/account/AuthPageShell";
import { RegisterForm } from "@/components/RegisterForm";
import { googleEnabled } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n/dictionary";
import { requireAppLocale } from "@/lib/i18n/locale-page";
import { localizedPath } from "@/lib/i18n/routing";
import { createMetadata } from "@/lib/metadata";
import Link from "next/link";

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
  const { auth: authCopy } = dict;

  return (
    <AuthPageShell
      locale={locale}
      dict={dict}
      title={authCopy.register.h1}
      subtitle={
        <>
          {authCopy.register.hasAccount}{" "}
          <Link
            href={localizedPath(locale, "/login")}
            className="text-indigo-600 underline"
          >
            {authCopy.register.loginLink}
          </Link>
        </>
      }
    >
      <RegisterForm googleEnabled={googleEnabled} />
    </AuthPageShell>
  );
}
