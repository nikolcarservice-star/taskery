import type { Role } from "@/generated/prisma/client";
import { defaultLocale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/types";
import {
  getLocaleFromPathname,
  localizedPath,
  stripLocalePrefix,
} from "@/lib/i18n/routing";
import { getHomeRouteForRole } from "@/lib/role-redirect";

export type BackTarget = {
  href: string;
  label: string;
};

export type BackNavLabels = Dictionary["backNav"];

function homeLabel(labels: BackNavLabels, role?: Role | null) {
  switch (role) {
    case "FREELANCER":
    case "CLIENT":
    case "ADMIN":
      return labels.cabinet;
    default:
      return labels.back;
  }
}

export function getBackTarget(
  pathname: string,
  role?: Role | null,
  labels?: BackNavLabels,
): BackTarget | null {
  const l = labels ?? {
    cabinet: "Кабинет",
    back: "Назад",
    myProjects: "Мои проекты",
    messages: "Переписки",
    personalData: "Личные данные",
    profile: "Личный кабинет",
    toProject: "К проекту",
    jobSearch: "Поиск работы",
    freelancerCatalog: "Каталог исполнителей",
  };

  const locale = getLocaleFromPathname(pathname) ?? defaultLocale;
  const path = stripLocalePrefix(pathname);
  const link = (target: string) => localizedPath(locale, target);
  const home = getHomeRouteForRole(role, locale);
  const homeBackLabel = homeLabel(l, role);

  if (path === stripLocalePrefix(home)) {
    return null;
  }

  if (path === "/admin") {
    return { href: "/cabinet", label: l.cabinet };
  }

  if (path.startsWith("/dashboard/")) {
    return { href: link("/dashboard"), label: l.cabinet };
  }

  if (path.startsWith("/client/")) {
    if (/^\/client\/projects\/[^/]+\/edit$/.test(path)) {
      return { href: link("/client/projects"), label: l.myProjects };
    }
    return { href: link("/client"), label: l.cabinet };
  }

  if (path === "/profile/reviews") {
    return {
      href: link(role === "CLIENT" ? "/client" : "/profile"),
      label: l.cabinet,
    };
  }

  if (path.startsWith("/messages/")) {
    return { href: link("/messages"), label: l.messages };
  }

  if (path === "/messages") {
    return { href: home, label: homeBackLabel };
  }

  if (path === "/profile/edit") {
    return {
      href: link(role === "CLIENT" ? "/client/personal" : "/profile"),
      label: role === "CLIENT" ? l.personalData : l.profile,
    };
  }

  if (path === "/profile") {
    return { href: home, label: homeBackLabel };
  }

  if (path === "/notifications") {
    return { href: home, label: homeBackLabel };
  }

  if (path === "/projects") {
    return { href: home, label: homeBackLabel };
  }

  const projectEditMatch = path.match(/^\/projects\/([^/]+)\/edit$/);
  if (projectEditMatch) {
    return {
      href: link(`/projects/${projectEditMatch[1]}`),
      label: l.toProject,
    };
  }

  const projectMatch = path.match(/^\/projects\/([^/]+)$/);
  if (projectMatch) {
    return {
      href: link(role === "CLIENT" ? "/client/projects" : "/projects"),
      label: role === "CLIENT" ? l.myProjects : l.jobSearch,
    };
  }

  if (
    path === "/contact" ||
    path === "/faq" ||
    path === "/pricing" ||
    path === "/boost" ||
    path === "/about"
  ) {
    return { href: home, label: homeBackLabel };
  }

  if (/^\/freelancers\/[^/]+$/.test(path)) {
    if (role === "CLIENT") {
      return { href: link("/freelancers"), label: l.freelancerCatalog };
    }
    return { href: home, label: homeBackLabel };
  }

  return null;
}
