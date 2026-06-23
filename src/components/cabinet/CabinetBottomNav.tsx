"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState, type ReactNode } from "react";
import {
  BidsIcon,
  HomeIcon,
  MessagesIcon,
  PlusIcon,
  ProjectsIcon,
  WorkIcon,
} from "@/components/cabinet/CabinetNavIcons";
import { CabinetProfileSheet } from "@/components/cabinet/CabinetProfileSheet";
import { useLocalizedPath } from "@/components/LocalizedLink";
import { UserAvatar } from "@/components/UserAvatar";
import { isProfileAreaPath } from "@/lib/account-routes";
import { useDictionary } from "@/lib/i18n/dictionary-context";
import { stripLocalePrefix } from "@/lib/i18n/routing";

export const CABINET_BOTTOM_NAV_HEIGHT =
  "calc(3.75rem + env(safe-area-inset-bottom, 0px))";

type CabinetBottomNavProps = {
  role: "client" | "freelancer";
  unreadMessages?: number;
  unreadNotifications?: number;
  isAdmin?: boolean;
  userName?: string | null;
  userAvatar?: string | null;
};

type TabItem = {
  key: string;
  label: string;
  href?: string;
  icon: ReactNode;
  match: (path: string) => boolean;
  badge?: number;
  action?: "profile";
  primary?: boolean;
};

