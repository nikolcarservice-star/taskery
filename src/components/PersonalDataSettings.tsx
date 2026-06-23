"use client";

import { useLocalizedPath } from "@/components/LocalizedLink";
import { FormActionError } from "@/components/FormActionError";
import { UserAvatar } from "@/components/UserAvatar";
import {
  updateContactData,
  updatePersonalData,
  updateProfilePhoto,
  type ActionState,
} from "@/lib/actions/personal-data";
import {
  getCountryOptions,
  getLanguageLevelOptions,
  getLanguageOptions,
  getRoleLabel,
} from "@/lib/i18n/cabinet-form-options";
import { useDictionary } from "@/lib/i18n/dictionary-context";
import { stripLocalePrefix } from "@/lib/i18n/routing";
import {
  type LanguageLevel,
  type PersonalDataForm,
  type PersonalDataTab,
  type UserLanguageRow,
} from "@/lib/personal-data-shared";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useActionState, useState } from "react";

type PersonalDataSettingsProps = {
  data: PersonalDataForm;
};

const initialState: ActionState = {};

const inputClassName =
  "mt-1.5 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-800 outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20";

const labelClassName = "block text-sm font-medium text-zinc-700";

function FormMessage({
  state,
  savedLabel,
}: {
  state: ActionState;
  savedLabel: string;
}) {
  if (state.error) {
    return <FormActionError error={state.error} className="text-sm text-red-600" />;
  }
  if (state.success) {
    return <p className="text-sm text-emerald-700">{savedLabel}</p>;
  }
  return null;
}

function SectionTitle({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="border-b border-zinc-100 pb-4">
      <h2 className="text-base font-semibold text-zinc-900">{title}</h2>
      {description && (
        <p className="mt-1 text-sm text-zinc-500">{description}</p>
      )}
    </div>
  );
}

function SaveButton({
  pending,
  label,
  savingLabel,
}: {
  pending: boolean;
  label: string;
  savingLabel: string;
}) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 disabled:opacity-50"
    >
      {pending ? savingLabel : label}
    </button>
  );
}

