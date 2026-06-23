import Link from "next/link";
import { ResetPasswordForm } from "@/components/PasswordResetForms";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getDictionary } from "@/lib/i18n/dictionary";
import { requireAppLocale } from "@/lib/i18n/locale-page";
import { localizedPath } from "@/lib/i18n/routing";
import { createMetadata } from "@/lib/metadata";

type ResetPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ token?: string }>;
};

export async function generateMetadata({ params }: ResetPageProps) {
  const locale = await requireAppLocale(params);
  const dict = await getDictionary(locale);
  return createMetadata({
    title: dict.publicForms.password.pageReset.title,
    description: dict.publicForms.password.pageForgot.description,
    path: "/reset-password",
    locale,
    noIndex: true,
  });
}

export default async function ResetPasswordPage({
  params,
  searchParams,
}: ResetPageProps) {
  const locale = await requireAppLocale(params);
  const dict = await getDictionary(locale);
  const { token } = await searchParams;

  return (
    <div className="flex min-h-full flex-1 flex-col bg-zinc-50">
      <SiteHeader locale={locale} dict={dict} />
      <main className="mx-auto w-full max-w-md flex-1 px-6 py-12">
        <h1 className="text-2xl font-bold text-zinc-900">{dict.publicForms.password.pageReset.title}</h1>
        {!token ? (
          <div className="mt-8 rounded-xl bg-red-50 p-4 text-sm text-red-800">
            {dict.publicForms.password.pageReset.invalidToken}{" "}
            <Link href={localizedPath(locale, "/forgot-password")} className="font-medium underline">
              {dict.publicForms.password.pageReset.requestNew}
            </Link>
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <ResetPasswordForm token={token} />
          </div>
        )}
      </main>
      <SiteFooter locale={locale} dict={dict} />
    </div>
  );
}
