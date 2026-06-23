"use client";

import { FormActionError } from "@/components/FormActionError";
import {
  addPortfolioItem,
  deletePortfolioItem,
  updateFreelancerProfile,
  updateProfile,
  type ActionState,
} from "@/lib/actions/profile";
import Link from "next/link";
import { useActionState } from "react";

type Skill = { id: string; name: string };
type PortfolioItem = {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  projectUrl: string | null;
};

type ProfileEditFormsProps = {
  user: {
    name: string | null;
    bio: string | null;
    avatar: string | null;
    role: string;
  };
  profile: {
    title: string | null;
    hourlyRate: string | null;
    skillIds: string[];
  } | null;
  portfolio: PortfolioItem[];
  allSkills: Skill[];
};

const initialState: ActionState = {};

const inputClassName =
  "mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500";

function BasicProfileForm({
  user,
}: {
  user: ProfileEditFormsProps["user"];
}) {
  const [state, formAction, pending] = useActionState(updateProfile, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <h2 className="text-lg font-semibold text-zinc-900">Основные данные</h2>
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-zinc-700">
          Имя
        </label>
        <input
          id="name"
          name="name"
          type="text"
          defaultValue={user.name ?? ""}
          className={inputClassName}
        />
      </div>
      <div>
        <label htmlFor="avatar" className="block text-sm font-medium text-zinc-700">
          URL аватара
        </label>
        <input
          id="avatar"
          name="avatar"
          type="url"
          defaultValue={user.avatar ?? ""}
          placeholder="https://…"
          className={inputClassName}
        />
      </div>
      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-zinc-700">
          О себе
        </label>
        <textarea
          id="bio"
          name="bio"
          rows={4}
          defaultValue={user.bio ?? ""}
          className={inputClassName}
        />
      </div>
      <FormActionError error={state.error} className="text-sm text-red-600" />
      {state.success && (
        <p className="text-sm text-green-700">Сохранено</p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50"
      >
        {pending ? "Сохраняем…" : "Сохранить"}
      </button>
    </form>
  );
}

function FreelancerForm({
  profile,
  allSkills,
}: {
  profile: NonNullable<ProfileEditFormsProps["profile"]>;
  allSkills: Skill[];
}) {
  const [state, formAction, pending] = useActionState(
    updateFreelancerProfile,
    initialState,
  );

  return (
    <form action={formAction} className="mt-10 space-y-4 border-t border-zinc-200 pt-10">
      <h2 className="text-lg font-semibold text-zinc-900">Профиль фрилансера</h2>
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-zinc-700">
          Специализация
        </label>
        <input
          id="title"
          name="title"
          type="text"
          defaultValue={profile.title ?? ""}
          placeholder="Full-stack разработчик"
          className={inputClassName}
        />
      </div>
      <div>
        <label htmlFor="hourlyRate" className="block text-sm font-medium text-zinc-700">
          Ставка (₴/час)
        </label>
        <input
          id="hourlyRate"
          name="hourlyRate"
          type="number"
          min={0}
          defaultValue={profile.hourlyRate ?? ""}
          className={inputClassName}
        />
      </div>
      <fieldset>
        <legend className="text-sm font-medium text-zinc-700">Навыки</legend>
        <div className="mt-2 flex flex-wrap gap-3">
          {allSkills.map((skill) => (
            <label
              key={skill.id}
              className="flex items-center gap-2 text-sm text-zinc-700"
            >
              <input
                type="checkbox"
                name="skillIds"
                value={skill.id}
                defaultChecked={profile.skillIds.includes(skill.id)}
              />
              {skill.name}
            </label>
          ))}
        </div>
      </fieldset>
      <FormActionError error={state.error} className="text-sm text-red-600" />
      {state.success && <p className="text-sm text-green-700">Сохранено</p>}
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50"
      >
        {pending ? "Сохраняем…" : "Сохранить профиль"}
      </button>
    </form>
  );
}

function PortfolioSection({ portfolio }: { portfolio: PortfolioItem[] }) {
  const [addState, addAction, addPending] = useActionState(
    addPortfolioItem,
    initialState,
  );
  const [delState, delAction, delPending] = useActionState(
    deletePortfolioItem,
    initialState,
  );

  return (
    <section className="mt-10 border-t border-zinc-200 pt-10">
      <h2 className="text-lg font-semibold text-zinc-900">Портфолио</h2>

      {portfolio.length > 0 && (
        <ul className="mt-4 space-y-3">
          {portfolio.map((item) => (
            <li
              key={item.id}
              className="flex items-start justify-between gap-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4"
            >
              <div>
                <p className="font-medium text-zinc-900">{item.title}</p>
                {item.description && (
                  <p className="mt-1 text-sm text-zinc-600">{item.description}</p>
                )}
              </div>
              <form action={delAction}>
                <input type="hidden" name="itemId" value={item.id} />
                <button
                  type="submit"
                  disabled={delPending}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Удалить
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}

      <form
        action={addAction}
        encType="multipart/form-data"
        className="mt-6 space-y-3 rounded-xl border border-dashed border-zinc-300 p-4"
      >
        <p className="text-sm font-medium text-zinc-700">Добавить работу</p>
        <input
          name="title"
          required
          placeholder="Название"
          className={inputClassName}
        />
        <textarea
          name="description"
          rows={2}
          placeholder="Описание"
          className={inputClassName}
        />
        <input
          name="imageFile"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="block w-full text-sm text-zinc-700 file:mr-3 file:rounded-lg file:border-0 file:bg-zinc-100 file:px-3 file:py-2 file:text-sm file:font-medium hover:file:bg-zinc-200"
        />
        <input
          name="imageUrl"
          type="url"
          placeholder="URL изображения (если без файла)"
          className={inputClassName}
        />
        <input
          name="projectUrl"
          type="url"
          placeholder="Ссылка на проект"
          className={inputClassName}
        />
        {addState.error && <p className="text-sm text-red-600">{addState.error}</p>}
        {addState.success && <p className="text-sm text-green-700">Добавлено</p>}
        <button
          type="submit"
          disabled={addPending}
          className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-50 disabled:opacity-50"
        >
          {addPending ? "Добавляем…" : "Добавить"}
        </button>
      </form>
      {delState.error && (
        <p className="mt-2 text-sm text-red-600">{delState.error}</p>
      )}
    </section>
  );
}

export function ProfileEditForms({
  user,
  profile,
  portfolio,
  allSkills,
}: ProfileEditFormsProps) {
  const isFreelancer = user.role === "FREELANCER" || user.role === "ADMIN";

  return (
    <div>
      <BasicProfileForm user={user} />
      {isFreelancer && profile && (
        <>
          <FreelancerForm profile={profile} allSkills={allSkills} />
          <PortfolioSection portfolio={portfolio} />
        </>
      )}
      <p className="mt-8">
        <Link href="/profile" className="text-sm text-blue-600 underline">
          ← Вернуться в кабинет
        </Link>
      </p>
    </div>
  );
}
