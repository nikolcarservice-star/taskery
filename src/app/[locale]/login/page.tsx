import { DemoAccountsHint } from "@/components/DemoAccountsHint";
import { LoginForm } from "@/components/LoginForm";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
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
    <div className="flex min-h-full flex-1 flex-col bg-zinc-50">
      <SiteHeader locale={locale} dict={dict} />

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-12">
        <h1 className="text-2xl font-bold text-zinc-900">{authCopy.login.h1}</h1>
        <p className="mt-2 text-sm text-zinc-600">
          {authCopy.login.noAccount}{" "}
          <Link
            href={localizedPath(locale, "/register")}
            className="text-blue-600 underline"
          >
            {authCopy.login.registerLink}
          </Link>
        </p>

        <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <LoginForm googleEnabled={googleEnabled} />
        </div>

        <DemoAccountsHint />
      </main>

      <SiteFooter locale={locale} dict={dict} />
    </div>
  );
}
