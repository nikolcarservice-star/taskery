"use client";

import {
  createAdminTelegramLinkToken,
  disconnectAdminTelegram,
  getAdminTelegramLinkStatus,
  setAdminTelegramAlertsEnabled,
} from "@/lib/actions/admin-telegram";
import { getAdminCopy } from "@/lib/admin-i18n";
import type { AppLocale } from "@/lib/i18n/types";
import { useCallback, useEffect, useState, useTransition } from "react";

type AdminTelegramSettingsProps = {
  locale: AppLocale;
};

export function AdminTelegramSettings({ locale }: AdminTelegramSettingsProps) {
  const t = getAdminCopy(locale).telegram;
  const [linked, setLinked] = useState(false);
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [linkUrl, setLinkUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const refresh = useCallback(() => {
    startTransition(async () => {
      const status = await getAdminTelegramLinkStatus();
      if (status.error) {
        setError(
          status.error === "NOT_CONFIGURED" ? t.notConfigured : status.error,
        );
        return;
      }
      setLinked(Boolean(status.linked));
      setAlertsEnabled(status.alertsEnabled ?? true);
      if (status.token && status.botUsername) {
        setLinkUrl(
          `https://t.me/${status.botUsername}?start=${status.token}`,
        );
      } else {
        setLinkUrl(null);
      }
    });
  }, [t.notConfigured]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleConnect = () => {
    setError(null);
    startTransition(async () => {
      const result = await createAdminTelegramLinkToken();
      if (result.error) {
        setError(
          result.error === "NOT_CONFIGURED" ? t.notConfigured : result.error,
        );
        return;
      }
      if (result.token && result.botUsername) {
        setLinkUrl(
          `https://t.me/${result.botUsername}?start=${result.token}`,
        );
      }
    });
  };

  const handleDisconnect = () => {
    startTransition(async () => {
      await disconnectAdminTelegram();
      setLinked(false);
      setAlertsEnabled(true);
      setLinkUrl(null);
    });
  };

  const handleAlertsToggle = (next: boolean) => {
    startTransition(async () => {
      const result = await setAdminTelegramAlertsEnabled(next);
      if (result.error) {
        setError(result.error);
        return;
      }
      setAlertsEnabled(next);
    });
  };

  if (error === t.notConfigured) {
    return <p className="text-sm text-zinc-500">{t.notConfigured}</p>;
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-zinc-500">{t.hint}</p>
      {linked ? (
        <>
          <p className="text-sm text-emerald-700">{t.connected}</p>
          <label className="flex cursor-pointer items-start gap-3 text-sm text-zinc-700">
            <input
              type="checkbox"
              checked={alertsEnabled}
              disabled={pending}
              onChange={(event) => handleAlertsToggle(event.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-zinc-300 text-red-600 focus:ring-red-500"
            />
            <span>{t.alertsToggle}</span>
          </label>
          <button
            type="button"
            disabled={pending}
            onClick={handleDisconnect}
            className="text-sm font-medium text-red-600 hover:underline disabled:opacity-50"
          >
            {t.disconnect}
          </button>
        </>
      ) : (
        <>
          <p className="text-sm text-zinc-600">{t.connectHint}</p>
          {linkUrl ? (
            <a
              href={linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              {t.openBot}
            </a>
          ) : (
            <button
              type="button"
              disabled={pending}
              onClick={handleConnect}
              className="inline-flex rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
            >
              {pending ? t.linking : t.connect}
            </button>
          )}
        </>
      )}
      {error && error !== t.notConfigured && (
        <p className="text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}
