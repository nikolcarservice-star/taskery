import type { Dictionary } from "@/lib/i18n/types";

function StepIcon({ index }: { index: number }) {
  const icons = [
    <path
      key="0"
      d="M8 4.5H14M11 2V7M6.5 11.5H3.5C2.67 11.5 2 12.17 2 13V14.5C2 15.33 2.67 16 3.5 16H6.5C7.33 16 8 15.33 8 14.5V13C8 12.17 7.33 11.5 6.5 11.5Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />,
    <path
      key="1"
      d="M6.5 8.5C7.88 6.96 10.12 6.96 11.5 8.5M4.5 14.5C5.67 12.8 7.72 11.75 9.75 11.75C11.78 11.75 13.83 12.8 15 14.5M9.75 4.75C10.44 4.75 11 4.19 11 3.5C11 2.81 10.44 2.25 9.75 2.25C9.06 2.25 8.5 2.81 8.5 3.5C8.5 4.19 9.06 4.75 9.75 4.75Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />,
    <path
      key="2"
      d="M9.75 3.5L11.25 5.75L14 6.25L12 8.25L12.5 11L9.75 9.75L7 11L7.5 8.25L5.5 6.25L8.25 5.75L9.75 3.5Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />,
    <path
      key="3"
      d="M4.5 9.75L8.25 13.5L15 6.75"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />,
  ];

  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className="text-white"
    >
      {icons[index]}
    </svg>
  );
}

export function LandingHowItWorksSection({ dict }: { dict: Dictionary }) {
  const copy = dict.landing.howItWorks;

  return (
    <section className="relative overflow-hidden bg-zinc-50 py-14 sm:py-16 lg:py-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.06),transparent_55%)]"
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10 xl:px-12">
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

        <div className="relative mt-12 lg:mt-14">
          <div
            aria-hidden
            className="absolute left-[12.5%] right-[12.5%] top-10 hidden h-px bg-gradient-to-r from-transparent via-indigo-200 to-transparent lg:block"
          />

          <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {copy.steps.map((step, index) => (
              <li
                key={step.number}
                className="group relative rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-200/80 hover:shadow-md hover:shadow-indigo-500/5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 shadow-md shadow-indigo-500/20">
                    <StepIcon index={index} />
                  </div>
                  <span className="text-sm font-bold tracking-widest text-indigo-200 transition-colors group-hover:text-indigo-300">
                    {step.number}
                  </span>
                </div>

                <h3 className="mt-5 text-lg font-semibold text-zinc-900">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-600">{step.text}</p>

                {index < copy.steps.length - 1 ? (
                  <div
                    aria-hidden
                    className="absolute -right-3 top-1/2 hidden h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-indigo-100 bg-white text-indigo-300 lg:flex"
                  >
                    →
                  </div>
                ) : null}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
