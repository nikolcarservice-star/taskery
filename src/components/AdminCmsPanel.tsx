"use client";

import { adminSaveCmsPage, type CmsActionState } from "@/lib/actions/admin-cms";
import { getAdminCopy } from "@/lib/admin-i18n";
import type { CmsPageItem } from "@/lib/queries/admin-cms";
import type { AppLocale } from "@/lib/i18n/types";
import { useActionState } from "react";

const initialState: CmsActionState = {};

const CMS_SLUGS = ["terms", "privacy", "about-extra"] as const;

const LOCALES = [
  { value: "ru", label: "RU" },
  { value: "uk", label: "UK" },
  { value: "en", label: "EN" },
  { value: "pl", label: "PL" },
];

export function AdminCmsPanel({
  pages,
  locale,
  compact = false,
}: {
  pages: CmsPageItem[];
  locale: AppLocale;
  compact?: boolean;
}) {
  const c = getAdminCopy(locale).panels.cms;
  const [state, formAction, pending] = useActionState(adminSaveCmsPage, initialState);

  return (
    <section
      className={
        compact
          ? "rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm"
          : "rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
      }
    >
      <h2 className="text-lg font-semibold text-zinc-900">{c.title}</h2>
      <p className="mt-1 text-sm text-zinc-500">{c.urlHint}</p>

      <form action={formAction} className="mt-4 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-zinc-700">{c.pageLabel}</label>
            <select
              name="slug"
              required
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
            >
              {CMS_SLUGS.map((slug) => (
                <option key={slug} value={slug}>
                  {c.slugs[slug] ?? slug}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700">{c.languageLabel}</label>
            <select
              name="locale"
              required
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
            >
              {LOCALES.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700">{c.titleLabel}</label>
          <input
            name="title"
            required
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700">{c.bodyLabel}</label>
          <textarea
            name="body"
            required
            rows={10}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 font-mono text-sm"
          />
        </div>
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {pending ? c.saving : c.save}
        </button>
        {state.error && <p className="text-sm text-red-600">{state.error}</p>}
        {state.success && <p className="text-sm text-emerald-700">{c.saved}</p>}
      </form>

      {pages.length > 0 && (
        <ul className="mt-6 space-y-2 text-sm text-zinc-600">
          {pages.map((page) => (
            <li key={page.id}>
              {page.slug} ({page.locale}) — {page.title}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
