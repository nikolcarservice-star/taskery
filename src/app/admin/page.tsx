import { AdminHeader } from "@/components/AdminHeader";

import { AdminLoginView } from "@/components/AdminLoginView";

import { AdminPanel } from "@/components/AdminPanel";

import { PageBackNav } from "@/components/PageBackNav";

import { SiteFooter } from "@/components/SiteFooter";

import { auth } from "@/lib/auth";

import { prisma } from "@/lib/prisma";

import { getHomeRouteForRole } from "@/lib/role-redirect";

import { redirect } from "next/navigation";



export const metadata = {

  title: "Админ — Taskery",

  robots: { index: false, follow: false },

};



export default async function AdminPage() {

  const session = await auth();



  if (!session?.user?.email) {

    return <AdminLoginView />;

  }



  if (session.user.role !== "ADMIN") {

    redirect(getHomeRouteForRole(session.user.role));

  }



  const currentAdmin = await prisma.user.findUnique({

    where: { id: session.user.id },

    select: {

      id: true,

      adminPermissions: true,

      adminActive: true,

    },

  });



  if (!currentAdmin?.adminActive) {

    redirect("/admin?error=deactivated");

  }



  const [

    disputes,

    openProjects,

    userCount,

    projectCount,

    freelancerCount,

    clientCount,

    admins,

  ] = await Promise.all([

    prisma.project.findMany({

      where: { status: "UNDER_DISPUTE" },

      include: {

        client: { select: { name: true, email: true } },

        contract: {

          include: {

            freelancer: { select: { name: true, email: true } },

          },

        },

      },

      orderBy: { updatedAt: "desc" },

    }),

    prisma.project.findMany({

      where: { status: "OPEN" },

      select: {

        id: true,

        slug: true,

        title: true,

        client: { select: { name: true } },

      },

      orderBy: { createdAt: "desc" },

      take: 20,

    }),

    prisma.user.count(),

    prisma.project.count(),

    prisma.user.count({ where: { role: "FREELANCER" } }),

    prisma.user.count({ where: { role: "CLIENT" } }),

    prisma.user.findMany({

      where: { role: "ADMIN" },

      select: {

        id: true,

        name: true,

        email: true,

        adminPermissions: true,

        adminActive: true,

        createdAt: true,

      },

      orderBy: { createdAt: "asc" },

    }),

  ]);



  return (

    <div className="flex min-h-full flex-1 flex-col bg-zinc-50">

      <AdminHeader />



      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">

        <PageBackNav />

        <h1 className="text-3xl font-bold text-zinc-900">Админ-панель</h1>

        <p className="mt-2 text-sm text-zinc-600">

          Модерация проектов, разрешение споров и управление командой.

        </p>



        <div className="mt-8">

          <AdminPanel

            disputes={disputes}

            openProjects={openProjects}

            stats={{

              users: userCount,

              projects: projectCount,

              freelancers: freelancerCount,

              clients: clientCount,

            }}

            permissions={currentAdmin.adminPermissions}

            currentAdminId={currentAdmin.id}

            admins={admins.map((admin) => ({

              ...admin,

              createdAt: admin.createdAt.toISOString(),

            }))}

          />

        </div>

      </main>



      <SiteFooter />

    </div>

  );

}


