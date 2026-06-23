"use client";

import { useDictionary } from "@/lib/i18n/dictionary-context";
import { useState } from "react";

type ProjectDetailTabsProps = {
  bidCount: number;
  hasConversation: boolean;
  bidsContent: React.ReactNode;
  discussionContent: React.ReactNode;
  defaultTab?: "bids" | "discussion";
};

export function ProjectDetailTabs({
  bidCount,
  hasConversation,
  bidsContent,
  discussionContent,
  defaultTab = "bids",
}: ProjectDetailTabsProps) {
  const dict = useDictionary();
  const [activeTab, setActiveTab] = useState<"bids" | "discussion">(defaultTab);

  return (
    <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
      <div className="flex border-b border-zinc-200 bg-zinc-50/80">
        <button
          type="button"
          onClick={() => setActiveTab("bids")}
          className={`flex items-center gap-2 px-5 py-4 text-sm font-semibold transition-colors ${
            activeTab === "bids"
              ? "border-b-2 border-indigo-600 bg-white text-indigo-700"
              : "text-zinc-600 hover:text-zinc-900"
          }`}
        >
          {dict.projectDetail.tabs.bids}
          <span
            className={`rounded-full px-2 py-0.5 text-xs ${
              activeTab === "bids"
                ? "bg-indigo-100 text-indigo-700"
                : "bg-zinc-200 text-zinc-700"
            }`}
          >
            {bidCount}
          </span>
        </button>
        {hasConversation && (
          <button
            type="button"
            onClick={() => setActiveTab("discussion")}
            className={`flex items-center gap-2 px-5 py-4 text-sm font-semibold transition-colors ${
              activeTab === "discussion"
                ? "border-b-2 border-indigo-600 bg-white text-indigo-700"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            {dict.projectDetail.tabs.discussion}
          </button>
        )}
      </div>

      <div className="p-5 sm:p-6">
        {activeTab === "bids" ? bidsContent : discussionContent}
      </div>
    </section>
  );
}
