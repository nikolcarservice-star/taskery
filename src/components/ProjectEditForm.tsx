"use client";

import { CloseProjectButton } from "@/components/CloseProjectButton";
import { FormActionError } from "@/components/FormActionError";
import { MarkdownContent } from "@/components/MarkdownContent";
import { useLocalizedPath } from "@/components/LocalizedLink";
import { StripeCheckoutButton } from "@/components/StripeCheckoutButton";
import { updateProject, type UpdateProjectState } from "@/lib/actions/projects";
import { useDictionary, useDictionaryLocale } from "@/lib/i18n/dictionary-context";
import { isFeaturedActive } from "@/lib/slug";
import Link from "next/link";
import { useActionState, useState } from "react";

type Category = { id: string; name: string };

type ProjectEditFormProps = {
  project: {
    id: string;
    slug: string;
    title: string;
    description: string;
    categoryId: string | null;
    deadline: Date | null;
    status: string;
    isFeatured: boolean;
    featuredUntil: Date | null;
  };
  categories: Category[];
  stripeEnabled: boolean;
};

const initialState: UpdateProjectState = {};

const DATE_LOCALE: Record<string, string> = {
  ru: "ru-RU",
  uk: "uk-UA",
  pl: "pl-PL",
  en: "en-GB",
};

export function ProjectEditForm({
  project,
  categories,
  stripeEnabled,
}: ProjectEditFormProps) {
  const dict = useDictionary();
  const locale = useDictionaryLocale();
  const l = useLocalizedPath();
  const t = dict.cabinetForms.projectEdit;
  const common = dict.cabinetForms.common;
  const [state, formAction, pending] = useActionState(updateProject, initialState);
  const [showPreview, setShowPreview] = useState(false);
  const [preview, setPreview] = useState(project.description);

  const featured = isFeaturedActive(project.featuredUntil, project.isFeatured);
  const deadlineValue = project.deadline
    ? project.deadline.toISOString().slice(0, 10)
    : "";

  const inputClassName =
    "mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500";

  const featuredDate = project.featuredUntil
    ? project.featuredUntil.toLocaleDateString(DATE_LOCALE[locale] ?? "ru-RU")
    : "—";

  return (
    <div className="space-y-8">
      {featured && (
        <div className="rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-800">
          {t.featuredUntil.replace("{date}", featuredDate)}
        </div>
      )}

      {stripeEnabled && project.status === "OPEN" && !featured && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <h3 className="font-semibold text-zinc-900">{t.boostTitle}</h3>
          <p className="mt-1 text-sm text-zinc-600">{t.boostDescription}</p>
          <div className="mt-3">
            <StripeCheckoutButton
              type="feature_project"
              projectId={project.id}
              label={t.boostButton}
              variant="secondary"
            />
          </div>
        </div>
      )}

      <form action={formAction} className="space-y-5">
        <input type="hidden" name="projectId" value={project.id} />

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-zinc-700">
            {t.title}
          </label>
          <input
            id="title"
            name="title"
            defaultValue={project.title}
            required
            minLength={5}
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
            defaultValue={project.categoryId ?? ""}
            className={inputClassName}
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="description" className="block text-sm font-medium text-zinc-700">
              {t.description}
            </label>
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="text-xs font-medium text-blue-600 hover:underline"
            >
              {showPreview ? t.editor : t.preview}
            </button>
          </div>
          {showPreview ? (
            <div className="mt-2 rounded-lg border border-zinc-200 bg-zinc-50 p-4">
              <MarkdownContent content={preview} />
            </div>
          ) : (
            <textarea
              id="description"
              name="description"
              defaultValue={project.description}
              required
              minLength={20}
              rows={10}
              onChange={(e) => setPreview(e.target.value)}
              className={inputClassName}
            />
          )}
        </div>

        <div>
          <label htmlFor="deadline" className="block text-sm font-medium text-zinc-700">
            {t.deadline}
          </label>
          <input
            id="deadline"
            name="deadline"
            type="date"
            defaultValue={deadlineValue}
            className={inputClassName}
          />
        </div>

        <FormActionError error={state.error} className="text-sm text-red-600" />
        {state.success && (
          <p className="text-sm text-green-700">{t.saved}</p>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={pending}
            className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50"
          >
            {pending ? t.saving : common.save}
          </button>
          <Link
            href={l(`/projects/${project.slug}`)}
            className="rounded-full border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
          >
            {common.cancel}
          </Link>
        </div>
      </form>

      {project.status === "OPEN" && (
        <div className="border-t border-zinc-200 pt-8">
          <h3 className="font-semibold text-red-900">{t.closeTitle}</h3>
          <p className="mt-1 text-sm text-zinc-600">{t.closeDescription}</p>
          <div className="mt-3">
            <CloseProjectButton projectId={project.id} />
          </div>
        </div>
      )}
    </div>
  );
}
