import { NotificationsList } from "@/components/NotificationsList";
import { PageBackNav } from "@/components/PageBackNav";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getAdminWorkMode } from "@/lib/admin-work-mode";
import { getDictionary } from "@/lib/i18n/dictionary";
import { requireAppLocale } from "@/lib/i18n/locale-page";
import { localizedPath } from "@/lib/i18n/routing";
import { createMetadata } from "@/lib/metadata";
import {
  getUnreadNotificationCount,
  getUserNotifications,
} from "@/lib/notifications";
import { requireAuth } from "@/lib/session";

type NotificationsPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: NotificationsPageProps) {
  const locale = await requireAppLocale(params);
  const dict = await getDictionary(locale);
  const p = dict.pages.notifications;

  return createMetadata({
    title: p.title,
    description: p.introFreelancer,
    path: "/notifications",
    locale,
    noIndex: true,
  });
}

export default async function NotificationsPage({ params }: NotificationsPageProps) {
  const locale = await requireAppLocale(params);
  const dict = await getDictionary(locale);
  const session = await requireAuth(localizedPath(locale, "/notifications"));
  const userId = session.user.id;
  const isClient = session.user.role === "CLIENT";
  const isFreelancer = session.user.role === "FREELANCER";
  const isAdmin = session.user.role === "ADMIN";
  const adminWorkMode = isAdmin ? await getAdminWorkMode() : null;
  const inCabinet = isClient || isFreelancer || isAdmin;
  const clientView = isClient || adminWorkMode === "client";
  const p = dict.pages.notifications;

  if (!inCabinet) {
    return null;
  }

  const [notifications, unreadCount] = await Promise.all([
    getUserNotifications(userId),
    getUnreadNotificationCount(userId),
  ]);

  const content = (
    <>
      <h1 className="text-2xl font-bold text-zinc-900">{p.title}</h1>
      <p className="mt-2 text-sm text-zinc-600">
        {clientView ? p.introClient : p.introFreelancer}
      </p>

      <NotificationsList
        notifications={notifications}
        unreadCount={unreadCount}
        variant={clientView ? "client" : "freelancer"}
      />
    </>
  );

  if (inCabinet) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
        {content}
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-1 flex-col bg-zinc-50">
      <SiteHeader locale={locale} dict={dict} />

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-8">
        <PageBackNav />
        {content}
      </main>

      <SiteFooter locale={locale} dict={dict} />
    </div>
  );
}
