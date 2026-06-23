"use client";

import { useLocalizedPath } from "@/components/LocalizedLink";
import { useDictionary } from "@/lib/i18n/dictionary-context";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

type Category = {
  id: string;
  name: string;
};

type ProjectFiltersProps = {
  categories: Category[];
};

export function ProjectFilters({ categories }: ProjectFiltersProps) {
  const dict = useDictionary();
  const l = useLocalizedPath();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const [category, setCategory] = useState(searchParams.get("category") ?? "");
  const [minBudget, setMinBudget] = useState(searchParams.get("minBudget") ?? "");
  const [maxBudget, setMaxBudget] = useState(searchParams.get("maxBudget") ?? "");

  function applyFilters(e: React.FormEvent) {
    e.preventDefault();

    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (category) params.set("category", category);
    if (minBudget) params.set("minBudget", minBudget);
    if (maxBudget) params.set("maxBudget", maxBudget);

    const query = params.toString();
    router.push(query ? `${l("/projects")}?${query}` : l("/projects"));
  }

  function resetFilters() {
    setQ("");
    setCategory("");
    setMinBudget("");
    setMaxBudget("");
    router.push(l("/projects"));
  }

  const inputClassName =
    "mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500";

  return (
    <form
      onSubmit={applyFilters}
      className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"
    >
      <h2 className="text-sm font-semibold text-zinc-900">{dict.catalog.projectFilters.title}</h2>

      <div className="mt-4 space-y-4">
        <div>
          <label htmlFor="q" className="block text-sm font-medium text-zinc-700">
            {dict.catalog.projectFilters.search}
          </label>
          <input
            id="q"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={dict.catalog.projectFilters.searchPlaceholder}
            className={inputClassName}
          />
        </div>

        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-zinc-700"
          >
            {dict.catalog.projectFilters.category}
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={inputClassName}
          >
            <option value="">{dict.catalog.projectFilters.allCategories}</option>
            {categories.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="minBudget"
              className="block text-sm font-medium text-zinc-700"
            >
              {dict.catalog.projectFilters.minBudget}
            </label>
            <input
              id="minBudget"
              type="number"
              min={0}
              value={minBudget}
              onChange={(e) => setMinBudget(e.target.value)}
              placeholder="1000"
              className={inputClassName}
            />
          </div>
          <div>
            <label
              htmlFor="maxBudget"
              className="block text-sm font-medium text-zinc-700"
            >
              {dict.catalog.projectFilters.maxBudget}
            </label>
            <input
              id="maxBudget"
              type="number"
              min={0}
              value={maxBudget}
              onChange={(e) => setMaxBudget(e.target.value)}
              placeholder="50000"
              className={inputClassName}
            />
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-2">
        <button
          type="submit"
          className="rounded-full bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-700"
        >
          {dict.catalog.projectFilters.apply}
        </button>
        <button
          type="button"
          onClick={resetFilters}
          className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
        >
          {dict.catalog.projectFilters.reset}
        </button>
      </div>
    </form>
  );
}
