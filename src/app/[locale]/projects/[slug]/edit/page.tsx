import { redirect } from "next/navigation";

type EditRedirectProps = {
  params: Promise<{ slug: string }>;
};

export default async function LegacyEditProjectPage({ params }: EditRedirectProps) {
  const { slug } = await params;
  redirect(`/client/projects/${slug}/edit`);
}
