import { redirect } from "next/navigation";

export default function LegacyMyProjectsPage() {
  redirect("/client/projects");
}