export function CabinetBottomNav({
  role,
  unreadMessages = 0,
  unreadNotifications = 0,
  isAdmin = false,
  userName = null,
  userAvatar = null,
}: CabinetBottomNavProps) {
  const pathname = usePathname();
  const path = stripLocalePrefix(pathname);
  const l = useLocalizedPath();
  const dict = useDictionary();
  const nav = dict.cabinet;
  const [profileOpen, setProfileOpen] = useState(false);

  const tabs = useMemo<TabItem[]>(() => {
    if (role === "client") {
      const c = nav.client;
      return [
        {
          key: "overview",
          label: c.overview,
          href: l("/client"),
          icon: <HomeIcon className="h-[22px] w-[22px]" />,
          match: (p) => p === "/client",
        },
        {
          key: "messages",
          label: c.messages,
          href: l("/messages"),
          icon: <MessagesIcon className="h-[22px] w-[22px]" />,
          match: (p) => p === "/messages" || p.startsWith("/messages/"),
          badge: unreadMessages,
        },
        {
          key: "new-project",
          label: dict.header.newProject.replace(/^\+?\s*/, ""),
          href: l("/client/projects/new"),
          icon: <PlusIcon className="h-5 w-5" />,
          match: (p) =>
            p === "/client/projects/new" ||
            p.startsWith("/client/projects/new/"),
          primary: true,
        },
        {
          key: "projects",
          label: c.projects,
          href: l("/client/projects"),
          icon: <ProjectsIcon className="h-[22px] w-[22px]" />,
          match: (p) =>
            p.startsWith("/client/projects") && p !== "/client/projects/new",
        },
        {
          key: "profile",
          label: nav.profileTab,
          icon: (
            <UserAvatar
              name={userName}
              avatar={userAvatar}
              size="sm"
              isAdmin={isAdmin}
              className="!h-7 !w-7 !text-xs"
            />
          ),
          match: (p) => isProfileAreaPath(p, "client"),
          action: "profile",
        },
      ];
    }

    const f = nav.freelancer;
    return [
      {
        key: "overview",
        label: f.overview,
        href: l("/dashboard"),
        icon: <HomeIcon className="h-[22px] w-[22px]" />,
        match: (p) => p === "/dashboard",
      },
      {
        key: "messages",
        label: f.messages,
        href: l("/messages"),
        icon: <MessagesIcon className="h-[22px] w-[22px]" />,
        match: (p) => p === "/messages" || p.startsWith("/messages/"),
        badge: unreadMessages,
      },
      {
        key: "work",
        label: f.work,
        href: l("/dashboard/work"),
        icon: <WorkIcon className="h-[22px] w-[22px]" />,
        match: (p) => p.startsWith("/dashboard/work"),
      },
      {
        key: "bids",
        label: f.bids,
        href: l("/dashboard/bids"),
        icon: <BidsIcon className="h-[22px] w-[22px]" />,
        match: (p) => p.startsWith("/dashboard/bids"),
      },
      {
        key: "profile",
        label: nav.profileTab,
        icon: (
          <UserAvatar
            name={userName}
            avatar={userAvatar}
            size="sm"
            isAdmin={isAdmin}
            className="!h-7 !w-7 !text-xs"
          />
        ),
        match: (p) => isProfileAreaPath(p, "freelancer"),
        action: "profile",
      },
    ];
  }, [dict.header.newProject, isAdmin, l, nav, role, unreadMessages, userAvatar, userName]);

  return (
    <>
      <nav
        aria-label={nav.bottomNavAria}
        className="fixed inset-x-0 bottom-0 z-50 rounded-t-[1.25rem] border-t border-zinc-200/70 bg-white/90 shadow-[0_-12px_40px_rgba(15,23,42,0.12)] backdrop-blur-xl lg:hidden"
        style={{
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        }}
      >
        <div className="mx-auto flex max-w-lg justify-center pt-1">
          <span className="h-1 w-10 rounded-full bg-zinc-200" />
        </div>
        <ul className="mx-auto grid max-w-lg grid-cols-5 px-1">
          {tabs.map((tab) => {
            const active =
              tab.match(path) || (tab.action === "profile" && profileOpen);

            const content = (
              <>
                {active && tab.action !== "profile" && !tab.primary ? (
                  <span className="absolute left-1/2 top-0 h-0.5 w-8 -translate-x-1/2 rounded-full bg-indigo-600" />
                ) : null}
                <span className="relative flex h-8 w-8 items-center justify-center">
                  <span
                    className={
                      tab.primary
                        ? `flex h-8 w-8 items-center justify-center rounded-full ${
                            active
                              ? "bg-indigo-700 text-white shadow-md shadow-indigo-500/30"
                              : "bg-indigo-600 text-white shadow-sm shadow-indigo-500/25"
                          }`
                        : active
                          ? tab.action === "profile"
                            ? "ring-2 ring-indigo-500 ring-offset-2 rounded-full"
                            : "text-indigo-600"
                          : "text-zinc-500"
                    }
                  >
                    {tab.icon}
                  </span>
                  {tab.badge && tab.badge > 0 ? (
                    <span className="absolute -right-1 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-indigo-600 px-1 text-[10px] font-semibold text-white">
                      {tab.badge > 9 ? "9+" : tab.badge}
                    </span>
                  ) : null}
                </span>
                <span
                  className={`mt-0.5 max-w-full truncate text-[10px] font-medium ${
                    active ? "text-indigo-600" : "text-zinc-500"
                  }`}
                >
                  {tab.label}
                </span>
              </>
            );

            if (tab.action === "profile") {
              return (
                <li key={tab.key} className="relative">
                  <button
                    type="button"
                    onClick={() => setProfileOpen(true)}
                    aria-expanded={profileOpen}
                    className="flex min-h-[3.5rem] w-full flex-col items-center justify-center rounded-xl px-1 py-1 transition-colors active:bg-zinc-100"
                  >
                    {content}
                  </button>
                </li>
              );
            }

            return (
              <li key={tab.key} className="relative">
                <Link
                  href={tab.href!}
                  onClick={() => setProfileOpen(false)}
                  className="flex min-h-[3.5rem] w-full flex-col items-center justify-center rounded-xl px-1 py-1 transition-colors active:bg-zinc-100"
                >
                  {content}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <CabinetProfileSheet
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        role={role}
        name={userName}
        avatar={userAvatar}
        isAdmin={isAdmin}
        unreadNotifications={unreadNotifications}
      />
    </>
  );
}
