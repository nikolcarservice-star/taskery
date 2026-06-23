"use client";

import { MarkdownContent } from "@/components/MarkdownContent";
import { FormActionError } from "@/components/FormActionError";
import { useLocalizedPath } from "@/components/LocalizedLink";
import { createProject, type CreateProjectState } from "@/lib/actions/projects";
import { useDictionary } from "@/lib/i18n/dictionary-context";
import { SUPPORTED_CURRENCIES, currencyConfig } from "@/lib/i18n/currencies";
import { useAppLocale } from "@/lib/i18n/use-app-locale";
import { getProjectPath } from "@/lib/slug";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";

type Category = {
  id: string;
  name: string;
};

type ProjectFormProps = {
  categories: Category[];
};

const initialState: CreateProjectState = {};

export function ProjectForm({ categories }: ProjectFormProps) {
  const locale = useAppLocale();
  const dict = useDictionary();
  const l = useLocalizedPath();
  const t = dict.cabinetForms.projectForm;
  const common = dict.cabinetForms.common;
  const router = useRouter();
  const [state, formAction, pending] = useActionState(
    createProject,
    initialState,
  );
  const [budgetNegotiable, setBudgetNegotiable] = useState(false);
  const [preview, setPreview] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (state.success && state.projectId) {
      router.push(
        l(
          getProjectPath({
            id: state.projectId,
            slug: state.projectSlug ?? state.projectId,
          }),
        ),
      );
    }
  }, [state.success, state.projectId, state.projectSlug, router, l]);

  const inputClassName =
    "mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500";

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-zinc-700">
          {t.title}
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          minLength={5}
          maxLength={200}
          placeholder={t.titlePlaceholder}
          className={inputClassName}
        />
      </div>

      <div>
        <label htmlFor="categoryId" className="block text-sm font-medium text-zinc-700">
          {t.category}
        </label>
        <select
          id="categoryId"
          name="categoryId"
          required
          defaultValue=""
          className={inputClassName}
        >
          <option value="" disabled>
            {t.selectCategory}
          </option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-zinc-700"
          >
            {t.description}
          </label>
          <button
            type="button"
            onClick={() => setShowPreview((value) => !value)}
            className="text-xs font-medium text-blue-600 hover:text-blue-800"
          >
            {showPreview ? t.editor : t.preview}
          </button>
        </div>
        {showPreview ? (
          <div className="mt-1 min-h-48 rounded-lg border border-zinc-200 bg-zinc-50 p-4">
            {preview.trim() ? (
              <MarkdownContent content={preview} />
            ) : (
              <p className="text-sm text-zinc-400">{t.previewEmpty}</p>
            )}
          </div>
        ) : null}
        <textarea
          id="description"
          name="description"
          required
          minLength={20}
          rows={10}
          value={preview}
          onChange={(e) => setPreview(e.target.value)}
          placeholder={t.descriptionPlaceholder}
          className={`${inputClassName} font-mono ${showPreview ? "sr-only" : ""}`}
        />
        <p className="mt-1 text-xs text-zinc-500">{t.descriptionHint}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="budget" className="block text-sm font-medium text-zinc-700">
            {t.budget}
          </label>
          <input
            id="budget"
            name="budget"
            type="number"
            min={1}
            step={1}
            disabled={budgetNegotiable}
            placeholder="10000"
            className={`${inputClassName} disabled:bg-zinc-100 disabled:text-zinc-400`}
          />
        </div>
        <div>
          <label htmlFor="currency" className="block text-sm font-medium text-zinc-700">
            {t.currency}
          </label>
          <select
            id="currency"
            name="currency"
            defaultValue="UAH"
            className={inputClassName}
          >
            {SUPPORTED_CURRENCIES.map((code) => (
              <option key={code} value={code}>
                {currencyConfig[code].label[locale]}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-zinc-500">{t.currencyHint}</p>
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-zinc-700">
        <input
          type="checkbox"
          name="budgetNegotiable"
          checked={budgetNegotiable}
          onChange={(e) => setBudgetNegotiable(e.target.checked)}
          className="rounded border-zinc-300"
        />
        {t.budgetNegotiable}
      </label>

      <div>
        <label htmlFor="deadline" className="block text-sm font-medium text-zinc-700">
          {t.deadline}
        </label>
        <input
          id="deadline"
          name="deadline"
          type="date"
          className={inputClassName}
        />
        <p className="mt-1 text-xs text-zinc-500">{t.optional}</p>
      </div>

      <FormActionError error={state.error} className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" />

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Link
          href={l("/client/projects")}
          className="inline-flex items-center justify-center rounded-full border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
        >
          {common.cancel}
        </Link>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50"
        >
          {pending ? t.publishing : t.publish}
        </button>
      </div>
    </form>
  );
}
