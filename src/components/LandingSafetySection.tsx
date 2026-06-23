import { LandingSafetyVisual } from "@/components/LandingSafetyVisual";
import type { Dictionary } from "@/lib/i18n/types";

function ShieldIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d="M7 1.5L11.5 3.5V6.8C11.5 9.4 9.8 11.4 7 12.5C4.2 11.4 2.5 9.4 2.5 6.8V3.5L7 1.5Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PointList({
  title,
  points,
  accentClass,
}: {
  title: string;
  points: string[];
  accentClass: string;
}) {
  return (
    <div className="rounded-3xl border border-zinc-200/80 bg-zinc-50/70 p-6">
      <div className="flex items-center gap-3">
        <span
          className={`inline-flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-md ${accentClass}`}
        >
          <ShieldIcon />
        </span>
        <h3 className="text-lg font-semibold text-zinc-900">{title}</h3>
      </div>
      <ul className="mt-5 space-y-4">
        {points.map((point) => (
          <li key={point} className="flex gap-3 text-sm leading-6 text-zinc-600">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
            {point}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function LandingSafetySection({ dict }: { dict: Dictionary }) {
  const copy = dict.landing.safety;

  return (
    <section className="border-y border-zinc-200/80 bg-white py-14 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10 xl:px-12">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-14 xl:gap-16">
          <div className="relative mx-auto w-full max-w-[500px] lg:mx-0">
            <div
              aria-hidden
              className="absolute inset-8 rounded-[2rem] bg-gradient-to-br from-indigo-100/80 via-violet-100/50 to-transparent blur-2xl"
            />
            <LandingSafetyVisual
              className="relative z-10 h-auto w-full"
              labels={copy.visual}
            />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
              {copy.eyebrow}
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl lg:text-[2.5rem] lg:leading-tight">
              {copy.title}
            </h2>
            <p className="mt-4 max-w-xl text-[15px] leading-7 text-zinc-600 sm:text-base">
              {copy.description}
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <PointList
                title={copy.clientsTitle}
                points={copy.clientsPoints}
                accentClass="bg-gradient-to-br from-blue-500 to-indigo-600 shadow-blue-500/20"
              />
              <PointList
                title={copy.freelancersTitle}
                points={copy.freelancersPoints}
                accentClass="bg-gradient-to-br from-indigo-500 to-violet-600 shadow-indigo-500/20"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
