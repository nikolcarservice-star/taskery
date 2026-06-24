"use client";

import { logoutAllSessions, type SessionActionState } from "@/lib/actions/sessions";
import { useDictionary } from "@/lib/i18n/dictionary-context";
import { useActionState } from "react";

const initialState: SessionActionState = {};

export function SessionLogoutAllButton() {
  const dict = useDictionary();
  const t = dict.settings.security;
  const [state, formAction, pending] = useActionState(logoutAllSessions, initialState);

  return (
    <form action={formAction} className="space-y-2">
      <p className="text-sm text-zinc-600">{t.sessionsHint}</p>
      <button
        type="submit"
        disabled={pending}
        className="inline-flex rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50"
      >
        {pending ? t.sessionsLoggingOut : t.sessionsLogoutAll}
      </button>
      {state.success && (
        <p className="text-sm text-emerald-700">{t.sessionsLoggedOut}</p>
      )}
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
    </form>
  );
}
