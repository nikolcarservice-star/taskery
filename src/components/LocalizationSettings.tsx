"use client";

import { setLocaleCookie } from "@/lib/i18n/cookie-client";
import { useDictionary } from "@/lib/i18n/dictionary-context";
import { LOCALE_OPTIONS } from "@/lib/settings-shared";
import type { AppLocale } from "@/lib/i18n/types";
import { isAppLocale } from "@/lib/i18n/config";
import { localizedPath, stripLocalePrefix } from "@/lib/i18n/routing";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useState, useTransition } from "react";

type LocalizationSettingsProps = {
  interfaceLanguage: string;
  autoTranslate: boolean;
};

export function LocalizationSettings({
  interfaceLanguage: initialLanguage,
}: LocalizationSettingsProps) {
  const dict = useDictionary();
  const t = dict.settings.localization;
  const localeLabels = dict.settings.localeOptions;
  const router = useRouter();
  const pathname = usePathname();
  const [interfaceLanguage, setInterfaceLanguage] = useState(initialLanguage);
  const [error, setError] = useState<string | null>(null);
  const [savedHint, setSavedHint] = useState(false);
  const [pending, startTransition] = useTransition();

  const persist = useCallback(
    async (patch: { interfaceLanguage?: AppLocale }) => {
      setError(null);
      setSavedHint(false);

      const res = await fetch("/api/user/locale-settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });

      const data = (await res.json()) as { error?: string };

      if (!res.ok) {
        setError(data.error ?? t.saveError);
        return false;
      }

      setSavedHint(true);
      window.setTimeout(() => setSavedHint(false), 2000);
      return true;
    },
    [t.saveError],
  );

  async function handleLanguageChange(nextLocale: AppLocale) {
    if (nextLocale === interfaceLanguage || pending) return;

    const previous = interfaceLanguage;
    setInterfaceLanguage(nextLocale);
    setLocaleCookie(nextLocale);

    startTransition(async () => {
      const ok = await persist({ interfaceLanguage: nextLocale });
      if (!ok) {
        setInterfaceLanguage(previous);
        setLocaleCookie(previous as AppLocale);
        return;
      }

      router.push(localizedPath(nextLocale, stripLocalePrefix(pathname)));
      router.refresh();
    });
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-medium text-zinc-700">{t.preferredLanguage}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {LOCALE_OPTIONS.map((option) => {
            const value = option.value;
            const checked = interfaceLanguage === value;
            const label = isAppLocale(value) ? localeLabels[value] : option.label;
            return (
              <label
                key={value}
                className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${
                  checked
                    ? "border-indigo-400 bg-indigo-50"
                    : "border-zinc-200 hover:border-zinc-300"
                } ${pending ? "pointer-events-none opacity-60" : ""}`}
              >
                <input
                  type="radio"
                  name="interfaceLanguage"
                  value={value}
                  checked={checked}
                  disabled={pending}
                  onChange={() => {
                    if (isAppLocale(value)) {
                      void handleLanguageChange(value);
                    }
                  }}
                  className="h-4 w-4 border-zinc-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span>{option.flag}</span>
                <span>{label}</span>
              </label>
            );
          })}
        </div>
      </div>

      <label
        className={`flex items-start gap-3 text-sm text-zinc-500 ${
          pending ? "cursor-wait opacity-60" : "cursor-not-allowed"
        }`}
        title={t.autoTranslateSoon}
      >
        <input
          type="checkbox"
          checked={false}
          disabled
          readOnly
          className="mt-0.5 h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
        />
        <span>
          {t.autoTranslate}{" "}
          <span className="text-xs text-zinc-400">({t.autoTranslateSoon})</span>
        </span>
      </label>

      {(error || savedHint) && (
        <p
          className={`text-sm ${error ? "text-red-600" : "text-emerald-700"}`}
          role={error ? "alert" : "status"}
        >
          {error ?? t.saved}
        </p>
      )}
    </div>
  );
}
