import { LandingFreelancersVisual } from "@/components/LandingFreelancersVisual";
import type { AppLocale, Dictionary } from "@/lib/i18n/types";
import { localizedPath } from "@/lib/i18n/routing";
import Link from "next/link";

export function LandingFreelancersSection({
  locale,
  dict,
}: {
  locale: AppLocale;
  dict: Dictionary;
}) {
  const copy = dict.landing.freelancers;

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
          <p className="mt-4 text-[15px] leading-7 text-zinc-600 sm:text-base">
            {copy.description}
          </p>
        </div>

        <div className="mt-10 grid items-center gap-10 lg:mt-12 lg:grid-cols-2 lg:gap-14 xl:gap-16">
          <div className="relative order-2 mx-auto w-full max-w-[500px] lg:order-1 lg:mx-0">
            <div
              aria-hidden
              className="absolute inset-6 rounded-[2rem] bg-gradient-to-br from-indigo-100/70 via-violet-100/50 to-transparent blur-2xl"
            />
            <LandingFreelancersVisual
              className="relative z-10 h-auto w-full"
              labels={copy.visual}
            />
          </div>

          <div className="order-1 lg:order-2">
            <div className="grid gap-4 sm:grid-cols-2">
              {copy.reasons.map((reason) => (
                <article
                  key={reason.title}
                  className="rounded-3xl border border-zinc-200/80 bg-zinc-50/70 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-200/80 hover:shadow-md hover:shadow-indigo-500/5"
                >
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 text-sm font-bold text-white shadow-md shadow-indigo-500/20">
                    {reason.title.slice(0, 1)}
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-zinc-900">
                    {reason.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-600">{reason.text}</p>
                </article>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href={localizedPath(locale, "/projects")}
                className="inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:from-indigo-500 hover:to-violet-500 hover:shadow-xl hover:shadow-indigo-500/30 sm:w-auto sm:text-base"
              >
                {copy.ctaProjects}
              </Link>
              <Link
                href={localizedPath(locale, "/boost")}
                className="inline-flex w-full items-center justify-center rounded-2xl border border-zinc-200 bg-white px-6 py-3.5 text-sm font-medium text-zinc-700 shadow-sm transition-all duration-200 hover:border-indigo-200 hover:bg-indigo-50/50 hover:text-indigo-700 sm:w-auto"
              >
                {copy.ctaBoost}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
