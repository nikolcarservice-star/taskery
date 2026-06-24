"use client";

import {
  adminCloseProject,
  adminRefundDispute,
  adminReleaseDispute,
  adminSplitDispute,
  type ActionState,
} from "@/lib/actions/admin";
import { adminBlockProject } from "@/lib/actions/admin-moderation";
import { AdminAttentionPanel } from "@/components/AdminAttentionPanel";
import { AdminContentModerationPanel } from "@/components/AdminContentModerationPanel";
import { AdminPendingProjectsPanel } from "@/components/AdminPendingProjectsPanel";
import { AdminReportsPanel } from "@/components/AdminReportsPanel";
import { AdminSupportPanel } from "@/components/AdminSupportPanel";
import { AdminTabNav } from "@/components/admin/AdminTabNav";
import type { ModerationAttentionItem } from "@/lib/queries/admin-attention";
import { adminConversationReviewPath } from "@/lib/admin-review-paths";
import {
  MODERATION_SECTIONS,
  resolveModerationSection,
  type ModerationSectionKey,
} from "@/lib/admin-tabs";
import { formatBudget } from "@/lib/project-labels";
import { contractStatusLabels } from "@/lib/contract-labels";
import type { ContentModerationOverview } from "@/lib/queries/admin-content-moderation";
import type { PendingProjectItem } from "@/lib/queries/admin-pending-projects";
import type { AdminSupportTicketItem } from "@/lib/queries/admin-support";
import { getAdminCopy } from "@/lib/admin-i18n";
import type { AppLocale } from "@/lib/i18n/types";
import { useRouter, useSearchParams } from "next/navigation";
import { useActionState, useMemo, useState } from "react";

type DisputeProject = {
  id: string;
  title: string;
  status: string;
  currency: string;
  client: { name: string | null; email: string };
  conversation: { id: string } | null;
  contract: {
    id: string;
    amount: { toString(): string };
    status: string;
    freelancer: { name: string | null; email: string };
  } | null;
};

type AdminModerationStackProps = {
  attentionItems: ModerationAttentionItem[];
  reports: import("@/lib/reports-shared").AdminReportItem[];
  disputes: DisputeProject[];
  openProjects: {
    id: string;
    slug: string;
    title: string;
    client: { name: string | null };
  }[];
  pendingProjects?: PendingProjectItem[];
  contentModeration?: ContentModerationOverview;
  supportTickets?: AdminSupportTicketItem[];
  compact?: boolean;
  moderationBackHref?: string;
  layout?: "stack" | "tabs";
  syncSectionToUrl?: boolean;
  locale?: AppLocale;
  moderationBasePath?: string;
};

const initialState: ActionState = {};

function DisputeActions({
  projectId,
  locale,
}: {
  projectId: string;
  locale: AppLocale;
}) {
  const p = getAdminCopy(locale).panels.disputes;
  const [showSplit, setShowSplit] = useState(false);
  const [releaseState, releaseAction, releasePending] = useActionState(
    adminReleaseDispute,
    initialState,
  );
  const [refundState, refundAction, refundPending] = useActionState(
    adminRefundDispute,
    initialState,
  );
  const [splitState, splitAction, splitPending] = useActionState(
    adminSplitDispute,
    initialState,
  );

  return (
    <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
      <form action={releaseAction} className="flex-1 sm:flex-none">
        <input type="hidden" name="projectId" value={projectId} />
        <button
          type="submit"
          disabled={releasePending}
          className="w-full rounded-xl bg-green-600 px-4 py-2.5 text-sm font-medium text-white active:bg-green-700 disabled:opacity-50 sm:w-auto"
        >
          {p.releaseToFreelancer}
        </button>
      </form>
      <form action={refundAction} className="flex-1 sm:flex-none">
        <input type="hidden" name="projectId" value={projectId} />
        <button
          type="submit"
          disabled={refundPending}
          className="w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white active:bg-blue-700 disabled:opacity-50 sm:w-auto"
        >
          {p.refundToClient}
        </button>
      </form>
      <button
        type="button"
        onClick={() => setShowSplit((value) => !value)}
        className="w-full rounded-xl border border-violet-300 bg-violet-50 px-4 py-2.5 text-sm font-medium text-violet-800 active:bg-violet-100 sm:w-auto"
      >
        {showSplit ? p.splitHide : p.splitShow}
      </button>

      {showSplit && (
        <form
          action={splitAction}
          className="w-full rounded-xl border border-violet-200 bg-violet-50/60 p-3"
        >
          <input type="hidden" name="projectId" value={projectId} />
          <label className="block text-xs font-medium text-violet-900">
            {p.splitPercent}
          </label>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <input
              type="number"
              name="freelancerPercent"
              min={1}
              max={99}
              defaultValue={50}
              required
              className="w-24 rounded-lg border border-violet-200 bg-white px-3 py-2 text-sm"
            />
            <button
              type="submit"
              disabled={splitPending}
              className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-50"
            >
              {splitPending ? p.splitApplying : p.splitApply}
            </button>
          </div>
          {splitState.error && (
            <p className="mt-2 text-xs text-red-600">{splitState.error}</p>
          )}
          {splitState.success && (
            <p className="mt-2 text-xs text-green-700">{p.splitResolved}</p>
          )}
        </form>
      )}

      {(releaseState.error || refundState.error) && (
        <p className="w-full text-xs text-red-600">
          {releaseState.error || refundState.error}
        </p>
      )}
      {(releaseState.success || refundState.success) && (
        <p className="w-full text-xs text-green-700">{p.resolved}</p>
      )}
    </div>
  );
}

