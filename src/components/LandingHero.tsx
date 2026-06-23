import { LandingHeroVisual } from "@/components/LandingHeroVisual";
import type { AppLocale, Dictionary } from "@/lib/i18n/types";
import { localizedPath } from "@/lib/i18n/routing";
import Link from "next/link";

type LandingHeroProps = {
  locale: AppLocale;
  dict: Dictionary;
};

function ArrowRightIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className="transition-transform duration-200 group-hover:translate-x-0.5"
    >
      <path
        d="M3 8H13M13 8L9 4M13 8L9 12"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LandingHero({ locale, dict }: LandingHeroProps) {
  const { hero } = dict.landing;
  const highlights = [
    { value: "10%", label: hero.highlights.commission },
    { value: "100%", label: hero.highlights.escrow },
    { value: "24/7", label: hero.highlights.access },
  ];

  return (
    <section className="relative flex flex-col overflow-hidden lg:min-h-[calc(100svh-72px)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.12),transparent_42%),radial-gradient(circle_at_85%_20%,rgba(139,92,246,0.1),transparent_36%),linear-gradient(180deg,#fafafa_0%,#ffffff_55%,#f8fafc_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-16 h-56 w-56 rounded-full bg-indigo-200/30 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 top-24 h-64 w-64 rounded-full bg-violet-200/25 blur-3xl"
      />

      <div className="relative mx-auto flex w-full max-w-7xl flex-col px-4 py-6 sm:px-8 sm:py-8 lg:min-h-0 lg:flex-1 lg:px-10 lg:py-6 xl:px-12">
        <div className="grid items-center gap-8 lg:min-h-0 lg:flex-1 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] lg:gap-8 xl:gap-10">
          <div className="max-w-xl lg:max-w-2xl">
            <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-indigo-200/80 bg-white/80 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-indigo-700 shadow-sm backdrop-blur-sm sm:px-3 sm:text-[11px] sm:tracking-[0.16em]">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
              <span className="truncate">{hero.badge}</span>
            </div>

            <h1 className="mt-4 text-[1.85rem] font-bold leading-[1.1] tracking-tight text-zinc-900 sm:text-4xl lg:mt-4 lg:text-[2.65rem] xl:text-5xl">
              {hero.titleLine1}
              <span className="block bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent">
                {hero.titleLine2}
              </span>
            </h1>

            <p className="mt-4 max-w-lg text-[15px] leading-7 text-zinc-600 sm:text-base lg:mt-4">
              {hero.description}
            </p>

            <div className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap lg:mt-5">
              <Link
                href={localizedPath(locale, "/register")}
                className="group inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:from-indigo-500 hover:to-violet-500 hover:shadow-xl hover:shadow-indigo-500/30 sm:w-auto sm:py-2.5"
              >
                {hero.ctaPrimary}
                <ArrowRightIcon />
              </Link>
              <Link
                href={localizedPath(locale, "/projects")}
                className="inline-flex w-full items-center justify-center rounded-full border border-zinc-200 bg-white/90 px-5 py-3.5 text-sm font-medium text-zinc-700 shadow-sm transition-all duration-200 hover:border-zinc-300 hover:bg-white hover:shadow-md sm:w-auto sm:py-2.5"
              >
                {hero.ctaProjects}
              </Link>
              <Link
                href={localizedPath(locale, "/freelancers")}
                className="inline-flex w-full items-center justify-center rounded-full border border-transparent px-5 py-3 text-sm font-medium text-zinc-600 transition-colors hover:border-zinc-200 hover:bg-zinc-100 hover:text-zinc-900 sm:w-auto sm:border-transparent sm:py-2.5 sm:hover:border-transparent"
              >
                {hero.ctaFreelancers}
              </Link>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2 lg:mt-5">
              {highlights.map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col items-center rounded-2xl border border-white/80 bg-white/75 px-2 py-3 text-center shadow-sm backdrop-blur-sm sm:flex-row sm:items-baseline sm:gap-2 sm:px-3 sm:py-2 sm:text-left"
                >
                  <span className="text-base font-bold text-zinc-900 sm:text-base">{item.value}</span>
                  <span className="mt-0.5 text-[11px] leading-4 text-zinc-500 sm:mt-0 sm:text-xs">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mx-auto flex w-full max-w-[420px] items-center justify-center sm:max-w-[480px] lg:mx-0 lg:max-h-[min(52vh,420px)] lg:max-w-none">
            <div
              aria-hidden
              className="absolute inset-4 rounded-[2rem] bg-gradient-to-br from-indigo-500/10 via-violet-500/10 to-indigo-500/5 blur-2xl sm:inset-6"
            />
            <LandingHeroVisual
              className="relative z-10 h-auto max-h-[240px] w-full sm:max-h-[300px] lg:max-h-[min(52vh,420px)]"
              reviewsCount={hero.visual.reviewsCount}
            />

            <div className="absolute left-2 top-2 z-20 rounded-2xl border border-white/80 bg-white/90 px-3 py-2 shadow-lg shadow-indigo-500/10 backdrop-blur-sm sm:left-0 sm:top-4 lg:block">
              <p className="text-[10px] font-medium uppercase tracking-wide text-zinc-400">
                {hero.visual.dealActive}
              </p>
              <p className="mt-0.5 text-xs font-semibold text-zinc-900">
                {hero.visual.escrowAmount}
              </p>
            </div>

            <div className="absolute bottom-2 right-2 z-20 rounded-2xl border border-white/80 bg-white/90 px-3 py-2 shadow-lg shadow-violet-500/10 backdrop-blur-sm sm:bottom-4 sm:right-0 lg:block">
              <p className="text-[10px] font-medium uppercase tracking-wide text-zinc-400">
                {hero.visual.newBid}
              </p>
              <p className="mt-0.5 text-xs font-semibold text-emerald-600">
                {hero.visual.freelancerFound}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:mt-4 sm:grid sm:grid-cols-3 sm:gap-3 sm:overflow-visible sm:pb-0 lg:mt-5 [&::-webkit-scrollbar]:hidden">
          {hero.features.map((feature) => (
            <article
              key={feature.title}
              className="flex min-w-[82%] shrink-0 snap-center items-start gap-3 rounded-2xl border border-zinc-200/80 bg-white/90 p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-200/80 hover:shadow-md hover:shadow-indigo-500/5 sm:min-w-0 sm:shrink sm:snap-align-none"
            >
              <div className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-xs font-bold text-white shadow-md shadow-indigo-500/20">
                {feature.title.slice(0, 1)}
              </div>
              <div className="min-w-0">
                <h2 className="text-sm font-semibold text-zinc-900">{feature.title}</h2>
                <p className="mt-1 text-xs leading-5 text-zinc-600 sm:text-[13px] sm:leading-5">
                  {feature.text}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
