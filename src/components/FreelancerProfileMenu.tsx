"use client";

import { useLocalizedPath } from "@/components/LocalizedLink";
import { UserAvatar, UserRoleLabel } from "@/components/UserAvatar";
import { useDictionary } from "@/lib/i18n/dictionary-context";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";

type FreelancerProfileMenuProps = {
  userId: string;
  name: string | null;
  avatar: string | null;
  showAdminPanel?: boolean;
};

type MenuLinkItem = {
  label: string;
  href: string;
};

function MenuDivider() {
  return <div className="my-1 border-t border-zinc-100" />;
}

function MenuLink({
  href,
  children,
  onNavigate,
}: {
  href: string;
  children: ReactNode;
  onNavigate: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className="block px-4 py-2.5 text-sm text-zinc-800 transition-colors hover:bg-zinc-50"
    >
      {children}
    </Link>
  );
}

export function FreelancerProfileMenu({
  name,
  avatar,
  showAdminPanel = false,
}: FreelancerProfileMenuProps) {
  const dict = useDictionary();
  const menu = dict.profileMenu;
  const l = useLocalizedPath();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const mainLinks = useMemo<MenuLinkItem[]>(
    () => [
      { label: menu.myCabinet, href: l("/dashboard") },
      { label: menu.portfolio, href: l("/dashboard/portfolio") },
      { label: menu.freelancerProfile, href: l("/dashboard/profile") },
    ],
    [l, menu.freelancerProfile, menu.myCabinet, menu.portfolio],
  );

  const updateLinks: MenuLinkItem[] = [{ label: menu.whatsNew, href: l("/faq") }];

  const settingsLinks: MenuLinkItem[] = [
    { label: menu.personal, href: l("/dashboard/personal") },
    { label: menu.settings, href: l("/dashboard/settings") },
  ];

  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative ml-1">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="rounded-full p-1 transition-opacity hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
        aria-label={menu.ariaLabel}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <UserAvatar
          name={name}
          avatar={avatar}
          isAdmin={showAdminPanel}
          adminTitle={showAdminPanel ? menu.defaultNames.admin : undefined}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+8px)] z-[60] w-64 overflow-hidden rounded-xl border border-zinc-200 bg-white py-2 shadow-lg"
        >
          <div className="flex items-center gap-3 px-4 py-3">
            <UserAvatar
              name={name}
              avatar={avatar}
              size="sm"
              isAdmin={showAdminPanel}
              adminTitle={showAdminPanel ? menu.defaultNames.admin : undefined}
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-zinc-900">
                {name ?? menu.defaultNames.freelancer}
              </p>
              <UserRoleLabel roleLabel={menu.roles.freelancer} isAdmin={showAdminPanel} />
            </div>
          </div>

          <MenuDivider />

          {mainLinks.map((item) => (
            <MenuLink key={item.href} href={item.href} onNavigate={close}>
              {item.label}
            </MenuLink>
          ))}

          <MenuDivider />

          {updateLinks.map((item) => (
            <MenuLink key={item.href} href={item.href} onNavigate={close}>
              {item.label}
            </MenuLink>
          ))}

          <MenuDivider />

          {settingsLinks.map((item) => (
            <MenuLink key={item.href} href={item.href} onNavigate={close}>
              {item.label}
            </MenuLink>
          ))}

          {showAdminPanel && (
            <>
              <MenuDivider />
              <MenuLink href="/cabinet" onNavigate={close}>
                {menu.adminCabinet}
              </MenuLink>
              <MenuLink href="/admin" onNavigate={close}>
                <span className="font-medium text-red-700">{menu.adminPanel}</span>
              </MenuLink>
            </>
          )}

          <MenuDivider />

          <Link
            href="/api/auth/signout"
            onClick={close}
            className="block px-4 py-2.5 text-sm text-zinc-800 transition-colors hover:bg-zinc-50"
          >
            {menu.logout}
          </Link>
        </div>
      )}
    </div>
  );
}
