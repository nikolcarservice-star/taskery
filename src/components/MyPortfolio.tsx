"use client";

import { useLocalizedPath } from "@/components/LocalizedLink";
import { FormActionError } from "@/components/FormActionError";
import {
  addPortfolioItem,
  deletePortfolioItem,
  type ActionState,
} from "@/lib/actions/profile";
import { useDictionary } from "@/lib/i18n/dictionary-context";
import { resolveAssetDisplayUrl } from "@/lib/blob-url";
import Link from "next/link";
import { useActionState } from "react";

export type PortfolioItemRow = {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  projectUrl: string | null;
  createdAt: string;
};

type MyPortfolioProps = {
  items: PortfolioItemRow[];
  userId: string;
};

const initialState: ActionState = {};

const inputClassName =
  "mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-800 outline-none transition-colors placeholder:text-zinc-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20";

function PortfolioCard({
  item,
  deleteAction,
  deletePending,
}: {
  item: PortfolioItemRow;
  deleteAction: (payload: FormData) => void;
  deletePending: boolean;
}) {
  const t = useDictionary().cabinetForms.portfolio;
  const imageSrc = resolveAssetDisplayUrl(item.imageUrl);

  return (
    <article className="group overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      {imageSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageSrc}
          alt=""
          className="h-44 w-full object-cover"
        />
      ) : (
        <div className="flex h-44 items-center justify-center bg-gradient-to-br from-indigo-50 to-zinc-100">
          <svg
            aria-hidden="true"
            className="h-12 w-12 text-indigo-200"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.25}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z"
            />
          </svg>
        </div>
      )}

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold text-zinc-900">{item.title}</h3>
          <form action={deleteAction}>
            <input type="hidden" name="itemId" value={item.id} />
            <button
              type="submit"
              disabled={deletePending}
              title={t.deleteWork}
              className="rounded-md p-1 text-zinc-400 opacity-0 transition-all hover:bg-red-50 hover:text-red-600 group-hover:opacity-100 disabled:opacity-50"
            >
              <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>
            </button>
          </form>
        </div>

        {item.description && (
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-zinc-600">
            {item.description}
          </p>
        )}

        {item.projectUrl && (
          <a
            href={item.projectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            {t.openProject}
            <svg aria-hidden="true" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
          </a>
        )}
      </div>
    </article>
  );
}

function AddPortfolioForm() {
  const t = useDictionary().cabinetForms.portfolio;
  const [state, formAction, pending] = useActionState(
    addPortfolioItem,
    initialState,
  );

  return (
    <form
      action={formAction}
      encType="multipart/form-data"
      className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50/60 p-5 sm:p-6"
    >
      <h2 className="text-base font-semibold text-zinc-900">{t.addTitle}</h2>
      <p className="mt-1 text-sm text-zinc-500">{t.addDescription}</p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="portfolio-title" className="block text-sm font-medium text-zinc-700">
            {t.fieldTitle}
          </label>
          <input
            id="portfolio-title"
            name="title"
            required
            placeholder={t.fieldTitlePlaceholder}
            className={inputClassName}
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="portfolio-description" className="block text-sm font-medium text-zinc-700">
            {t.fieldDescription}
          </label>
          <textarea
            id="portfolio-description"
            name="description"
            rows={3}
            placeholder={t.fieldDescriptionPlaceholder}
            className={inputClassName}
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="portfolio-image-file" className="block text-sm font-medium text-zinc-700">
            {t.fieldImageFile}
          </label>
          <input
            id="portfolio-image-file"
            name="imageFile"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="mt-1 block w-full text-sm text-zinc-700 file:mr-3 file:rounded-lg file:border-0 file:bg-indigo-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-indigo-700 hover:file:bg-indigo-100"
          />
          <p className="mt-1 text-xs text-zinc-500">{t.fieldImageFileHint}</p>
        </div>
        <div>
          <label htmlFor="portfolio-image" className="block text-sm font-medium text-zinc-700">
            {t.fieldImageUrl}
          </label>
          <input
            id="portfolio-image"
            name="imageUrl"
            type="url"
            placeholder="https://…"
            className={inputClassName}
          />
          <p className="mt-1 text-xs text-zinc-500">{t.fieldImageUrlOptional}</p>
        </div>
        <div>
          <label htmlFor="portfolio-url" className="block text-sm font-medium text-zinc-700">
            {t.fieldProjectUrl}
          </label>
          <input
            id="portfolio-url"
            name="projectUrl"
            type="url"
            placeholder="https://…"
            className={inputClassName}
          />
        </div>
      </div>

      <FormActionError error={state.error} className="mt-3 text-sm text-red-600" />
      {state.success && (
        <p className="mt-3 text-sm text-emerald-700">{t.addedSuccess}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 disabled:opacity-50"
      >
        {pending ? t.adding : t.addButton}
      </button>
    </form>
  );
}

export function MyPortfolio({ items, userId }: MyPortfolioProps) {
  const dict = useDictionary();
  const l = useLocalizedPath();
  const t = dict.cabinetForms.portfolio;
  const [, deleteAction, deletePending] = useActionState(
    deletePortfolioItem,
    initialState,
  );

  return (
    <div className="mt-6 space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-zinc-600">
          {items.length > 0
            ? t.countWorks.replace("{count}", String(items.length))
            : t.emptyCount}
        </p>
        <Link
          href={l(`/freelancers/${userId}`)}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:underline"
        >
          {t.viewAsClient}
        </Link>
      </div>

      {items.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <PortfolioCard
              key={item.id}
              item={item}
              deleteAction={deleteAction}
              deletePending={deletePending}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/80 px-6 py-14 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500">
            <svg aria-hidden="true" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
            </svg>
          </div>
          <p className="mt-4 text-base font-semibold text-zinc-900">
            {t.emptyTitle}
          </p>
          <p className="mt-1 text-sm text-zinc-500">{t.emptyDescription}</p>
        </div>
      )}

      <AddPortfolioForm />
    </div>
  );
}
