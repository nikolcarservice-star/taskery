import { ForgotPasswordForm } from "@/components/PasswordResetForms";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getDictionary } from "@/lib/i18n/dictionary";
import { requireAppLocale } from "@/lib/i18n/locale-page";
import { createMetadata } from "@/lib/metadata";

type ForgotPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: ForgotPageProps) {
  const locale = await requireAppLocale(params);
  const dict = await getDictionary(locale);
  return createMetadata({
    title: dict.publicForms.password.pageForgot.title,
    description: dict.publicForms.password.pageForgot.description,
    path: "/forgot-password",
    locale,
    noIndex: true,
  });
}

export default async function ForgotPasswordPage({ params }: ForgotPageProps) {
  const locale = await requireAppLocale(params);
  const dict = await getDictionary(locale);
  return (
    <div className="flex min-h-full flex-1 flex-col bg-zinc-50">
      <SiteHeader locale={locale} dict={dict} />
      <main className="mx-auto w-full max-w-md flex-1 px-6 py-12">
        <h1 className="text-2xl font-bold text-zinc-900">{dict.publicForms.password.pageForgot.title}</h1>
        <p className="mt-2 text-sm text-zinc-600">{dict.publicForms.password.pageForgot.description}</p>
        <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <ForgotPasswordForm />
        </div>
      </main>
      <SiteFooter locale={locale} dict={dict} />
    </div>
  );
}
