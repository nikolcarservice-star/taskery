"use client";

import { EmptyTasksIllustration } from "@/components/EmptyTasksIllustration";
import { useLocalizedPath } from "@/components/LocalizedLink";
import { useDictionary } from "@/lib/i18n/dictionary-context";
import Link from "next/link";

export function NoActiveTasksPopover() {
  const dict = useDictionary();
  const l = useLocalizedPath();
  const p = dict.popovers.tasks;

  return (
    <div
      role="tooltip"
      className="rounded-xl border border-zinc-200 bg-white px-5 py-5 text-center shadow-lg"
    >
      <h3 className="text-base font-bold leading-snug text-zinc-900">
        {p.emptyTitle}
      </h3>

      <p className="mt-2.5 text-sm leading-6 text-zinc-600">
        {p.emptyBodyPrefix}
        <Link
          href={l("/projects")}
          className="font-medium text-indigo-600 hover:text-indigo-700 hover:underline"
        >
          {p.emptySearchWork}
        </Link>
        {p.emptyBodyMiddle}
        <span className="font-medium text-zinc-400">{p.emptyContests}</span>
      </p>

      <div className="mt-4">
        <EmptyTasksIllustration className="mx-auto h-28 w-full max-w-[220px]" />
      </div>
    </div>
  );
}
