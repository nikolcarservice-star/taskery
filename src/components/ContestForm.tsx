"use client";

import { MarkdownContent } from "@/components/MarkdownContent";
import { FormActionError } from "@/components/FormActionError";
import { useLocalizedPath } from "@/components/LocalizedLink";
import { createContest, type ContestActionState } from "@/lib/actions/contests";
import { useDictionary } from "@/lib/i18n/dictionary-context";
import { SUPPORTED_CURRENCIES } from "@/lib/i18n/currencies";
import { useAppLocale } from "@/lib/i18n/use-app-locale";
import { getProjectPath } from "@/lib/slug";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";

type Category = { id: string; name: string };

const initialState: ContestActionState = {};

export function ContestForm({ categories }: { categories: Category[] }) {
  const locale = useAppLocale();
  const dict = useDictionary();
  const t = dict.cabinetForms.projectForm;
  const c = dict.contests;
  const l = useLocalizedPath();
  const router = useRouter();
  const [state, formAction, pending] = useActionState(createContest, initialState);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (!state.success) return;
    if (state.pendingModeration) {
      router.push(l("/client/projects?moderation=pending"));
      return;
    }
    if (state.projectSlug) {
      router.push(l(getProjectPath({ id: state.projectSlug, slug: state.projectSlug })));
    }
  }, [state.success, state.pendingModeration, state.projectSlug, router, l]);

  const inputClassName =
    "mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500";

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-zinc-700">
          {t.title}
        </label>
        <input id="title" name="title" required minLength={5} className={inputClassName} />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-zinc-700">
          {t.description}
        </label>
        <textarea
          id="description"
          name="description"
          required
          minLength={20}
          rows={8}
          value={preview}
          onChange={(e) => setPreview(e.target.value)}
          className={inputClassName}
        />
        {preview && (
          <div className="prose-zinc mt-3 max-w-none rounded-lg border border-zinc-100 bg-zinc-50 p-4 text-sm">
            <MarkdownContent content={preview} />
          </div>
        )}
      </div>

      <div>
        <label htmlFor="categoryId" className="block text-sm font-medium text-zinc-700">
          {t.category}
        </label>
        <select id="categoryId" name="categoryId" required className={inputClassName}>
          <option value="">{t.selectCategory}</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="budget" className="block text-sm font-medium text-zinc-700">
            {c.prizeLabel} *
          </label>
          <input id="budget" name="budget" type="number" min={1} step="0.01" required className={inputClassName} />
        </div>
        <div>
          <label htmlFor="currency" className="block text-sm font-medium text-zinc-700">
            {t.currency}
          </label>
          <select id="currency" name="currency" defaultValue="UAH" className={inputClassName}>
            {SUPPORTED_CURRENCIES.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="submissionDeadline" className="block text-sm font-medium text-zinc-700">
          {c.deadlineLabel}
        </label>
        <input id="submissionDeadline" name="submissionDeadline" type="datetime-local" className={inputClassName} />
      </div>

      <FormActionError error={state.error} />
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50"
      >
        {pending ? t.publishing : c.createCta}
      </button>
    </form>
  );
}
