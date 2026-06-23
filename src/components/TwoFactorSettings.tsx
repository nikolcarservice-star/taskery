"use client";

import {
  confirmTwoFactorSetup,
  disableTwoFactor,
  startTwoFactorSetup,
  type TwoFactorActionState,
} from "@/lib/actions/two-factor";
import { FormActionError } from "@/components/FormActionError";
import { useDictionary } from "@/lib/i18n/dictionary-context";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";

type TwoFactorSettingsProps = {
  twoFactorEnabled: boolean;
  email: string;
};

const initialState: TwoFactorActionState = {};

export function TwoFactorSettings({ twoFactorEnabled, email }: TwoFactorSettingsProps) {
  const dict = useDictionary();
  const t = dict.settings.security;
  const router = useRouter();

  const [setupState, startSetup, setupPending] = useActionState(
    startTwoFactorSetup,
    initialState,
  );
  const [confirmState, confirmAction, confirmPending] = useActionState(
    confirmTwoFactorSetup,
    initialState,
  );
  const [disableState, disableAction, disablePending] = useActionState(
    disableTwoFactor,
    initialState,
  );

  const setupUri = setupState.setupUri;
  const setupSecret = setupState.secret;
  const isSetupMode = !twoFactorEnabled && Boolean(setupUri);

  useEffect(() => {
    if (confirmState.success || disableState.success) {
      router.refresh();
    }
  }, [confirmState.success, disableState.success, router]);

  if (twoFactorEnabled) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" aria-hidden />
          <span className="font-medium">{t.twoFactorEnabled}</span>
        </div>
        <p className="text-sm text-zinc-600">{t.twoFactorWithdrawalsHint}</p>
        <form action={disableAction} className="space-y-3 rounded-xl border border-zinc-200 bg-white p-4">
          <div>
            <label htmlFor="disable-2fa-code" className="block text-sm font-medium text-zinc-700">
              {t.twoFactorCodeLabel}
            </label>
            <input
              id="disable-2fa-code"
              name="code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="\d{6}"
              maxLength={6}
              required
              className="mt-1.5 w-full max-w-xs rounded-lg border border-zinc-200 px-3 py-2.5 text-sm tracking-widest"
            />
          </div>
          <button
            type="submit"
            disabled={disablePending}
            className="inline-flex rounded-lg border border-red-200 bg-white px-4 py-2.5 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
          >
            {disablePending ? t.twoFactorDisabling : t.twoFactorDisable}
          </button>
          <FormActionError error={disableState.error} />
          {disableState.success && (
            <p className="text-sm text-emerald-700">{t.twoFactorDisabledSuccess}</p>
          )}
        </form>
      </div>
    );
  }

  if (isSetupMode && setupUri && setupSecret) {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(setupUri)}`;

    return (
      <div className="space-y-4">
        <p className="text-sm text-zinc-600">{t.twoFactorSetupHint}</p>
        <div className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-4 sm:flex-row sm:items-start">
          <img
            src={qrUrl}
            width={180}
            height={180}
            alt=""
            className="rounded-lg border border-zinc-100 bg-white"
          />
          <div className="min-w-0 flex-1 space-y-2 text-sm">
            <p className="font-medium text-zinc-900">{t.twoFactorSetupTitle}</p>
            <p className="text-zinc-600">
              {t.account}: <span className="font-medium text-zinc-900">{email}</span>
            </p>
            <p className="text-zinc-500">{t.twoFactorSecretLabel}</p>
            <code className="block break-all rounded-lg bg-zinc-100 px-3 py-2 font-mono text-xs text-zinc-800">
              {setupSecret}
            </code>
          </div>
        </div>
        <form action={confirmAction} className="space-y-3">
          <div>
            <label htmlFor="confirm-2fa-code" className="block text-sm font-medium text-zinc-700">
              {t.twoFactorCodeLabel}
            </label>
            <input
              id="confirm-2fa-code"
              name="code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="\d{6}"
              maxLength={6}
              required
              className="mt-1.5 w-full max-w-xs rounded-lg border border-zinc-200 px-3 py-2.5 text-sm tracking-widest"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={confirmPending}
              className="inline-flex rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {confirmPending ? t.twoFactorConfirming : t.twoFactorConfirm}
            </button>
            <button
              type="button"
              disabled={setupPending}
              onClick={() => startSetup()}
              className="text-sm font-medium text-zinc-600 hover:text-zinc-900 disabled:opacity-50"
            >
              {t.twoFactorRestartSetup}
            </button>
          </div>
          <FormActionError error={confirmState.error} />
          <FormActionError error={setupState.error} />
          {confirmState.success && (
            <p className="text-sm text-emerald-700">{t.twoFactorEnabledSuccess}</p>
          )}
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-zinc-600">{t.twoFactorDescription}</p>
      <button
        type="button"
        disabled={setupPending}
        onClick={() => startSetup()}
        className="inline-flex rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
      >
        {setupPending ? t.twoFactorStarting : t.twoFactorEnable}
      </button>
      <FormActionError error={setupState.error} />
    </div>
  );
}