function BlockProjectButton({
  projectId,
  locale,
}: {
  projectId: string;
  locale: AppLocale;
}) {
  const c = getAdminCopy(locale).panels.common;
  const [state, formAction, pending] = useActionState(
    adminBlockProject,
    initialState,
  );

  return (
    <form action={formAction} className="flex min-w-[200px] flex-col gap-2">
      <input type="hidden" name="projectId" value={projectId} />
      <input
        name="adminNote"
        required
        placeholder={c.blockReason}
        className="rounded-lg border border-red-200 bg-white px-3 py-2 text-xs"
      />
      <button
        type="submit"
        disabled={pending}
        className="rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-xs font-medium text-red-800 active:bg-red-100 disabled:opacity-50"
      >
        {pending ? "…" : c.block}
      </button>
      {state.error && <p className="text-xs text-red-600">{state.error}</p>}
      {state.success && <p className="text-xs text-green-700">{c.blocked}</p>}
    </form>
  );
}

function CloseProjectButton({
  projectId,
  locale,
}: {
  projectId: string;
  locale: AppLocale;
}) {
  const c = getAdminCopy(locale).panels.common;
  const [state, formAction, pending] = useActionState(
    adminCloseProject,
    initialState,
  );

  return (
    <form action={formAction}>
      <input type="hidden" name="projectId" value={projectId} />
      <button
        type="submit"
        disabled={pending}
        className="rounded-xl border border-zinc-300 px-3 py-2 text-xs font-medium text-zinc-700 active:bg-zinc-50 disabled:opacity-50"
      >
        {c.close}
      </button>
      {state.success && (
        <span className="ml-2 text-xs text-green-700">{c.ok}</span>
      )}
    </form>
  );
}

