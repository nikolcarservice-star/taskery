import { ClientHeader } from "@/components/ClientHeader";

import { ClientSidebar } from "@/components/ClientSidebar";

import { PageBackNav } from "@/components/PageBackNav";

import { requireClient } from "@/lib/session";



type ClientCabinetShellProps = {

  children: React.ReactNode;

  callbackUrl?: string;

};



export async function ClientCabinetShell({

  children,

  callbackUrl = "/client",

}: ClientCabinetShellProps) {

  const session = await requireClient(callbackUrl);

  const isAdmin = session.user.role === "ADMIN";



  return (

    <div className="cabinet-app-shell flex min-h-full flex-1 flex-col bg-zinc-100">

      <ClientHeader />



      <div className="cabinet-app-content mx-auto flex w-full max-w-7xl flex-1 gap-6 px-4 py-4 lg:px-6 lg:py-6">

        <ClientSidebar isAdmin={isAdmin} />

        <div className="min-w-0 flex-1">

          <PageBackNav className="mb-4 lg:mb-5" />

          {children}

        </div>

      </div>

    </div>

  );

}


