import { requireSession } from "@/lib/auth";
import { notFound } from "next/navigation";

import { PageTitle } from "@/components/admin/ui";
import { prisma } from "@/lib/prisma";

import { PageEditor } from "./PageEditor";

type Params = { params: Promise<{ key: string }> };

export async function generateMetadata({ params }: Params) {
  const { key } = await params;
  const page = await prisma.page.findUnique({ where: { key } });
  return { title: page?.name ?? "Page" };
}

export default async function EditPagePage({ params }: Params) {
  await requireSession();
  const { key } = await params;

  const page = await prisma.page.findUnique({
    where: { key },
    include: { sections: { orderBy: { order: "asc" } } },
  });
  if (!page) notFound();

  return (
    <>
      <PageTitle
        title={page.name}
        description={`Editing /${page.key === "home" ? "" : page.key}`}
      />
      <PageEditor page={page} />
    </>
  );
}
