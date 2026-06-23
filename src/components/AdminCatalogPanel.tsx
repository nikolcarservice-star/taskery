"use client";

import {
  adminSaveCategory,
  adminSaveCategoryMinBudget,
  adminSaveSkill,
  type CatalogActionState,
} from "@/lib/actions/admin-catalog";
import type {
  AdminCategoryItem,
  AdminSkillItem,
} from "@/lib/queries/admin-catalog";
import { SUPPORTED_CURRENCIES } from "@/lib/i18n/currencies";
import { useActionState } from "react";

const initialState: CatalogActionState = {};

function CategoryForm({ category }: { category?: AdminCategoryItem }) {
  const [state, formAction, pending] = useActionState(
    adminSaveCategory,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-3 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
      {category && <input type="hidden" name="categoryId" value={category.id} />}
      <div>
        <label className="block text-xs font-medium text-zinc-600">Название</label>
        <input
          name="name"
          required
          defaultValue={category?.name ?? ""}
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-zinc-600">Описание</label>
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
        {pending ? "Сохранение…" : category ? "Сохранить" : "Добавить категорию"}
      </button>
      {state.error && <p className="text-xs text-red-600">{state.error}</p>}
      {state.success && <p className="text-xs text-green-700">Сохранено</p>}
    </form>
  );
}

function CategoryMinBudgetForm({ category }: { category: AdminCategoryItem }) {
  const [state, formAction, pending] = useActionState(
    adminSaveCategoryMinBudget,
    initialState,
  );

  const budgetByCurrency = Object.fromEntries(
    category.minBudgets.map((row) => [row.currency, row.minAmount]),
  );

  return (
    <div className="space-y-3 rounded-xl border border-amber-200 bg-amber-50/40 p-4">
      <p className="text-xs font-semibold text-amber-900">
        Минимальный бюджет проекта
      </p>
      <p className="text-xs text-amber-800/80">
        Пустое поле — ограничение не действует для этой валюты.
      </p>
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
            {pending ? "…" : "Сохранить"}
          </button>
        </form>
      ))}
      {state.error && <p className="text-xs text-red-600">{state.error}</p>}
      {state.success && <p className="text-xs text-green-700">Сохранено</p>}
    </div>
  );
}

function SkillForm({
  categories,
  skill,
}: {
  categories: AdminCategoryItem[];
  skill?: AdminSkillItem;
}) {
  const [state, formAction, pending] = useActionState(
    adminSaveSkill,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-3 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
      {skill && <input type="hidden" name="skillId" value={skill.id} />}
      <div>
        <label className="block text-xs font-medium text-zinc-600">Название</label>
        <input
          name="name"
          required
          defaultValue={skill?.name ?? ""}
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-zinc-600">Категория</label>
        <select
          name="categoryId"
          defaultValue={skill?.categoryId ?? ""}
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
        >
          <option value="">Без категории</option>
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
        {pending ? "Сохранение…" : skill ? "Сохранить" : "Добавить навык"}
      </button>
      {state.error && <p className="text-xs text-red-600">{state.error}</p>}
      {state.success && <p className="text-xs text-green-700">Сохранено</p>}
    </form>
  );
}

type AdminCatalogPanelProps = {
  categories: AdminCategoryItem[];
  skills: AdminSkillItem[];
  compact?: boolean;
};

export function AdminCatalogPanel({
  categories,
  skills,
  compact = false,
}: AdminCatalogPanelProps) {
  return (
    <section
      className={`rounded-2xl border border-zinc-200 bg-white shadow-sm ${
        compact ? "p-4" : "p-6"
      }`}
    >
      <h2 className="text-lg font-semibold text-zinc-900">Каталог</h2>
      <p className="mt-1 text-sm text-zinc-500">
        Категории проектов и навыки фрилансеров
      </p>

      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <div>
          <h3 className="text-sm font-semibold text-zinc-800">Категории</h3>
          <div className="mt-3 space-y-3">
            <CategoryForm />
            {categories.map((category) => (
              <details key={category.id} className="rounded-xl border border-zinc-200">
                <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-zinc-800">
                  {category.name}
                  <span className="ml-2 text-xs font-normal text-zinc-500">
                    {category.skillCount} навыков · {category.projectCount} проектов
                  </span>
                </summary>
                <div className="border-t border-zinc-100 p-4 space-y-4">
                  <CategoryForm category={category} />
                  <CategoryMinBudgetForm category={category} />
                </div>
              </details>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-zinc-800">Навыки</h3>
          <div className="mt-3 space-y-3">
            <SkillForm categories={categories} />
            <ul className="max-h-96 space-y-2 overflow-y-auto">
              {skills.map((skill) => (
                <li key={skill.id}>
                  <details className="rounded-xl border border-zinc-200">
                    <summary className="cursor-pointer px-4 py-2.5 text-sm text-zinc-800">
                      {skill.name}
                      <span className="ml-2 text-xs text-zinc-500">
                        {skill.categoryName ?? "—"} · {skill.freelancerCount} фрил.
                      </span>
                    </summary>
                    <div className="border-t border-zinc-100 p-4">
                      <SkillForm categories={categories} skill={skill} />
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
