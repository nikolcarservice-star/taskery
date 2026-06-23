"use client";

import { useLocalizedPath } from "@/components/LocalizedLink";
import { FormActionError } from "@/components/FormActionError";
import {
  updateFreelancerAbout,
  updateFreelancerExtra,
  updateFreelancerLegal,
  updateFreelancerSpecialization,
  type ActionState,
} from "@/lib/actions/freelancer-profile";
import {
  getLegalStatusOptions,
  getWorkAvailabilityOptions,
} from "@/lib/i18n/cabinet-form-options";
import { useDictionary } from "@/lib/i18n/dictionary-context";
import {
  type FreelancerProfileData,
  type FreelancerProfileTab,
  type SkillOption,
} from "@/lib/freelancer-profile-shared";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useActionState } from "react";

type FreelancerProfileSettingsProps = {
  data: FreelancerProfileData;
  skills: SkillOption[];
};

const initialState: ActionState = {};

const inputClassName =
  "mt-1.5 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-800 outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20";

const labelClassName = "block text-sm font-medium text-zinc-700";

function FormFooter({
  state,
  pending,
}: {
  state: ActionState;
  pending: boolean;
}) {
  const common = useDictionary().cabinetForms.common;

  return (
    <div className="flex flex-wrap items-center gap-4 border-t border-zinc-100 pt-6">
      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 disabled:opacity-50"
      >
        {pending ? common.saving : common.save}
      </button>
      <FormActionError error={state.error} className="text-sm text-red-600" />
      {state.success && <p className="text-sm text-emerald-700">{common.saved}</p>}
    </div>
  );
}

function BioToolbar() {
  const common = useDictionary().cabinetForms.common;
  const btn =
    "inline-flex h-8 w-8 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700";

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-zinc-100 px-2 py-1.5">
      <button type="button" className={btn} title={common.bold}>
        <span className="text-xs font-bold">B</span>
      </button>
      <button type="button" className={btn} title={common.italic}>
        <span className="text-xs italic">I</span>
      </button>
      <button type="button" className={btn} title={common.list}>
        <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
        </svg>
      </button>
      <button type="button" className={btn} title={common.link}>
        <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
        </svg>
      </button>
    </div>
  );
}

