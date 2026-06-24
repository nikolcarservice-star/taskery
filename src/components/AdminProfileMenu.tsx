"use client";

import { UserAvatar, UserRoleLabel } from "@/components/UserAvatar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { chooseAdminWorkMode } from "@/lib/actions/admin-work-mode";
import type { AdminWorkMode } from "@/lib/admin-work-mode";

type AdminProfileMenuProps = {
  name: string | null;
  avatar: string | null;
};

type MenuLinkItem = {
  label: string;
  href: string;
  highlight?: boolean;
};

function MenuDivider() {
  return <div className="my-1 border-t border-zinc-100" />;
}

function ModeMenuLink({
  mode,
  href,
  children,
  onNavigate,
  highlight = false,
}: {
  mode: AdminWorkMode;
  href: string;
  children: ReactNode;
  onNavigate: () => void;
  highlight?: boolean;
}) {
  const router = useRouter();

  async function handleClick(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    onNavigate();
    await chooseAdminWorkMode(mode);
    router.push(href);
    router.refresh();
  }

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={`block px-4 py-2.5 text-sm transition-colors hover:bg-zinc-50 ${
        highlight ? "font-medium text-red-700" : "text-zinc-800"
      }`}
    >
      {children}
    </Link>
  );
}

function MenuLink({
  href,
  children,
  onNavigate,
  highlight = false,
}: {
  href: string;
  children: ReactNode;
  onNavigate: () => void;
  highlight?: boolean;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={`block px-4 py-2.5 text-sm transition-colors hover:bg-zinc-50 ${
        highlight ? "font-medium text-red-700" : "text-zinc-800"
      }`}
    >
      {children}
    </Link>
  );
}

export function AdminProfileMenu({ name, avatar }: AdminProfileMenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const mainLinks = useMemo(
    () =>
      [
        { label: "Мой кабинет", href: "/cabinet", mode: null },
        { label: "Как заказчик", href: "/client", mode: "client" as const },
        { label: "Как фрилансер", href: "/dashboard", mode: "freelancer" as const },
        { label: "Админ-панель", href: "/admin/mobile", mode: null, highlight: true },
      ] as const,
    [],
  );

  const settingsLinks: MenuLinkItem[] = [
    { label: "Личные данные", href: "/client/personal" },
    { label: "Настройки", href: "/client/settings" },
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
        className="rounded-full p-1 transition-opacity hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
        aria-label="Меню профиля"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <UserAvatar name={name} avatar={avatar} isAdmin />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+8px)] z-[60] w-64 overflow-hidden rounded-xl border border-zinc-200 bg-white py-2 shadow-lg"
        >
          <div className="flex items-center gap-3 px-4 py-3">
            <UserAvatar name={name} avatar={avatar} size="sm" isAdmin />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-zinc-900">
                {name ?? "Администратор"}
              </p>
              <UserRoleLabel roleLabel="главный администратор" isAdmin />
            </div>
          </div>

          <MenuDivider />

          {mainLinks.map((item) =>
            item.mode ? (
              <ModeMenuLink
                key={item.label}
                mode={item.mode}
                href={item.href}
                onNavigate={close}
                highlight={Boolean("highlight" in item && item.highlight)}
              >
                {item.label}
              </ModeMenuLink>
            ) : (
              <MenuLink
                key={item.label}
                href={item.href}
                onNavigate={close}
                highlight={Boolean("highlight" in item && item.highlight)}
              >
                {item.label}
              </MenuLink>
            ),
          )}

          <MenuDivider />

          {settingsLinks.map((item) => (
            <MenuLink key={item.label} href={item.href} onNavigate={close}>
              {item.label}
            </MenuLink>
          ))}

          <MenuDivider />

          <Link
            href="/api/auth/signout"
            onClick={close}
            className="block px-4 py-2.5 text-sm text-zinc-800 transition-colors hover:bg-zinc-50"
          >
            Выход
          </Link>
        </div>
      )}
    </div>
  );
}
