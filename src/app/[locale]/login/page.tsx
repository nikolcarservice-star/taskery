import { DemoAccountsHint } from "@/components/DemoAccountsHint";
import { AuthPageShell } from "@/components/account/AuthPageShell";
import { LoginForm } from "@/components/LoginForm";
import { googleEnabled } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n/dictionary";
import { requireAppLocale } from "@/lib/i18n/locale-page";
import { localizedPath } from "@/lib/i18n/routing";
import { createMetadata } from "@/lib/metadata";
import Link from "next/link";

type LoginPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: LoginPageProps) {
  const locale = await requireAppLocale(params);
  const dict = await getDictionary(locale);

  return createMetadata({
    title: dict.meta.login.title,
    description: dict.meta.login.description,
    path: "/login",
    locale,
    noIndex: true,
  });
}

export default async function LoginPage({ params }: LoginPageProps) {
  const locale = await requireAppLocale(params);
  const dict = await getDictionary(locale);
  const { auth: authCopy } = dict;

  return (
    <AuthPageShell
      locale={locale}
      dict={dict}
      title={authCopy.login.h1}
      subtitle={
        <>
          {authCopy.login.noAccount}{" "}
          <Link
            href={localizedPath(locale, "/register")}
            className="text-indigo-600 underline"
          >
            {authCopy.login.registerLink}
          </Link>
        </>
      }
    >
      <LoginForm googleEnabled={googleEnabled} />
      {process.env.NODE_ENV === "development" && <DemoAccountsHint />}
    </AuthPageShell>
  );
}