function AboutTab({ data }: { data: FreelancerProfileData }) {
  const dict = useDictionary();
  const t = dict.cabinetForms.freelancerProfile;
  const common = dict.cabinetForms.common;
  const availabilityOptions = getWorkAvailabilityOptions(dict);
  const [state, formAction, pending] = useActionState(
    updateFreelancerAbout,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-8">
      <section className="space-y-4">
        <div className="border-b border-zinc-100 pb-4">
          <h2 className="text-base font-semibold text-zinc-900">{t.statusTitle}</h2>
          <p className="mt-1 text-sm text-zinc-500">{t.statusDescription}</p>
        </div>
        <div className="space-y-3">
          {availabilityOptions.map((option) => (
            <label
              key={option.value}
              className="flex cursor-pointer items-start gap-3 rounded-lg border border-zinc-200 bg-zinc-50/50 px-4 py-3 transition-colors has-[:checked]:border-indigo-300 has-[:checked]:bg-indigo-50/50"
            >
              <input
                type="radio"
                name="workAvailability"
                value={option.value}
                defaultChecked={data.workAvailability === option.value}
                className="mt-0.5 h-4 w-4 border-zinc-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span>
                <span className="block text-sm font-medium text-zinc-900">
                  {option.label}
                </span>
                <span className="mt-0.5 block text-xs text-zinc-500">
                  {option.hint}
                </span>
              </span>
            </label>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="border-b border-zinc-100 pb-4">
          <h2 className="text-base font-semibold text-zinc-900">{t.bioTitle}</h2>
          <p className="mt-1 text-sm text-zinc-500">{t.bioDescription}</p>
        </div>

        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-2">
            <span className="text-sm font-medium text-zinc-700">{t.bioLanguage}</span>
            <button
              type="button"
              disabled
              title={common.soon}
              className="text-sm text-indigo-600 opacity-50"
            >
              {common.addTranslation}
            </button>
          </div>
          <BioToolbar />
          <textarea
            id="bio"
            name="bio"
            rows={14}
            defaultValue={data.bio ?? ""}
            placeholder={t.bioPlaceholder}
            className="w-full resize-y border-0 bg-transparent px-4 py-3 text-sm leading-relaxed text-zinc-800 outline-none placeholder:text-zinc-400"
          />
        </div>

        <p className="text-xs text-zinc-500">{t.bioHint}</p>
      </section>

      <FormFooter state={state} pending={pending} />
    </form>
  );
}

function SpecializationTab({
  data,
  skills,
}: {
  data: FreelancerProfileData;
  skills: SkillOption[];
}) {
  const dict = useDictionary();
  const t = dict.cabinetForms.freelancerProfile;
  const [state, formAction, pending] = useActionState(
    updateFreelancerSpecialization,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-6">
      <div className="border-b border-zinc-100 pb-4">
        <h2 className="text-base font-semibold text-zinc-900">{t.specializationTitle}</h2>
        <p className="mt-1 text-sm text-zinc-500">{t.specializationDescription}</p>
      </div>

      <div>
        <label htmlFor="title" className={labelClassName}>
          {t.profileTitle}
        </label>
        <input
          id="title"
          name="title"
          defaultValue={data.title ?? ""}
          placeholder={t.profileTitlePlaceholder}
          className={inputClassName}
        />
      </div>

      <div>
        <label htmlFor="hourlyRate" className={labelClassName}>
          {t.hourlyRate}
        </label>
        <input
          id="hourlyRate"
          name="hourlyRate"
          type="number"
          min={0}
          defaultValue={data.hourlyRate ?? ""}
          className={inputClassName}
        />
      </div>

      <fieldset>
        <legend className={labelClassName}>{t.skills}</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {skills.map((skill) => (
            <label
              key={skill.id}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-700 transition-colors has-[:checked]:border-indigo-400 has-[:checked]:bg-indigo-50 has-[:checked]:text-indigo-800"
            >
              <input
                type="checkbox"
                name="skillIds"
                value={skill.id}
                defaultChecked={data.skillIds.includes(skill.id)}
                className="sr-only"
              />
              {skill.name}
            </label>
          ))}
        </div>
        {skills.length === 0 && (
          <p className="mt-2 text-sm text-zinc-500">{t.skillsEmpty}</p>
        )}
      </fieldset>

      <FormFooter state={state} pending={pending} />
    </form>
  );
}

function LegalTab({ data }: { data: FreelancerProfileData }) {
  const dict = useDictionary();
  const t = dict.cabinetForms.freelancerProfile;
  const common = dict.cabinetForms.common;
  const legalOptions = getLegalStatusOptions(dict);
  const [state, formAction, pending] = useActionState(
    updateFreelancerLegal,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-6">
      <div className="border-b border-zinc-100 pb-4">
        <h2 className="text-base font-semibold text-zinc-900">{t.legalTitle}</h2>
        <p className="mt-1 text-sm text-zinc-500">{t.legalDescription}</p>
      </div>

      <div className="space-y-3">
        {legalOptions.map((option) => (
          <label
            key={option.value}
            className="flex cursor-pointer items-center gap-3 rounded-lg border border-zinc-200 px-4 py-3 has-[:checked]:border-indigo-300 has-[:checked]:bg-indigo-50/50"
          >
            <input
              type="radio"
              name="legalStatus"
              value={option.value}
              defaultChecked={data.legalStatus === option.value}
              className="h-4 w-4 border-zinc-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm font-medium text-zinc-800">{option.label}</span>
          </label>
        ))}
      </div>

      <div>
        <label htmlFor="taxId" className={labelClassName}>
          {t.taxId}
        </label>
        <input
          id="taxId"
          name="taxId"
          defaultValue={data.taxId ?? ""}
          placeholder={t.taxIdPlaceholder || common.optional}
          className={inputClassName}
        />
      </div>

      <FormFooter state={state} pending={pending} />
    </form>
  );
}

function ExtraTab({ data }: { data: FreelancerProfileData }) {
  const dict = useDictionary();
  const t = dict.cabinetForms.freelancerProfile;
  const [state, formAction, pending] = useActionState(
    updateFreelancerExtra,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-6">
      <div className="border-b border-zinc-100 pb-4">
        <h2 className="text-base font-semibold text-zinc-900">{t.extraTitle}</h2>
        <p className="mt-1 text-sm text-zinc-500">{t.extraDescription}</p>
      </div>

      <div>
        <label htmlFor="website" className={labelClassName}>
          {t.website}
        </label>
        <input
          id="website"
          name="website"
          type="url"
          defaultValue={data.website ?? ""}
          placeholder="https://…"
          className={inputClassName}
        />
      </div>

      <div>
        <label htmlFor="experienceYears" className={labelClassName}>
          {t.experienceYears}
        </label>
        <input
          id="experienceYears"
          name="experienceYears"
          type="number"
          min={0}
          max={60}
          defaultValue={data.experienceYears ?? ""}
          className={inputClassName}
        />
      </div>

      <FormFooter state={state} pending={pending} />
    </form>
  );
}

export function FreelancerProfileSettings({
  data,
  skills,
}: FreelancerProfileSettingsProps) {
  const dict = useDictionary();
  const l = useLocalizedPath();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabLabels = dict.cabinetForms.freelancerProfile.tabs;
  const tabs: { id: FreelancerProfileTab; label: string }[] = [
    { id: "about", label: tabLabels.about },
    { id: "specialization", label: tabLabels.specialization },
    { id: "legal", label: tabLabels.legal },
    { id: "extra", label: tabLabels.extra },
  ];
  const profileBase = l("/dashboard/profile");
  const tabParam = searchParams.get("tab");
  const activeTab: FreelancerProfileTab =
    tabParam === "specialization" ||
    tabParam === "legal" ||
    tabParam === "extra"
      ? tabParam
      : "about";

  function setTab(tab: FreelancerProfileTab) {
    const params = new URLSearchParams(searchParams.toString());
    if (tab === "about") params.delete("tab");
    else params.set("tab", tab);
    const query = params.toString();
    router.push(query ? `${profileBase}?${query}` : profileBase);
  }

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setTab(tab.id)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <Link
          href={l(`/freelancers/${data.userId}`)}
          target="_blank"
          className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50"
        >
          <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>
          {dict.cabinetForms.freelancerProfile.publicProfile}
        </Link>
      </div>

      <div className="mt-6">
        {activeTab === "about" && <AboutTab data={data} />}
        {activeTab === "specialization" && (
          <SpecializationTab data={data} skills={skills} />
        )}
        {activeTab === "legal" && <LegalTab data={data} />}
        {activeTab === "extra" && <ExtraTab data={data} />}
      </div>
    </div>
  );
}
