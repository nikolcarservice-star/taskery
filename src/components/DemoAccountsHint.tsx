"use client";

import { useDictionary } from "@/lib/i18n/dictionary-context";

const demoAccounts = [
  {
    roleKey: "clientRole",
    email: "client@taskery.local",
    password: "demo12345",
  },
  {
    roleKey: "freelancerRole",
    email: "freelancer@taskery.local",
    password: "demo12345",
  },
] as const;

export function DemoAccountsHint() {
  const dict = useDictionary();

  return (
    <div className="mt-6 rounded-xl border border-indigo-200 bg-indigo-50 p-4">
      <p className="text-sm font-medium text-indigo-900">{dict.auth.demo.title}</p>
      <ul className="mt-2 space-y-2">
        {demoAccounts.map((account) => (
          <li
            key={account.email}
            className="flex flex-col gap-0.5 text-xs text-indigo-800 sm:flex-row sm:items-center sm:justify-between"
          >
            <span className="font-medium">{dict.auth.demo[account.roleKey]}</span>
            <span className="font-mono">
              {account.email} · {account.password}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
