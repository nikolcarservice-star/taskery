"use client";

import { EscrowFundingNotice } from "@/components/EscrowFundingNotice";
import { useLocalizedPath } from "@/components/LocalizedLink";
import { MessageThread } from "@/components/MessageThread";
import { useDictionary } from "@/lib/i18n/dictionary-context";
import Link from "next/link";
import type { ContractStatus, MessageKind, ProjectStatus } from "@/generated/prisma/client";

type ProjectDiscussionPanelProps = {
  conversationId: string;
  projectTitle: string;
  projectId: string;
  currency: string;
  projectStatus?: ProjectStatus;
  contractStatus?: ContractStatus | null;
  contractAmount?: number | null;
  isClient: boolean;
  clientBalance?: number;
  stripeEnabled?: boolean;
  messages: {
    id: string;
    kind: MessageKind;
    content: string;
    createdAt: Date;
    sender: { id: string; name: string | null; avatar?: string | null } | null;
    violationUser: { id: string; name: string | null } | null;
  }[];
  currentUserId: string;
  participantIds: string[];
  warnExternalLinks?: boolean;
  partner: {
    name: string | null;
    avatar: string | null;
  };
};

export function ProjectDiscussionPanel({
  conversationId,
  projectTitle,
  projectId,
  currency,
  projectStatus = "IN_PROGRESS",
  contractStatus,
  contractAmount,
  isClient,
  clientBalance = 0,
  stripeEnabled = false,
  messages,
  currentUserId,
  participantIds,
  warnExternalLinks = false,
  partner,
}: ProjectDiscussionPanelProps) {
  const dict = useDictionary();
  const l = useLocalizedPath();

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-zinc-600">
          {dict.projectDetail.discussion.summaryPrefix.replace("{title}", projectTitle)}
          {partner.name ?? dict.projectDetail.discussion.summaryFallback}.
        </p>
        <Link
          href={l(`/messages/${conversationId}`)}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
        >
          {dict.projectDetail.common.openInMessages}
        </Link>
      </div>

      {contractStatus && contractAmount != null && (
        <EscrowFundingNotice
          contractStatus={contractStatus}
          projectStatus={projectStatus}
          amount={contractAmount}
          currency={currency}
          isClient={isClient}
          projectId={projectId}
          clientBalance={clientBalance}
          stripeEnabled={stripeEnabled}
        />
      )}

      <div className="overflow-hidden rounded-xl border border-zinc-200">
        <MessageThread
          conversationId={conversationId}
          messages={messages}
          currentUserId={currentUserId}
          participantIds={participantIds}
          warnExternalLinks={warnExternalLinks}
          partner={partner}
        />
      </div>
    </div>
  );
}
