import Link from "next/link";
import { AuthPageShell } from "@/components/account/AuthPageShell";
import { ResetPasswordForm } from "@/components/PasswordResetForms";
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
    <AuthPageShell
      locale={locale}
      dict={dict}
      title={dict.publicForms.password.pageReset.title}
    >
      {!token ? (
        <div className="rounded-xl bg-red-50 p-4 text-sm text-red-800">
          {dict.publicForms.password.pageReset.invalidToken}{" "}
          <Link href={localizedPath(locale, "/forgot-password")} className="font-medium underline">
            {dict.publicForms.password.pageReset.requestNew}
          </Link>
        </div>
      ) : (
        <ResetPasswordForm token={token} />
      )}
    </AuthPageShell>
  );
}
