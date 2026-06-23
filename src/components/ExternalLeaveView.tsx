"use client";

import { useLocalizedPath } from "@/components/LocalizedLink";
import { useDictionary } from "@/lib/i18n/dictionary-context";
import {
  displayHostname,
  EXTERNAL_LEAVE_COOKIE,
  EXTERNAL_LEAVE_COOKIE_MAX_AGE,
} from "@/lib/external-links";
import Link from "next/link";
import { useState } from "react";

type ExternalLeaveViewProps = {
  targetUrl: string;
};

function ShieldIllustration() {
  return (
    <div className="relative mx-auto flex h-28 w-28 items-center justify-center">
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-400/30 via-violet-400/20 to-fuchsia-400/30 blur-xl" />
      <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-700 shadow-lg shadow-indigo-500/30">
        <svg
          aria-hidden="true"
          className="h-12 w-12 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
          />
        </svg>
      </div>
      <div className="absolute -right-1 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-amber-400 text-sm shadow-md">
        ⚡
      </div>
    </div>
  );
}

export function ExternalLeaveView({ targetUrl }: ExternalLeaveViewProps) {
  const dict = useDictionary();
  const t = dict.externalLeave;
  const l = useLocalizedPath();
  const [remember, setRemember] = useState(false);
  const hostname = displayHostname(targetUrl);

  function handleProceed() {
    if (remember) {
      document.cookie = `${EXTERNAL_LEAVE_COOKIE}=1; path=/; max-age=${EXTERNAL_LEAVE_COOKIE_MAX_AGE}; samesite=lax`;
    }
    window.location.assign(targetUrl);
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-indigo-100 bg-white shadow-xl shadow-indigo-100/60">
      <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500" />

      <div className="px-6 py-10 sm:px-10 sm:py-12">
        <ShieldIllustration />

        <h1 className="mt-8 text-center text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
          {t.title}
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-center text-sm leading-relaxed text-zinc-600 sm:text-base">
          {t.subtitle}
        </p>

        <div className="mx-auto mt-8 max-w-xl rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-4 text-center sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            {t.destinationLabel}
          </p>
          <p className="mt-2 break-all text-lg font-semibold text-indigo-700">{hostname}</p>
          <p className="mt-2 break-all text-xs text-zinc-500">{targetUrl}</p>
        </div>

        <div className="mx-auto mt-8 grid max-w-xl gap-3 sm:grid-cols-2">
          {t.tips.map((tip) => (
            <div
              key={tip}
              className="flex gap-3 rounded-2xl border border-indigo-100 bg-indigo-50/50 px-4 py-3 text-sm leading-relaxed text-indigo-950"
            >
              <span className="mt-0.5 text-indigo-500" aria-hidden="true">
                ✦
              </span>
              <span>{tip}</span>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-8 flex max-w-xl flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={handleProceed}
            className="inline-flex flex-1 items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/25 transition hover:from-indigo-700 hover:to-violet-700"
          >
            {t.proceed}
          </button>
          <Link
            href={l("/")}
            className="inline-flex flex-1 items-center justify-center rounded-xl border border-zinc-300 bg-white px-5 py-3.5 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
          >
            {t.stay}
          </Link>
        </div>

        <label className="mx-auto mt-6 flex max-w-xl cursor-pointer items-start gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-600">
          <input
            type="checkbox"
            checked={remember}
            onChange={(event) => setRemember(event.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
          />
          <span>{t.remember}</span>
        </label>
      </div>
    </div>
  );
}
