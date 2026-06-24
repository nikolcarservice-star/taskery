"use client";

import { updateServiceSettings, type ActionState } from "@/lib/actions/settings";
import { FormActionError } from "@/components/FormActionError";
import { LocalizationSettings } from "@/components/LocalizationSettings";
import { useLocalizedPath } from "@/components/LocalizedLink";
import { TwoFactorSettings } from "@/components/TwoFactorSettings";
import { PushBrowserSettings } from "@/components/PushBrowserSettings";
import { SessionLogoutAllButton } from "@/components/SessionLogoutAllButton";
import { TelegramSettings } from "@/components/TelegramSettings";
import { useDictionary } from "@/lib/i18n/dictionary-context";
import { stripLocalePrefix } from "@/lib/i18n/routing";
import {
  THEME_OPTIONS,
  type SettingsTab,
  type UserSettingsData,
} from "@/lib/settings-shared";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useActionState } from "react";

type FreelancerSettingsProps = {
  settings: UserSettingsData;
};

const initialState: ActionState = {};

function SettingsSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4 border-b border-zinc-100 pb-8 last:border-b-0 last:pb-0">
      <div>
        <h2 className="text-base font-semibold text-zinc-900">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-zinc-500">{description}</p>
        )}
      </div>
      {children}
    </section>
  );
}

function CheckboxRow({
  name,
  label,
  defaultChecked,
  disabled,
  hint,
}: {
  name: string;
  label: string;
  defaultChecked?: boolean;
  disabled?: boolean;
  hint?: string;
}) {
  return (
    <label
      className={`flex items-start gap-3 text-sm ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer text-zinc-700"}`}
    >
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        disabled={disabled}
        className="mt-0.5 h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500 disabled:opacity-50"
      />
      <span>
        {label}
        {hint && (
          <span className="mt-0.5 block text-xs text-zinc-400">{hint}</span>
        )}
      </span>
    </label>
  );
}

function ServiceSettingsTab({
  settings,
  isClient,
}: {
  settings: UserSettingsData;
  isClient: boolean;
}) {
  const dict = useDictionary();
  const t = dict.settings;
  const [state, formAction, pending] = useActionState(
    updateServiceSettings,
    initialState,
  );

  const themeLabels: Record<string, string> = {
    light: t.theme.light,
    dark: t.theme.dark,
  };

  return (
    <form action={formAction} className="space-y-8">
      <div className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-3.5 text-sm text-sky-950">
        {t.emailBanner}
      </div>

      <SettingsSection title={t.sections.email}>
        <div className="space-y-3">
          {!isClient && (
            <CheckboxRow
              name="emailProjectDigest"
              label={t.email.projectDigest}
              defaultChecked={settings.emailProjectDigest}
            />
          )}
          <CheckboxRow
            name="emailNewMessages"
            label={t.email.newMessages}
            defaultChecked={settings.emailNewMessages}
          />
          <CheckboxRow
            name="emailServiceInfo"
            label={t.email.serviceInfo}
            defaultChecked={settings.emailServiceInfo}
          />
          <CheckboxRow
            name="emailPromotions"
            label={t.email.promotions}
            defaultChecked={settings.emailPromotions}
          />
          <CheckboxRow
            name="emailNews"
            label={t.email.news}
            defaultChecked={settings.emailNews}
          />
          <CheckboxRow
            name="emailBlogDigest"
            label={t.email.blogDigest}
            defaultChecked={settings.emailBlogDigest}
          />
        </div>
      </SettingsSection>

      <SettingsSection
        title={t.sections.telegram}
        description={t.sections.telegramHint}
      >
        <TelegramSettings />
      </SettingsSection>

      <SettingsSection title={t.sections.push}>
        <PushBrowserSettings initialEnabled={settings.pushBrowser} />
        <div className="mt-3">
          <CheckboxRow
            name="soundNewMessages"
            label={t.email.soundMessages}
            defaultChecked={settings.soundNewMessages}
            hint={t.email.soundHint}
          />
        </div>
      </SettingsSection>

      <SettingsSection title={t.sections.localization}>
        <LocalizationSettings
          interfaceLanguage={settings.interfaceLanguage}
          autoTranslate={settings.autoTranslate}
        />
      </SettingsSection>

      <SettingsSection title={t.sections.visual}>
        <div className="flex flex-wrap gap-3">
          {THEME_OPTIONS.map((option) => (
            <label
              key={option.value}
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-200 px-4 py-2.5 text-sm has-[:checked]:border-indigo-400 has-[:checked]:bg-indigo-50"
            >
              <input
                type="radio"
                name="theme"
                value={option.value}
                defaultChecked={settings.theme === option.value}
                disabled={option.value === "dark"}
                className="h-4 w-4 border-zinc-300 text-indigo-600 focus:ring-indigo-500 disabled:opacity-50"
              />
              {themeLabels[option.value] ?? option.label}
              {option.value === "dark" && (
                <span className="text-xs text-zinc-400">{t.theme.darkSoon}</span>
              )}
            </label>
          ))}
        </div>
      </SettingsSection>

      <div className="flex flex-wrap items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 disabled:opacity-50"
        >
          {pending ? t.saving : t.save}
        </button>
        <FormActionError error={state.error} className="text-sm text-red-600" />
        {state.success && (
          <p className="text-sm text-emerald-700">{t.saved}</p>
        )}
      </div>
    </form>
  );
}

