"use client";

import { useDictionary } from "@/lib/i18n/dictionary-context";

type ProjectBidCtaProps = {
  targetId?: string;
};

export function ProjectBidCta({ targetId = "project-bid-form" }: ProjectBidCtaProps) {
  const dict = useDictionary();

  function scrollToForm() {
    document.getElementById(targetId)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <div className="flex justify-center py-2">
      <button
        type="button"
        onClick={scrollToForm}
        className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all hover:bg-indigo-700 hover:shadow-indigo-600/30"
      >
        <svg
          aria-hidden="true"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.75}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.897 2.13l-.857.428a.75.75 0 0 1-1.06-.53l-.434-2.608A3.75 3.75 0 0 0 14.25 9.75h1.036A2.25 2.25 0 0 0 18 7.757V6.75a2.25 2.25 0 0 0-2.25-2.25h-.75a2.25 2.25 0 0 0-2.25 2.25v.75m0 0H9m3 0v-.375A2.25 2.25 0 0 0 9.75 6.75h-.75A2.25 2.25 0 0 0 6.75 9v.75m0 0v3.375A2.25 2.25 0 0 0 9 16.5h.008v.008H9v-.008Z"
          />
        </svg>
        {dict.projectDetail.bidCta.button}
      </button>
    </div>
  );
}
