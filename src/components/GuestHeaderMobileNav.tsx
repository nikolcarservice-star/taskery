"use client";

import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import type { AppLocale, Dictionary } from "@/lib/i18n/types";
import { localizedPath } from "@/lib/i18n/routing";
import Link from "next/link";
import { useEffect, useState } from "react";

type GuestHeaderMobileNavProps = {
  locale: AppLocale;
  dict: Dictionary;
};

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M3.5 5.5H16.5M3.5 10H16.5M3.5 14.5H16.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M5 5L15 15M15 5L5 15"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d="M2.5 7H11.5M11.5 7L7.5 3M11.5 7L7.5 11"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function GuestHeaderMobileNav({ locale, dict }: GuestHeaderMobileNavProps) {
  const { header } = dict;
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const close = () => setOpen(false);

  return (
    <>
      <Link
        href={localizedPath(locale, "/register")}
        className="inline-flex shrink-0 items-center rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-3.5 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-500/25 transition-all duration-200 hover:from-indigo-500 hover:to-violet-500 md:hidden"
      >
        {header.register}
      </Link>

      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="guest-mobile-nav"
        aria-label={header.menuOpenAria}
        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 shadow-sm transition-colors hover:border-indigo-200 hover:bg-indigo-50/70 hover:text-indigo-700 md:hidden"
      >
        <MenuIcon />
      </button>

      <div
        className={`fixed inset-0 z-[60] md:hidden ${open ? "pointer-events-auto" : "pointer-events-none"}`}
        aria-hidden={!open}
      >
        <button
          type="button"
          aria-label={header.menuCloseAria}
          onClick={close}
          className={`absolute inset-0 bg-zinc-900/40 backdrop-blur-[2px] transition-opacity duration-300 ${
            open ? "opacity-100" : "opacity-0"
          }`}
        />

        <nav
          id="guest-mobile-nav"
          aria-label={header.menuNavAria}
          className={`absolute inset-y-0 right-0 flex w-[min(100vw,320px)] flex-col border-l border-zinc-200/80 bg-white shadow-2xl transition-transform duration-300 ease-out ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4">
            <p className="text-sm font-semibold text-zinc-900">{header.menuTitle}</p>
            <button
              type="button"
              onClick={close}
              aria-label={header.menuCloseAria}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
            >
              <CloseIcon />
            </button>
          </div>

          <div className="flex flex-1 flex-col gap-2 overflow-y-auto px-4 py-5">
            <Link
              href={localizedPath(locale, "/register")}
              onClick={close}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25"
            >
              {header.register}
              <ArrowRightIcon />
            </Link>

            <Link
              href={localizedPath(locale, "/login")}
              onClick={close}
              className="inline-flex w-full items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-3.5 text-sm font-medium text-zinc-700"
            >
              {header.login}
            </Link>

            <div className="my-2 h-px bg-zinc-100" />

            <Link
              href={localizedPath(locale, "/freelancers")}
              onClick={close}
              className="rounded-2xl px-4 py-3.5 text-[15px] font-medium text-zinc-800 transition-colors hover:bg-indigo-50/70 hover:text-indigo-700"
            >
              {header.findFreelancer}
            </Link>

            <Link
              href={localizedPath(locale, "/projects")}
              onClick={close}
              className="rounded-2xl px-4 py-3.5 text-[15px] font-medium text-zinc-800 transition-colors hover:bg-indigo-50/70 hover:text-indigo-700"
            >
              {header.findProject}
            </Link>

            <Link
              href={localizedPath(locale, "/pricing")}
              onClick={close}
              className="rounded-2xl px-4 py-3.5 text-[15px] font-medium text-zinc-800 transition-colors hover:bg-indigo-50/70 hover:text-indigo-700"
            >
              {dict.footer.links.pricing}
            </Link>
          </div>

          <div className="border-t border-zinc-100 px-4 py-4">
            <LanguageSwitcher
              locale={locale}
              className="w-full [&>button]:flex [&>button]:w-full [&>button]:justify-between"
              languageAria={header.languageAria}
              languagePickerAria={header.languagePickerAria}
            />
          </div>
        </nav>
      </div>
    </>
  );
}
