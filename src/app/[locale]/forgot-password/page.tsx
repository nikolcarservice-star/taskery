import { AuthPageShell } from "@/components/account/AuthPageShell";
import { ForgotPasswordForm } from "@/components/PasswordResetForms";
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
    <AuthPageShell
      locale={locale}
      dict={dict}
      title={dict.publicForms.password.pageForgot.title}
      subtitle={dict.publicForms.password.pageForgot.description}
    >
      <ForgotPasswordForm />
    </AuthPageShell>
  );
}
