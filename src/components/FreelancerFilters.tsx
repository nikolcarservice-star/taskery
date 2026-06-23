"use client";

import { useLocalizedPath } from "@/components/LocalizedLink";
import { useDictionary } from "@/lib/i18n/dictionary-context";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

type Skill = { id: string; name: string };

type FreelancerFiltersProps = {
  skills: Skill[];
};

export function FreelancerFilters({ skills }: FreelancerFiltersProps) {
  const dict = useDictionary();
  const l = useLocalizedPath();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const [skill, setSkill] = useState(searchParams.get("skill") ?? "");
  const [sort, setSort] = useState(searchParams.get("sort") ?? "rating");

  function applyFilters(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (skill) params.set("skill", skill);
    if (sort !== "rating") params.set("sort", sort);
    const query = params.toString();
    router.push(query ? `${l("/freelancers")}?${query}` : l("/freelancers"));
  }

  const inputClassName =
    "mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500";

  return (
    <form
      onSubmit={applyFilters}
      className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"
    >
      <h2 className="text-sm font-semibold text-zinc-900">{dict.catalog.freelancerFilters.title}</h2>
      <div className="mt-4 space-y-4">
        <div>
          <label htmlFor="fq" className="block text-sm font-medium text-zinc-700">
            {dict.catalog.freelancerFilters.search}
          </label>
          <input
            id="fq"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={dict.catalog.freelancerFilters.searchPlaceholder}
            className={inputClassName}
          />
        </div>
        <div>
          <label htmlFor="skill" className="block text-sm font-medium text-zinc-700">
            {dict.catalog.freelancerFilters.skill}
          </label>
          <select
            id="skill"
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            className={inputClassName}
          >
            <option value="">{dict.catalog.freelancerFilters.allSkills}</option>
            {skills.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="sort" className="block text-sm font-medium text-zinc-700">
            {dict.catalog.freelancerFilters.sort}
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className={inputClassName}
          >
            <option value="rating">{dict.catalog.freelancerFilters.sortRating}</option>
            <option value="rate_asc">{dict.catalog.freelancerFilters.sortRateAsc}</option>
            <option value="rate_desc">{dict.catalog.freelancerFilters.sortRateDesc}</option>
            <option value="name">{dict.catalog.freelancerFilters.sortName}</option>
          </select>
        </div>
      </div>
      <button
        type="submit"
        className="mt-5 w-full rounded-full bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-700"
      >
        {dict.catalog.freelancerFilters.apply}
      </button>
    </form>
  );
}