function MyDataTab({ data, isClient }: { data: PersonalDataForm; isClient: boolean }) {
  const dict = useDictionary();
  const l = useLocalizedPath();
  const t = dict.cabinetForms.personalData;
  const common = dict.cabinetForms.common;
  const [state, formAction, pending] = useActionState(
    updatePersonalData,
    initialState,
  );
  const [languages, setLanguages] = useState<UserLanguageRow[]>(
    data.languages.length > 0
      ? data.languages
      : [{ id: "new-0", language: "ru", level: "NATIVE" }],
  );
  const languageOptions = getLanguageOptions(dict);
  const levelOptions = getLanguageLevelOptions(dict);
  const countryOptions = getCountryOptions(dict);

  function addLanguage() {
    setLanguages((prev) => [
      ...prev,
      {
        id: `new-${Date.now()}`,
        language: "en",
        level: "INTERMEDIATE" as LanguageLevel,
      },
    ]);
  }

  function removeLanguage(id: string) {
    setLanguages((prev) => prev.filter((item) => item.id !== id));
  }

  function updateLanguage(
    id: string,
    field: "language" | "level",
    value: string,
  ) {
    setLanguages((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    );
  }

  return (
    <form action={formAction} className="space-y-8">
      {!isClient && (
        <section className="space-y-4">
          <SectionTitle
            title={t.cooperationTitle}
            description={t.cooperationDescription}
          />
          <div className="space-y-3">
            <label className="flex items-center gap-3 text-sm text-zinc-700">
              <input
                type="checkbox"
                name="wantsFreelanceProjects"
                defaultChecked={data.wantsFreelanceProjects}
                className="h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
              />
              {t.wantsFreelanceProjects}
            </label>
            <label className="flex items-center gap-3 text-sm text-zinc-700">
              <input
                type="checkbox"
                name="wantsRemoteWork"
                defaultChecked={data.wantsRemoteWork}
                className="h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
              />
              {t.wantsRemoteWork}
            </label>
          </div>
        </section>
      )}

      <section className="space-y-4">
        <SectionTitle title={t.accountParamsTitle} />
        <dl className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg bg-zinc-50 px-4 py-3">
            <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
              {t.login}
            </dt>
            <dd className="mt-1 text-sm font-medium text-zinc-900">
              {data.email.split("@")[0]}
            </dd>
          </div>
          <div className="rounded-lg bg-zinc-50 px-4 py-3">
            <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
              {t.profileType}
            </dt>
            <dd className="mt-1 text-sm font-medium text-zinc-900">
              {getRoleLabel(dict, data.role)}
            </dd>
          </div>
        </dl>
        {!isClient && (
          <p className="text-sm text-zinc-500">
            {t.clientRoleHintBefore}{" "}
            <Link href={l("/contact")} className="font-medium text-indigo-600 hover:underline">
              {t.clientRoleHintLink}
            </Link>
            {t.clientRoleHintAfter}
          </p>
        )}
      </section>

      <section className="space-y-4">
        <SectionTitle title={t.languagesTitle} />
        <div className="space-y-3">
          {languages.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-3 rounded-lg border border-zinc-200 bg-zinc-50/60 p-3 sm:flex-row sm:items-center"
            >
              <select
                name="languageCodes"
                value={item.language}
                onChange={(event) =>
                  updateLanguage(item.id, "language", event.target.value)
                }
                className={`${inputClassName} mt-0 sm:flex-1`}
              >
                {languageOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <select
                name="languageLevels"
                value={item.level}
                onChange={(event) =>
                  updateLanguage(item.id, "level", event.target.value)
                }
                className={`${inputClassName} mt-0 sm:flex-1`}
              >
                {levelOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => removeLanguage(item.id)}
                disabled={languages.length === 1}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center self-end rounded-lg text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-40 sm:self-auto"
                title={t.removeLanguage}
              >
                <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addLanguage}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
        >
          {t.addLanguage}
        </button>
      </section>

      <section className="space-y-4">
        <SectionTitle title={t.personalInfoTitle} />
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="firstName" className={labelClassName}>
              {t.firstName} <span className="text-red-500">*</span>
            </label>
            <input
              id="firstName"
              name="firstName"
              required
              defaultValue={data.firstName ?? ""}
              className={inputClassName}
            />
          </div>
          <div>
            <label htmlFor="lastName" className={labelClassName}>
              {t.lastName} <span className="text-red-500">*</span>
            </label>
            <input
              id="lastName"
              name="lastName"
              required
              defaultValue={data.lastName ?? ""}
              className={inputClassName}
            />
          </div>
          <div>
            <label htmlFor="dateOfBirth" className={labelClassName}>
              {t.dateOfBirth}
            </label>
            <input
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              defaultValue={data.dateOfBirth ?? ""}
              className={inputClassName}
            />
          </div>
          <div className="grid gap-4 sm:col-span-2 sm:grid-cols-2">
            <div>
              <label htmlFor="country" className={labelClassName}>
                {t.country}
              </label>
              <select
                id="country"
                name="country"
                defaultValue={data.country ?? ""}
                className={inputClassName}
              >
                <option value="">{common.notSelected}</option>
                {countryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="city" className={labelClassName}>
                {t.city}
              </label>
              <input
                id="city"
                name="city"
                defaultValue={data.city ?? ""}
                placeholder={t.cityPlaceholder}
                className={inputClassName}
              />
            </div>
          </div>
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-4 border-t border-zinc-100 pt-6">
        <SaveButton pending={pending} label={common.save} savingLabel={common.saving} />
        <FormMessage state={state} savedLabel={common.saved} />
      </div>
    </form>
  );
}

function PhotoTab({ data, isClient }: { data: PersonalDataForm; isClient: boolean }) {
  const dict = useDictionary();
  const t = dict.cabinetForms.personalData;
  const common = dict.cabinetForms.common;
  const [state, formAction, pending] = useActionState(
    updateProfilePhoto,
    initialState,
  );
  const [preview, setPreview] = useState(data.avatar);
  const [fileName, setFileName] = useState<string | null>(null);
  const [removePhoto, setRemovePhoto] = useState(false);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setRemovePhoto(false);
    setFileName(file.name);
    setPreview((current) => {
      if (current?.startsWith("blob:")) {
        URL.revokeObjectURL(current);
      }
      return URL.createObjectURL(file);
    });
  }

  function handleRemovePhoto() {
    setRemovePhoto(true);
    setFileName(null);
    setPreview((current) => {
      if (current?.startsWith("blob:")) {
        URL.revokeObjectURL(current);
      }
      return null;
    });
  }

  return (
    <form action={formAction} encType="multipart/form-data" className="space-y-6">
      <SectionTitle
        title={t.photoTitle}
        description={isClient ? t.photoDescriptionClient : t.photoDescriptionFreelancer}
      />

      <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
        <UserAvatar
          name={`${data.firstName ?? ""} ${data.lastName ?? ""}`.trim() || data.email}
          avatar={preview}
          size="md"
          className="h-24 w-24 text-2xl"
        />
        <div className="min-w-0 flex-1 space-y-3">
          <div>
            <span className={labelClassName}>{t.photoLabel}</span>
            <div className="mt-1.5 flex flex-wrap items-center gap-3">
              <label
                htmlFor="avatar"
                className="inline-flex cursor-pointer items-center rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-800 transition-colors hover:border-indigo-300 hover:bg-indigo-50"
              >
                {t.chooseFile}
                <input
                  id="avatar"
                  name="avatar"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="sr-only"
                />
              </label>
              {data.avatar && !removePhoto && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="text-sm font-medium text-red-600 hover:underline"
                >
                  {t.removePhoto}
                </button>
              )}
            </div>
            {fileName ? (
              <p className="mt-2 text-xs text-zinc-500">{fileName}</p>
            ) : (
              <p className="mt-2 text-xs text-zinc-500">{t.fileHint}</p>
            )}
          </div>
          {removePhoto && (
            <input type="hidden" name="removeAvatar" value="true" />
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 border-t border-zinc-100 pt-6">
        <SaveButton pending={pending} label={common.save} savingLabel={common.saving} />
        <FormMessage state={state} savedLabel={common.saved} />
      </div>
    </form>
  );
}

function ContactsTab({ data }: { data: PersonalDataForm }) {
  const dict = useDictionary();
  const t = dict.cabinetForms.personalData;
  const common = dict.cabinetForms.common;
  const [state, formAction, pending] = useActionState(
    updateContactData,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-6">
      <SectionTitle title={t.contactsTitle} description={t.contactsDescription} />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className={labelClassName}>
            {t.email}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={data.email}
            readOnly
            className={`${inputClassName} bg-zinc-50 text-zinc-500`}
          />
        </div>
        <div>
          <label htmlFor="phone" className={labelClassName}>
            {t.phone}
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            defaultValue={data.phone ?? ""}
            placeholder="+380…"
            className={inputClassName}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 border-t border-zinc-100 pt-6">
        <SaveButton pending={pending} label={common.save} savingLabel={common.saving} />
        <FormMessage state={state} savedLabel={common.saved} />
      </div>
    </form>
  );
}

function PaymentTab({ isClient }: { isClient: boolean }) {
  const l = useLocalizedPath();
  const dict = useDictionary();
  const t = dict.cabinetForms.personalData;
  const financesHref = isClient
    ? l("/client/finances")
    : l("/dashboard/finances?tab=withdrawals");

  return (
    <div className="space-y-6">
      <SectionTitle
        title={t.paymentTitle}
        description={isClient ? t.paymentDescriptionClient : t.paymentDescriptionFreelancer}
      />
      <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50/80 px-6 py-12 text-center">
        <p className="text-base font-semibold text-zinc-900">
          {t.paymentUnderDevelopment}
        </p>
        <p className="mt-2 text-sm text-zinc-500">
          {isClient ? t.paymentSoonClient : t.paymentSoonFreelancer}
        </p>
        <Link
          href={financesHref}
          className="mt-4 inline-flex text-sm font-medium text-indigo-600 hover:underline"
        >
          {isClient ? t.goFinancesClient : t.goFinancesFreelancer}
        </Link>
      </div>
    </div>
  );
}

export function PersonalDataSettings({ data }: PersonalDataSettingsProps) {
  const dict = useDictionary();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const l = useLocalizedPath();
  const tabLabels = dict.cabinetForms.personalData.tabs;
  const tabs: { id: PersonalDataTab; label: string }[] = [
    { id: "data", label: tabLabels.data },
    { id: "photo", label: tabLabels.photo },
    { id: "contacts", label: tabLabels.contacts },
    { id: "payment", label: tabLabels.payment },
  ];
  const isClient = data.role === "CLIENT";
  const pathWithoutLocale = stripLocalePrefix(pathname);
  const personalBase = pathWithoutLocale.startsWith("/client")
    ? l("/client/personal")
    : l("/dashboard/personal");
  const tabParam = searchParams.get("tab");
  const activeTab: PersonalDataTab =
    tabParam === "photo" ||
    tabParam === "contacts" ||
    tabParam === "payment"
      ? tabParam
      : "data";

  function setTab(tab: PersonalDataTab) {
    const params = new URLSearchParams(searchParams.toString());
    if (tab === "data") params.delete("tab");
    else params.set("tab", tab);
    const query = params.toString();
    router.push(query ? `${personalBase}?${query}` : personalBase);
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 border-b border-zinc-200 pb-4">
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

      <div className="mt-6">
        {activeTab === "data" && <MyDataTab data={data} isClient={isClient} />}
        {activeTab === "photo" && <PhotoTab data={data} isClient={isClient} />}
        {activeTab === "contacts" && <ContactsTab data={data} />}
        {activeTab === "payment" && <PaymentTab isClient={isClient} />}
      </div>
    </div>
  );
}
