"use client";

import { APP_LOCALES, localeConfig } from "@/lib/i18n/config";
import { setLocaleCookie } from "@/lib/i18n/cookie-client";
import type { AppLocale } from "@/lib/i18n/types";
import { localizedPath, stripLocalePrefix } from "@/lib/i18n/routing";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type LanguageSwitcherProps = {
  locale: AppLocale;
  className?: string;
  languageAria?: string;
  languagePickerAria?: string;
  placement?: "bottom" | "top";
};

function ChevronDownIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      className={`shrink-0 text-zinc-400 transition-transform duration-200 ${
        open ? "rotate-180 text-indigo-500" : ""
      }`}
    >
      <path
        d="M3.5 5.25L7 8.75L10.5 5.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LanguageSwitcher({
  locale,
  className = "",
  languageAria = "Language: {language}",
  languagePickerAria = "Choose language",
  placement = "bottom",
}: LanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const otherLocales = APP_LOCALES.filter((code) => code !== locale);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const switchLocale = (nextLocale: AppLocale) => {
    if (nextLocale === locale) {
      setOpen(false);
      return;
    }

    setLocaleCookie(nextLocale);
    setOpen(false);

    router.push(localizedPath(nextLocale, stripLocalePrefix(pathname)));
  };

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={languageAria.replace(
          "{language}",
          localeConfig[locale].nativeLabel,
        )}
        onClick={() => setOpen((value) => !value)}
        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-semibold uppercase tracking-wide transition-all duration-200 ${
          open
            ? "border-indigo-200 bg-indigo-50/80 text-indigo-700 shadow-sm shadow-indigo-500/10"
            : "border-zinc-200/90 bg-white/80 text-zinc-700 shadow-sm hover:border-indigo-200 hover:bg-indigo-50/70 hover:text-indigo-700 hover:shadow-md hover:shadow-indigo-500/10"
        }`}
      >
        <span>{locale}</span>
        <ChevronDownIcon open={open} />
      </button>

      {open ? (
        <ul
          role="listbox"
          aria-label={languagePickerAria}
          className={`absolute right-0 z-50 min-w-[10.5rem] overflow-hidden rounded-lg border border-zinc-200/90 bg-white py-1 shadow-md ${
            placement === "top" ? "bottom-full mb-2" : "top-full mt-2"
          }`}
        >
          {otherLocales.map((code) => (
            <li key={code} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={false}
                onClick={() => switchLocale(code)}
                className="flex w-full items-center px-3.5 py-2.5 text-left text-sm text-zinc-700 transition-colors hover:bg-indigo-50 hover:text-indigo-700"
              >
                {localeConfig[code].nativeLabel}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
