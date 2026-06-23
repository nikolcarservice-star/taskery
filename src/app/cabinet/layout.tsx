import { AdminCabinetShell } from "@/components/AdminCabinetShell";

type CabinetLayoutProps = {
  children: React.ReactNode;
};

export default function CabinetLayout({ children }: CabinetLayoutProps) {
  return <AdminCabinetShell>{children}</AdminCabinetShell>;
}
