import { GuestHeaderMobileNav } from "@/components/GuestHeaderMobileNav";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Logo } from "@/components/Logo";
import type { AppLocale, Dictionary } from "@/lib/i18n/types";
import { defaultLocale } from "@/lib/i18n/config";
import { localizedPath } from "@/lib/i18n/routing";
import ruMessages from "@/messages/ru.json";
import Link from "next/link";

export const GUEST_HEADER_HEIGHT_CLASS = "h-16 md:h-[72px]";

type GuestHeaderProps = {
  locale?: AppLocale;
  dict?: Dictionary;
};

function UsersSearchIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className="shrink-0 opacity-70 transition-opacity group-hover:opacity-100"
    >
      <circle cx="6.5" cy="5.5" r="2.75" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M9.2 8.2L12.5 11.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M2.5 12.5C3.4 10.8 4.8 9.75 6.5 9.75C8.2 9.75 9.6 10.8 10.5 12.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      className="shrink-0 transition-transform duration-200 group-hover:translate-x-0.5"
    >
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

export function GuestHeader({
  locale = defaultLocale,
  dict = ruMessages,
}: GuestHeaderProps) {
  const { header } = dict;

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-zinc-200/60 bg-white/80 font-sans shadow-[0_8px_30px_-12px_rgba(15,23,42,0.12)] backdrop-blur-xl backdrop-saturate-150">
        <div
          className={`mx-auto flex w-full max-w-[1440px] items-center justify-between gap-3 overflow-visible px-4 sm:gap-6 sm:px-8 lg:px-10 xl:px-12 ${GUEST_HEADER_HEIGHT_CLASS}`}
        >
          <Logo
            size="header"
            href={localizedPath(locale)}
            showTagline
            hideTaglineOnMobile
            tagline={dict.header.tagline}
            homeAriaLabel={dict.header.homeAria}
            className="min-w-0 shrink"
          />

          <nav className="hidden items-center gap-1.5 md:flex md:gap-2">
            <LanguageSwitcher
              locale={locale}
              className="hidden lg:flex"
              languageAria={header.languageAria}
              languagePickerAria={header.languagePickerAria}
            />

            <Link
              href={localizedPath(locale, "/freelancers")}
              className="group inline-flex items-center gap-2 rounded-full border border-zinc-200/90 bg-zinc-50/80 px-3.5 py-2 text-sm font-medium text-zinc-700 shadow-sm transition-all duration-200 hover:border-indigo-200 hover:bg-indigo-50/70 hover:text-indigo-700 hover:shadow-md hover:shadow-indigo-500/10 sm:px-4 sm:py-2.5"
            >
              <UsersSearchIcon />
              <span className="hidden sm:inline">{header.findFreelancer}</span>
              <span className="sm:hidden">{header.findFreelancerShort}</span>
            </Link>

            <span
              aria-hidden
              className="mx-0.5 hidden h-5 w-px bg-gradient-to-b from-transparent via-zinc-200 to-transparent lg:block"
            />

            <Link
              href={localizedPath(locale, "/login")}
              className="rounded-full px-3.5 py-2 text-sm font-medium text-zinc-600 transition-all duration-200 hover:bg-zinc-100/90 hover:text-zinc-900 sm:px-4 sm:py-2.5"
            >
              {header.login}
            </Link>

            <Link
              href={localizedPath(locale, "/register")}
              className="group inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-500/25 transition-all duration-200 hover:from-indigo-500 hover:to-violet-500 hover:shadow-lg hover:shadow-indigo-500/30 sm:gap-2 sm:px-5 sm:py-2.5"
            >
              {header.register}
              <ArrowRightIcon />
            </Link>
          </nav>

          <div className="flex items-center gap-2 md:hidden">
            <GuestHeaderMobileNav locale={locale} dict={dict} />
          </div>
        </div>
      </header>
      <div aria-hidden className={`${GUEST_HEADER_HEIGHT_CLASS} shrink-0`} />
    </>
  );
}