function DisputesSection({
  disputes,
  moderationBackHref,
  locale,
}: {
  disputes: DisputeProject[];
  moderationBackHref: string;
  locale: AppLocale;
}) {
  const p = getAdminCopy(locale).panels.disputes;
  return (
    <section className="rounded-2xl border border-red-200 bg-white p-4 shadow-sm sm:p-6">
      <h2 className="text-base font-semibold text-red-900 sm:text-lg">
        {p.title} ({disputes.length})
      </h2>
      {disputes.length === 0 ? (
        <p className="mt-3 text-sm text-zinc-600">{p.empty}</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {disputes.map((project) => (
            <li
              key={project.id}
              className="rounded-xl border border-red-100 bg-red-50 p-4"
            >
              <p className="font-medium text-zinc-900">{project.title}</p>
              {project.contract && (
                <>
                  <p className="mt-1 text-sm text-zinc-600">
                    {formatBudget(project.contract.amount, project.currency)} ·{" "}
                    {contractStatusLabels[
                      project.contract.status as keyof typeof contractStatusLabels
                    ]}
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">
                    {project.client.name ?? project.client.email} ·{" "}
                    {project.contract.freelancer.name ??
                      project.contract.freelancer.email}
                  </p>
                  {project.conversation && (
                    <a
                      href={adminConversationReviewPath(
                        project.conversation.id,
                        moderationBackHref,
                      )}
                      className="mt-3 inline-flex items-center rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white active:bg-red-700"
                    >
                      {p.openChat}
                    </a>
                  )}
                  <DisputeActions projectId={project.id} locale={locale} />
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function OpenProjectsSection({
  openProjects,
  locale,
}: {
  openProjects: AdminModerationStackProps["openProjects"];
  locale: AppLocale;
}) {
  const p = getAdminCopy(locale).panels.openProjects;
  const c = getAdminCopy(locale).panels.common;
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-6">
      <h2 className="text-base font-semibold text-zinc-900 sm:text-lg">
        {p.title} ({openProjects.length})
      </h2>
      {openProjects.length === 0 ? (
        <p className="mt-3 text-sm text-zinc-600">{p.empty}</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {openProjects.map((project) => (
            <li
              key={project.id}
              className="flex flex-col gap-3 rounded-xl border border-zinc-100 bg-zinc-50/60 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <a
                  href={`/projects/${project.slug}`}
                  className="font-medium text-zinc-900 hover:text-blue-600"
                >
                  {project.title}
                </a>
                <p className="text-xs text-zinc-500">
                  {project.client.name ?? c.client}
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
                <CloseProjectButton projectId={project.id} locale={locale} />
                <BlockProjectButton projectId={project.id} locale={locale} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function AdminModerationStack({
  attentionItems,
  reports,
  disputes,
  openProjects,
  pendingProjects = [],
  contentModeration,
  supportTickets = [],
  compact = false,
  moderationBackHref = "/admin/moderation",
  layout = "stack",
  syncSectionToUrl = false,
  locale = "ru",
  moderationBasePath = "/admin/moderation",
}: AdminModerationStackProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const adminCopy = getAdminCopy(locale);
  const gap = compact ? "space-y-4" : "space-y-8";
  const contentCount = contentModeration
    ? contentModeration.portfolio.length + contentModeration.avatars.length
    : 0;
  const openSupportCount = supportTickets.filter((ticket) =>
    ["OPEN", "IN_PROGRESS"].includes(ticket.status),
  ).length;

  const sectionBadges = useMemo(
    () => ({
      attention: attentionItems.length,
      disputes: disputes.length,
      reports: reports.length,
      projects: pendingProjects.length + contentCount + openProjects.length,
      support: openSupportCount,
    }),
    [
      attentionItems.length,
      disputes.length,
      reports.length,
      pendingProjects.length,
      contentCount,
      openProjects.length,
      openSupportCount,
    ],
  );

  const [localSection, setLocalSection] =
    useState<ModerationSectionKey>("attention");

  const activeSection = syncSectionToUrl
    ? resolveModerationSection(searchParams.get("section"))
    : localSection;

  function setActiveSection(section: ModerationSectionKey) {
    if (syncSectionToUrl) {
      const params = new URLSearchParams(searchParams.toString());
      if (section === "attention") {
        params.delete("section");
      } else {
        params.set("section", section);
      }
      const query = params.toString();
      router.replace(
        query ? `${moderationBasePath}?${query}` : moderationBasePath,
        {
          scroll: false,
        },
      );
      return;
    }
    setLocalSection(section);
  }

  const firstNonEmptySection = useMemo(() => {
    for (const section of MODERATION_SECTIONS) {
      if (sectionBadges[section.id] > 0) return section.id;
    }
    return "attention" as ModerationSectionKey;
  }, [sectionBadges]);

  const currentSection =
    layout === "tabs" && sectionBadges[activeSection] === 0
      ? firstNonEmptySection
      : activeSection;

  const attentionBlock = (
    <AdminAttentionPanel
      items={attentionItems}
      moderationBackHref={moderationBackHref}
      locale={locale}
    />
  );
  const reportsBlock = <AdminReportsPanel reports={reports} locale={locale} />;
  const disputesBlock = (
    <DisputesSection
      disputes={disputes}
      moderationBackHref={moderationBackHref}
      locale={locale}
    />
  );
  const projectsBlock = (
    <div className={gap}>
      {pendingProjects.length > 0 && (
        <AdminPendingProjectsPanel projects={pendingProjects} locale={locale} />
      )}
      {contentModeration &&
        (contentModeration.portfolio.length > 0 ||
          contentModeration.avatars.length > 0) && (
          <AdminContentModerationPanel queue={contentModeration} locale={locale} />
        )}
      <OpenProjectsSection openProjects={openProjects} locale={locale} />
    </div>
  );
  const supportBlock = <AdminSupportPanel tickets={supportTickets} locale={locale} />;

  if (layout === "tabs") {
    return (
      <div className="space-y-5">
        <AdminTabNav
          size={compact ? "sm" : "md"}
          ariaLabel={adminCopy.tabNavAria}
          tabs={MODERATION_SECTIONS.map((section) => ({
            id: section.id,
            label: adminCopy.moderationSections[section.id],
            badge: sectionBadges[section.id],
          }))}
          active={currentSection}
          onChange={setActiveSection}
        />

        <div role="tabpanel">
          {currentSection === "attention" && attentionBlock}
          {currentSection === "disputes" && disputesBlock}
          {currentSection === "reports" && reportsBlock}
          {currentSection === "projects" && projectsBlock}
          {currentSection === "support" && supportBlock}
        </div>
      </div>
    );
  }

  return (
    <div className={gap}>
      {attentionBlock}
      {disputesBlock}
      {reportsBlock}
      {projectsBlock}
      {supportTickets.length > 0 && supportBlock}
    </div>
  );
}
