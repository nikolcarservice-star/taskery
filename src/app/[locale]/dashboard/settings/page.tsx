import { FreelancerSettings } from "@/components/FreelancerSettings";
import { getDictionary } from "@/lib/i18n/dictionary";
import { requireAppLocale } from "@/lib/i18n/locale-page";
import { localizedPath } from "@/lib/i18n/routing";
import { createMetadata } from "@/lib/metadata";
import { ensureUserSettings, getUserSettings } from "@/lib/settings";
import { requireFreelancer } from "@/lib/session";
import { Suspense } from "react";

type SettingsPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: SettingsPageProps) {
  const locale = await requireAppLocale(params);
  const dict = await getDictionary(locale);

  return createMetadata({
    title: dict.settings.title,
    description: dict.settings.description,
    path: "/dashboard/settings",
    locale,
    noIndex: true,
  });
}

function SettingsFallback() {
  return <div className="mt-6 h-40 animate-pulse rounded-xl bg-zinc-100" />;
}

export default async function SettingsPage({ params }: SettingsPageProps) {
  const locale = await requireAppLocale(params);
  const dict = await getDictionary(locale);
  const session = await requireFreelancer(
    localizedPath(locale, "/dashboard/settings"),
  );
  await ensureUserSettings(session.user.id);
  const settings = await getUserSettings(session.user.id);

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
      <h1 className="text-2xl font-bold text-zinc-900">{dict.settings.title}</h1>
      <p className="mt-2 text-sm text-zinc-600">{dict.settings.description}</p>

      <Suspense fallback={<SettingsFallback />}>
        <FreelancerSettings settings={settings} />
      </Suspense>
    </div>
  );
}
