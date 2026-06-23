"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useLocalizedPath } from "@/components/LocalizedLink";
import { UserAvatar, UserRoleLabel } from "@/components/UserAvatar";
import { useDictionary } from "@/lib/i18n/dictionary-context";

type SheetLink = {
  label: string;
  href: string;
  icon: string;
  primary?: boolean;
  badge?: number;
};

type CabinetProfileSheetProps = {
  open: boolean;
  onClose: () => void;
  role: "client" | "freelancer";
  name: string | null;
  avatar: string | null;
  isAdmin?: boolean;
  unreadNotifications?: number;
};

export function CabinetProfileSheet({
  open,
  onClose,
  role,
  name,
  avatar,
  isAdmin = false,
  unreadNotifications = 0,
}: CabinetProfileSheetProps) {
  const l = useLocalizedPath();
  const dict = useDictionary();
  const nav = dict.cabinet;
  const menu = dict.profileMenu;
  const c = nav.client;
  const f = nav.freelancer;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const adminLinks: SheetLink[] = isAdmin
    ? [
        { label: nav.adminCabinet, href: l("/cabinet"), icon: "🛡️" },
        { label: nav.adminPanel, href: "/admin/mobile", icon: "⚙️" },
      ]
    : [];

  const clientLinks: SheetLink[] = [
    {
      label: dict.header.newProject,
      href: l("/client/projects/new"),
      icon: "✨",
      primary: true,
    },
    {
      label: dict.pages.notifications.title,
      href: l("/notifications"),
      icon: "🔔",
      badge: unreadNotifications,
    },
    { label: c.finances, href: l("/client/finances"), icon: "💰" },
    { label: c.reviews, href: l("/client/reviews"), icon: "⭐" },
    { label: dict.header.findFreelancer, href: l("/freelancers"), icon: "👥" },
    { label: c.personal, href: l("/client/personal"), icon: "🗄️" },
    { label: c.settings, href: l("/client/settings"), icon: "⚙️" },
    { label: nav.support, href: l("/support"), icon: "🎧" },
    { label: nav.whatsNew, href: l("/faq"), icon: "📣" },
  ];

  const freelancerLinks: SheetLink[] = [
    {
      label: dict.header.findProject,
      href: l("/projects"),
      icon: "🔍",
      primary: true,
    },
    {
      label: dict.pages.notifications.title,
      href: l("/notifications"),
      icon: "🔔",
      badge: unreadNotifications,
    },
    { label: f.finances, href: l("/dashboard/finances"), icon: "💰" },
    { label: f.portfolio, href: l("/dashboard/portfolio"), icon: "🎨" },
    { label: f.reviews, href: l("/dashboard/reviews"), icon: "⭐" },
    { label: f.personal, href: l("/dashboard/personal"), icon: "🗄️" },
    { label: f.freelancerProfile, href: l("/dashboard/profile"), icon: "💻" },
    { label: f.settings, href: l("/dashboard/settings"), icon: "⚙️" },
    { label: f.boost, href: l("/boost"), icon: "⚡" },
    { label: nav.support, href: l("/support"), icon: "🎧" },
    { label: nav.whatsNew, href: l("/faq"), icon: "📣" },
  ];

  const links = [
    ...adminLinks,
    ...(role === "client" ? clientLinks : freelancerLinks),
  ];

  const roleLabel = role === "client" ? menu.roles.client : menu.roles.freelancer;
  const defaultName =
    role === "client" ? menu.defaultNames.client : menu.defaultNames.freelancer;

  const sheet = (
    <div
      className={`fixed inset-0 z-[90] lg:hidden ${open ? "visible" : "invisible"}`}
      aria-hidden={!open}
    >
      <button
        type="button"
        aria-label={nav.menuCloseAria}
        tabIndex={open ? 0 : -1}
        onClick={onClose}
        className={`absolute inset-0 bg-zinc-900/40 transition-opacity duration-300 ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={menu.ariaLabel}
        className={`absolute inset-x-0 bottom-0 flex max-h-[min(85dvh,640px)] flex-col rounded-t-3xl border border-zinc-200/80 bg-white shadow-2xl transition-transform duration-300 ease-out ${
          open ? "translate-y-0" : "pointer-events-none translate-y-full"
        }`}
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        <div className="flex shrink-0 items-center justify-center py-3">
          <span className="h-1 w-10 rounded-full bg-zinc-200" />
        </div>

        <div className="flex items-center gap-3 border-b border-zinc-100 px-5 pb-4">
          <UserAvatar
            name={name}
            avatar={avatar}
            size="sm"
            isAdmin={isAdmin}
            adminTitle={isAdmin ? menu.defaultNames.admin : undefined}
          />
          <div className="min-w-0">
            <p className="truncate text-base font-semibold text-zinc-900">
              {name ?? defaultName}
            </p>
            <UserRoleLabel roleLabel={roleLabel} isAdmin={isAdmin} />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-3">
          <nav className="grid gap-1">
            {links.map((link) => (
              <Link
                key={link.href + link.label}
                href={link.href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3.5 text-[15px] font-medium transition-colors ${
                  link.primary
                    ? "bg-indigo-600 text-white hover:bg-indigo-700"
                    : "text-zinc-800 hover:bg-zinc-50"
                }`}
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center text-base leading-none">
                  {link.icon}
                </span>
                <span className="flex-1">{link.label}</span>
                {link.badge && link.badge > 0 ? (
                  <span className="rounded-full bg-indigo-600 px-2 py-0.5 text-xs font-semibold text-white">
                    {link.badge > 9 ? "9+" : link.badge}
                  </span>
                ) : null}
              </Link>
            ))}
          </nav>

          <div className="mt-3 border-t border-zinc-100 pt-3">
            <Link
              href="/api/auth/signout"
              onClick={onClose}
              className="flex items-center gap-3 rounded-2xl px-4 py-3.5 text-[15px] font-medium text-red-600 transition-colors hover:bg-red-50"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center text-base leading-none">
                ↩
              </span>
              {menu.logout}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  if (!mounted) {
    return null;
  }

  return createPortal(sheet, document.body);
}
