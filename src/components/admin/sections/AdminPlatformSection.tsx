"use client";

import { AdminBroadcastPanel } from "@/components/AdminBroadcastPanel";
import { AdminCatalogPanel } from "@/components/AdminCatalogPanel";
import { AdminCmsPanel } from "@/components/AdminCmsPanel";
import { AdminTabNav } from "@/components/admin/AdminTabNav";
import type { CmsPageItem } from "@/lib/queries/admin-cms";
import type { AdminCategoryItem, AdminSkillItem } from "@/lib/queries/admin-catalog";
import { useRouter, useSearchParams } from "next/navigation";

type PlatformSectionKey = "catalog" | "cms" | "broadcast";

type AdminPlatformSectionProps = {
  catalogCategories: AdminCategoryItem[];
  catalogSkills: AdminSkillItem[];
  cmsPages: CmsPageItem[];
  stats: { freelancers: number; clients: number };
  basePath?: string;
};

export function AdminPlatformSection({
  catalogCategories,
  catalogSkills,
  cmsPages,
  stats,
  basePath = "/admin/platform",
}: AdminPlatformSectionProps) {
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
        tabs={[
          { id: "catalog" as const, label: "Каталог" },
          { id: "cms" as const, label: "CMS" },
          { id: "broadcast" as const, label: "Рассылка" },
        ]}
        active={activeSection}
        onChange={setSection}
      />
      {activeSection === "catalog" && (
        <AdminCatalogPanel
          categories={catalogCategories}
          skills={catalogSkills}
        />
      )}
      {activeSection === "cms" && <AdminCmsPanel pages={cmsPages} />}
      {activeSection === "broadcast" && (
        <AdminBroadcastPanel stats={stats} />
      )}
    </div>
  );
}
