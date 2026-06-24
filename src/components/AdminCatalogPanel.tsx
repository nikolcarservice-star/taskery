"use client";

import { AdminActionError } from "@/components/AdminActionError";
import {
  adminSaveCategory,
  adminSaveCategoryMinBudget,
  adminSaveSkill,
  type CatalogActionState,
} from "@/lib/actions/admin-catalog";
import { getAdminCopy } from "@/lib/admin-i18n";
import type {
  AdminCategoryItem,
  AdminSkillItem,
} from "@/lib/queries/admin-catalog";
import { SUPPORTED_CURRENCIES } from "@/lib/i18n/currencies";
import type { AppLocale } from "@/lib/i18n/types";
import { useActionState } from "react";

const initialState: CatalogActionState = {};

function CategoryForm({
  category,
  locale,
}: {
  category?: AdminCategoryItem;
  locale: AppLocale;
}) {
  const c = getAdminCopy(locale).panels.catalog;
  const [state, formAction, pending] = useActionState(
    adminSaveCategory,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-3 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
      {category && <input type="hidden" name="categoryId" value={category.id} />}
      <div>
        <label className="block text-xs font-medium text-zinc-600">{c.nameLabel}</label>
        <input
          name="name"
          required
          defaultValue={category?.name ?? ""}
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-zinc-600">{c.descriptionLabel}</label>
        <textarea
          name="description"
          rows={2}
          defaultValue={category?.description ?? ""}
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-indigo-600 px-4 py-1.5 text-xs font-medium text-white disabled:opacity-50"
      >
        {pending ? c.saving : category ? c.save : c.addCategory}
      </button>
      <AdminActionError error={state.error} locale={locale} className="text-xs text-red-600" />
      {state.success && <p className="text-xs text-green-700">{c.saved}</p>}
    </form>
  );
}

function CategoryMinBudgetForm({
  category,
  locale,
}: {
  category: AdminCategoryItem;
  locale: AppLocale;
}) {
  const c = getAdminCopy(locale).panels.catalog;
  const [state, formAction, pending] = useActionState(
    adminSaveCategoryMinBudget,
    initialState,
  );

  const budgetByCurrency = Object.fromEntries(
    category.minBudgets.map((row) => [row.currency, row.minAmount]),
  );

  return (
    <div className="space-y-3 rounded-xl border border-amber-200 bg-amber-50/40 p-4">
      <p className="text-xs font-semibold text-amber-900">{c.minBudgetTitle}</p>
      <p className="text-xs text-amber-800/80">{c.minBudgetHint}</p>
      {SUPPORTED_CURRENCIES.map((currency) => (
        <form key={currency} action={formAction} className="flex flex-wrap items-end gap-2">
          <input type="hidden" name="categoryId" value={category.id} />
          <input type="hidden" name="currency" value={currency} />
          <div>
            <label className="block text-xs font-medium text-zinc-600">
              {currency}
            </label>
            <input
              name="minAmount"
              type="number"
              min={0}
              step="0.01"
              defaultValue={budgetByCurrency[currency] ?? ""}
              placeholder="—"
              className="mt-1 w-32 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={pending}
            className="rounded-full border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 disabled:opacity-50"
          >
            {pending ? "…" : c.save}
          </button>
        </form>
      ))}
      <AdminActionError error={state.error} locale={locale} className="text-xs text-red-600" />
      {state.success && <p className="text-xs text-green-700">{c.saved}</p>}
    </div>
  );
}

function SkillForm({
  categories,
  skill,
  locale,
}: {
  categories: AdminCategoryItem[];
  skill?: AdminSkillItem;
  locale: AppLocale;
}) {
  const c = getAdminCopy(locale).panels.catalog;
  const [state, formAction, pending] = useActionState(
    adminSaveSkill,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-3 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
      {skill && <input type="hidden" name="skillId" value={skill.id} />}
      <div>
        <label className="block text-xs font-medium text-zinc-600">{c.nameLabel}</label>
        <input
          name="name"
          required
          defaultValue={skill?.name ?? ""}
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-zinc-600">{c.categoryLabel}</label>
        <select
          name="categoryId"
          defaultValue={skill?.categoryId ?? ""}
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
        >
          <option value="">{c.noCategory}</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-indigo-600 px-4 py-1.5 text-xs font-medium text-white disabled:opacity-50"
      >
        {pending ? c.saving : skill ? c.save : c.addSkill}
      </button>
      <AdminActionError error={state.error} locale={locale} className="text-xs text-red-600" />
      {state.success && <p className="text-xs text-green-700">{c.saved}</p>}
    </form>
  );
}

type AdminCatalogPanelProps = {
  categories: AdminCategoryItem[];
  skills: AdminSkillItem[];
  locale: AppLocale;
  compact?: boolean;
};

export function AdminCatalogPanel({
  categories,
  skills,
  locale,
  compact = false,
}: AdminCatalogPanelProps) {
  const c = getAdminCopy(locale).panels.catalog;

  return (
    <section
      className={`rounded-2xl border border-zinc-200 bg-white shadow-sm ${
        compact ? "p-4" : "p-6"
      }`}
    >
      <h2 className="text-lg font-semibold text-zinc-900">{c.title}</h2>
      <p className="mt-1 text-sm text-zinc-500">{c.description}</p>

      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <div>
          <h3 className="text-sm font-semibold text-zinc-800">{c.categories}</h3>
          <div className="mt-3 space-y-3">
            <CategoryForm locale={locale} />
            {categories.map((category) => (
              <details key={category.id} className="rounded-xl border border-zinc-200">
                <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-zinc-800">
                  {category.name}
                  <span className="ml-2 text-xs font-normal text-zinc-500">
                    {category.skillCount} {c.skillsCount} · {category.projectCount}{" "}
                    {c.projectsCount}
                  </span>
                </summary>
                <div className="border-t border-zinc-100 p-4 space-y-4">
                  <CategoryForm category={category} locale={locale} />
                  <CategoryMinBudgetForm category={category} locale={locale} />
                </div>
              </details>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-zinc-800">{c.skills}</h3>
          <div className="mt-3 space-y-3">
            <SkillForm categories={categories} locale={locale} />
            <ul className="max-h-96 space-y-2 overflow-y-auto">
              {skills.map((skill) => (
                <li key={skill.id}>
                  <details className="rounded-xl border border-zinc-200">
                    <summary className="cursor-pointer px-4 py-2.5 text-sm text-zinc-800">
                      {skill.name}
                      <span className="ml-2 text-xs text-zinc-500">
                        {skill.categoryName ?? "—"} · {skill.freelancerCount}{" "}
                        {c.freelancersShort}
                      </span>
                    </summary>
                    <div className="border-t border-zinc-100 p-4">
                      <SkillForm categories={categories} skill={skill} locale={locale} />
                    </div>
                  </details>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
