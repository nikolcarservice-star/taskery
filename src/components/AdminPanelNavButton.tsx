"use client";

import { useDictionary } from "@/lib/i18n/dictionary-context";
import Link from "next/link";

export function AdminPanelNavButton() {
  const dict = useDictionary();

  return (
    <Link
      href="/admin/overview"
      className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-red-700"
    >
      {dict.profileMenu.adminPanel}
    </Link>
  );
}
