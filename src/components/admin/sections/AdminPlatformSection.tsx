"use client";

import { AdminBroadcastPanel } from "@/components/AdminBroadcastPanel";
import { AdminCatalogPanel } from "@/components/AdminCatalogPanel";
import { AdminCmsPanel } from "@/components/AdminCmsPanel";
import { AdminTabNav } from "@/components/admin/AdminTabNav";
import { getAdminCopy } from "@/lib/admin-i18n";
import type { CmsPageItem } from "@/lib/queries/admin-cms";
import type { AdminCategoryItem, AdminSkillItem } from "@/lib/queries/admin-catalog";
import type { AppLocale } from "@/lib/i18n/types";
import { useRouter, useSearchParams } from "next/navigation";

type PlatformSectionKey = "catalog" | "cms" | "broadcast";

type AdminPlatformSectionProps = {
  catalogCategories: AdminCategoryItem[];
  catalogSkills: AdminSkillItem[];
  cmsPages: CmsPageItem[];
  stats: { freelancers: number; clients: number };
  locale: AppLocale;
  basePath?: string;
};

export function AdminPlatformSection({
  catalogCategories,
  catalogSkills,
  cmsPages,
  stats,
  locale,
  basePath = "/admin/platform",
}: AdminPlatformSectionProps) {
  const copy = getAdminCopy(locale);
  const router = useRouter();
  const searchParams = useSearchParams();
  const sectionParam = searchParams.get("section");
  const activeSection: PlatformSectionKey =
    sectionParam === "cms" || sectionParam === "broadcast"
      ? sectionParam
      : "catalog";

  function setSection(section: PlatformSectionKey) {
    const params = new URLSearchParams(searchParams.toString());
    if (section === "catalog") {
      params.delete("section");
    } else {
      params.set("section", section);
    }
    const query = params.toString();
    router.replace(query ? `${basePath}?${query}` : basePath, {
      scroll: false,
    });
  }

  return (
    <div className="space-y-5">
      <AdminTabNav
        size="sm"
        ariaLabel={copy.tabNavAria}
        tabs={[
          { id: "catalog" as const, label: copy.platformSections.catalog },
          { id: "cms" as const, label: copy.platformSections.cms },
          { id: "broadcast" as const, label: copy.platformSections.broadcast },
        ]}
        active={activeSection}
        onChange={setSection}
      />
      {activeSection === "catalog" && (
        <AdminCatalogPanel
          categories={catalogCategories}
          skills={catalogSkills}
          locale={locale}
        />
      )}
      {activeSection === "cms" && <AdminCmsPanel pages={cmsPages} locale={locale} />}
      {activeSection === "broadcast" && (
        <AdminBroadcastPanel stats={stats} locale={locale} />
      )}
    </div>
  );
}
