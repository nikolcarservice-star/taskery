"use client";

import { useDictionary } from "@/lib/i18n/dictionary-context";
import { useCallback, useEffect, useState } from "react";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i += 1) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

type PushBrowserSettingsProps = {
  initialEnabled: boolean;
};

export function PushBrowserSettings({ initialEnabled }: PushBrowserSettingsProps) {
  const dict = useDictionary();
  const t = dict.settings.email;
  const [enabled, setEnabled] = useState(initialEnabled);
  const [available, setAvailable] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setAvailable(
      typeof window !== "undefined" &&
        "serviceWorker" in navigator &&
        "PushManager" in window &&
        "Notification" in window,
    );
  }, []);

  const subscribe = useCallback(async () => {
    setBusy(true);
    setError(null);

    try {
      const keyResponse = await fetch("/api/push/vapid-public-key");
      if (!keyResponse.ok) {
        throw new Error(t.pushNotConfigured);
      }

      const { publicKey } = (await keyResponse.json()) as { publicKey: string };
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        throw new Error(t.pushPermissionDenied);
      }

      const registration = await navigator.serviceWorker.register("/sw.js");
      await navigator.serviceWorker.ready;

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });

      const json = subscription.toJSON();
      if (!json.endpoint || !json.keys?.p256dh || !json.keys.auth) {
        throw new Error(t.pushSubscribeFailed);
      }

      const response = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          endpoint: json.endpoint,
          keys: { p256dh: json.keys.p256dh, auth: json.keys.auth },
        }),
      });

      if (!response.ok) {
        throw new Error(t.pushSubscribeFailed);
      }

      setEnabled(true);
    } catch (subscribeError) {
      setEnabled(false);
      setError(
        subscribeError instanceof Error ? subscribeError.message : t.pushSubscribeFailed,
      );
    } finally {
      setBusy(false);
    }
  }, [t]);

  const unsubscribe = useCallback(async () => {
    setBusy(true);
    setError(null);

    try {
      const registration = await navigator.serviceWorker.getRegistration("/sw.js");
      const subscription = await registration?.pushManager.getSubscription();

      await fetch("/api/push/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ endpoint: subscription?.endpoint }),
      });

      await subscription?.unsubscribe();
      setEnabled(false);
    } catch {
      setError(t.pushUnsubscribeFailed);
    } finally {
      setBusy(false);
    }
  }, [t]);

  const handleToggle = async () => {
    if (busy) return;
    if (enabled) {
      await unsubscribe();
    } else {
      await subscribe();
    }
  };

  if (!available) {
    return (
      <p className="text-sm text-zinc-500">{t.pushUnsupported}</p>
    );
  }

  return (
    <div className="space-y-2">
      <label className="flex cursor-pointer items-start gap-3 text-sm text-zinc-700">
        <input
          type="checkbox"
          checked={enabled}
          disabled={busy}
          onChange={handleToggle}
          className="mt-0.5 h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500 disabled:opacity-50"
        />
        <span>
          {t.pushBrowser}
          <span className="mt-0.5 block text-xs text-zinc-400">
            {busy ? t.pushWorking : t.pushHint}
          </span>
        </span>
      </label>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
