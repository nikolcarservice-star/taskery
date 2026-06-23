import { LandingClientsVisual } from "@/components/LandingClientsVisual";
import type { AppLocale, Dictionary } from "@/lib/i18n/types";
import { localizedPath } from "@/lib/i18n/routing";
import Link from "next/link";

function CheckIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <path
        d="M2.5 7.2L5.4 10.1L11.5 3.9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LandingClientsSection({
  locale,
  dict,
}: {
  locale: AppLocale;
  dict: Dictionary;
}) {
  const copy = dict.landing.clients;

  return (
    <section className="border-y border-zinc-200/80 bg-white py-14 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10 xl:px-12">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
            {copy.eyebrow}
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl lg:text-[2.5rem] lg:leading-tight">
            {copy.title}
          </h2>
        </div>

        <div className="mt-10 grid items-center gap-10 lg:mt-12 lg:grid-cols-2 lg:gap-14 xl:gap-16">
          <div className="relative mx-auto w-full max-w-[480px] lg:mx-0">
            <div
              aria-hidden
              className="absolute inset-6 rounded-[2rem] bg-gradient-to-br from-indigo-100/70 via-violet-100/50 to-transparent blur-2xl"
            />
            <LandingClientsVisual className="relative z-10 h-auto w-full" />
          </div>

          <div className="max-w-xl lg:justify-self-end">
            <ul className="space-y-5">
              {copy.benefits.map((benefit) => (
                <li key={benefit} className="flex gap-4">
                  <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-md shadow-indigo-500/20">
                    <CheckIcon />
                  </span>
                  <p className="pt-0.5 text-[15px] leading-7 text-zinc-600 sm:text-base">
                    {benefit}
                  </p>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <Link
                href={localizedPath(locale, "/register")}
                className="inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:from-indigo-500 hover:to-violet-500 hover:shadow-xl hover:shadow-indigo-500/30 sm:w-auto sm:text-base"
              >
                {copy.cta}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