function SecuritySettingsTab({
  email,
  twoFactorEnabled,
  personalPath,
}: {
  email: string;
  twoFactorEnabled: boolean;
  personalPath: string;
}) {
  const dict = useDictionary();
  const t = dict.settings.security;
  const l = useLocalizedPath();

  return (
    <div className="space-y-8">
      <SettingsSection title={t.password} description={t.passwordHint}>
        <div className="rounded-lg bg-zinc-50 px-4 py-3 text-sm text-zinc-600">
          {t.account}: <span className="font-medium text-zinc-900">{email}</span>
        </div>
        <Link
          href={l("/forgot-password")}
          className="inline-flex rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50"
        >
          {t.changePassword}
        </Link>
      </SettingsSection>

      <SettingsSection title={t.twoFactor} description={t.twoFactorWithdrawalsHint}>
        <TwoFactorSettings twoFactorEnabled={twoFactorEnabled} email={email} />
      </SettingsSection>

      <SettingsSection title={t.sessions}>
        <SessionLogoutAllButton />
      </SettingsSection>

      <SettingsSection title={t.personalData}>
        <Link
          href={personalPath}
          className="inline-flex text-sm font-medium text-indigo-600 hover:underline"
        >
          {t.personalDataLink}
        </Link>
      </SettingsSection>
    </div>
  );
}

export function FreelancerSettings({ settings }: FreelancerSettingsProps) {
  const dict = useDictionary();
  const l = useLocalizedPath();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const pathWithoutLocale = stripLocalePrefix(pathname);
  const isClient = pathWithoutLocale.startsWith("/client");
  const settingsBase = l(isClient ? "/client/settings" : "/dashboard/settings");
  const personalPath = l(isClient ? "/client/personal" : "/dashboard/personal");
  const tabParam = searchParams.get("tab");
  const activeTab: SettingsTab = tabParam === "security" ? "security" : "service";

  const tabs: { id: SettingsTab; label: string }[] = [
    { id: "service", label: dict.settings.tabs.service },
    { id: "security", label: dict.settings.tabs.security },
  ];

  function setTab(tab: SettingsTab) {
    const params = new URLSearchParams(searchParams.toString());
    if (tab === "service") params.delete("tab");
    else params.set("tab", tab);
    const query = params.toString();
    router.push(query ? `${settingsBase}?${query}` : settingsBase);
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 border-b border-zinc-200 pb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setTab(tab.id)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {activeTab === "service" ? (
          <ServiceSettingsTab settings={settings} isClient={isClient} />
        ) : (
          <SecuritySettingsTab
            email={settings.email}
            twoFactorEnabled={settings.twoFactorEnabled}
            personalPath={personalPath}
          />
        )}
      </div>
    </div>
  );
}
