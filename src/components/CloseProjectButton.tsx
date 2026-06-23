"use client";

import { closeProject, type UpdateProjectState } from "@/lib/actions/projects";
import { FormActionError } from "@/components/FormActionError";
import { useDictionary } from "@/lib/i18n/dictionary-context";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";

type CloseProjectButtonProps = {
  projectId: string;
  variant?: "sidebar" | "inline" | "section";
  label?: string;
  className?: string;
};

const initialState: UpdateProjectState = {};

export function CloseProjectButton({
  projectId,
  variant = "section",
  label,
  className,
}: CloseProjectButtonProps) {
  const dict = useDictionary();
  const t = dict.cabinetForms.closeProject;
  const buttonLabel = label ?? t.defaultLabel;
  const router = useRouter();
  const [state, formAction, pending] = useActionState(
    closeProject,
    initialState,
  );

  useEffect(() => {
    if (state.success) {
      router.refresh();
    }
  }, [state.success, router]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    const confirmed = window.confirm(t.confirm);
    if (!confirmed) {
      event.preventDefault();
    }
  }

  const buttonClassName =
    className ??
    (variant === "sidebar"
      ? "block w-full rounded-lg border border-red-200 px-4 py-2.5 text-center text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
      : variant === "inline"
        ? "text-sm font-medium text-red-600 hover:text-red-800 disabled:opacity-50"
        : "rounded-full border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50");

  return (
    <form
      action={formAction}
      onSubmit={handleSubmit}
      className={variant === "inline" ? "inline" : undefined}
    >
      <input type="hidden" name="projectId" value={projectId} />
      <FormActionError error={state.error} className="mb-2 text-sm text-red-600" />
      {state.success && variant !== "inline" && (
        <p className="mb-2 text-sm text-green-700">{t.closed}</p>
      )}
      <button type="submit" disabled={pending} className={buttonClassName}>
        {pending ? t.closing : buttonLabel}
      </button>
    </form>
  );
}
