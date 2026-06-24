"use client";

import { useDictionary } from "@/lib/i18n/dictionary-context";
import Link from "next/link";

export function AdminPanelNavButton() {
  const dict = useDictionary();

  return (
    <Link
      href="/admin/mobile"
      className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition-colors hover:bg-red-700 sm:px-4 sm:py-2 sm:text-sm"
    >
      {dict.profileMenu.adminPanel}
    </Link>
  );
}
