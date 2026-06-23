import { LandingVerifiedVisual } from "@/components/LandingVerifiedVisual";
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

export function LandingVerifiedSection({
  locale,
  dict,
}: {
  locale: AppLocale;
  dict: Dictionary;
}) {
  const copy = dict.landing.verified;

  return (
    <section className="relative overflow-hidden bg-zinc-50 py-14 sm:py-16 lg:py-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.07),transparent_45%)]"
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10 xl:px-12">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-16">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
              {copy.eyebrow}
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl lg:text-[2.5rem] lg:leading-tight">
              {copy.title}
            </h2>
            <p className="mt-4 text-[15px] leading-7 text-zinc-600 sm:text-base">
              {copy.description}
            </p>

            <ul className="mt-8 space-y-5">
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

            <Link
              href={localizedPath(locale, "/freelancers")}
              className="mt-8 inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:from-indigo-500 hover:to-violet-500 hover:shadow-xl hover:shadow-indigo-500/30 sm:w-auto sm:text-base"
            >
              {copy.cta}
            </Link>
          </div>

          <div className="relative mx-auto w-full max-w-[500px] lg:mx-0 lg:justify-self-end">
            <div
              aria-hidden
              className="absolute inset-6 rounded-[2rem] bg-gradient-to-br from-violet-100/70 via-indigo-100/50 to-transparent blur-2xl"
            />
            <LandingVerifiedVisual
              className="relative z-10 h-auto w-full"
              labels={copy.visual}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
