"use client";

import { useLocalizedPath } from "@/components/LocalizedLink";
import { useOptionalDictionary } from "@/lib/i18n/dictionary-context";
import Link from "next/link";
import { useEffect, useState } from "react";

const CONSENT_KEY = "cookie-consent";

type ConsentValue = "accepted" | "essential";

export function CookieBanner() {
  const dict = useOptionalDictionary();
  const l = useLocalizedPath();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (!stored) {
      setVisible(true);
    }
  }, []);

  function saveConsent(value: ConsentValue) {
    localStorage.setItem(CONSENT_KEY, value);
    setVisible(false);
  }

  if (!visible) return null;

  const c = dict?.cookies;
  const title = c?.title ?? "We use cookies";
  const bodyBeforeLink =
    c?.bodyBeforeLink ??
    "Taskery uses cookies to keep you signed in, remember your preferences, and analyze site traffic. By clicking \"Accept all\", you consent to our use of cookies as described in our ";
  const privacyLink = c?.privacyLink ?? "Privacy Policy";
  const bodyAfterLink =
    c?.bodyAfterLink ?? ". Essential cookies are required for the site to function.";
  const essentialOnly = c?.essentialOnly ?? "Essential only";
  const acceptAll = c?.acceptAll ?? "Accept all";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-banner-title"
    >
      <div className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl">
        <h2
          id="cookie-banner-title"
          className="text-lg font-semibold text-zinc-900"
        >
          {title}
        </h2>
        <p className="mt-2 text-sm leading-6 text-zinc-600">
          {bodyBeforeLink}
          <Link href={l("/privacy")} className="text-blue-600 underline">
            {privacyLink}
          </Link>
          {bodyAfterLink}
        </p>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => saveConsent("essential")}
            className="rounded-full border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
          >
            {essentialOnly}
          </button>
          <button
            type="button"
            onClick={() => saveConsent("accepted")}
            className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-700"
          >
            {acceptAll}
          </button>
        </div>
      </div>
    </div>
  );
}
