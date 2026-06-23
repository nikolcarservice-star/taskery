"use client";

import type { AppLocale, Dictionary } from "@/lib/i18n/types";
import { localizedPath } from "@/lib/i18n/routing";
import Link from "next/link";
import { useState } from "react";

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
      className={`shrink-0 text-zinc-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
    >
      <path
        d="M4.5 7.5L9 12L13.5 7.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FaqItem({
  question,
  answer,
  defaultOpen = false,
}: {
  question: string;
  answer: string;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <article className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm transition-all duration-200 hover:border-indigo-200/80 hover:shadow-md hover:shadow-indigo-500/5">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex w-full items-start justify-between gap-4 px-5 py-5 text-left sm:px-6"
      >
        <span className="text-[15px] font-semibold leading-6 text-zinc-900 sm:text-base">
          {question}
        </span>
        <ChevronIcon open={open} />
      </button>
      <div
        className={`grid transition-all duration-200 ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
      >
        <div className="overflow-hidden">
          <p className="border-t border-zinc-100 px-5 pb-5 pt-4 text-sm leading-7 text-zinc-600 sm:px-6">
            {answer}
          </p>
        </div>
      </div>
    </article>
  );
}

type LandingFaqSectionProps = {
  locale: AppLocale;
  dict: Dictionary;
};

export function LandingFaqSection({ locale, dict }: LandingFaqSectionProps) {
  const copy = dict.landing.faq;

  return (
    <section className="relative overflow-hidden bg-zinc-50 py-14 sm:py-16 lg:py-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.08),transparent_50%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-violet-200/20 blur-3xl"
      />

      <div className="relative mx-auto max-w-3xl px-5 sm:px-8 lg:px-10">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
            {copy.eyebrow}
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            {copy.title}
          </h2>
          <p className="mt-4 text-[15px] leading-7 text-zinc-600 sm:text-base">
            {copy.descriptionBeforeLink}{" "}
            <Link
              href={localizedPath(locale, "/contact")}
              className="font-medium text-indigo-600 transition-colors hover:text-indigo-500"
            >
              {copy.contactLink}
            </Link>
            {copy.descriptionAfterLink}
          </p>
        </div>

        <div className="mt-10 space-y-3">
          {dict.faq.map((item, index) => (
            <FaqItem
              key={item.question}
              question={item.question}
              answer={item.answer}
              defaultOpen={index === 0}
            />
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            href={localizedPath(locale, "/faq")}
            className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-6 py-3 text-sm font-medium text-zinc-700 shadow-sm transition-all duration-200 hover:border-indigo-200 hover:bg-indigo-50/60 hover:text-indigo-700"
          >
            {copy.allLink}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path
                d="M2.5 7H11.5M11.5 7L7.5 3M11.5 7L7.5 11"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
