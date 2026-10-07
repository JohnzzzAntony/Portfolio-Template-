import { requireSession } from "@/lib/auth";
import { notFound } from "next/navigation";

import { createRecord } from "@/app/admin/actions";
import { RecordForm } from "@/components/admin/RecordForm";
import { PageTitle } from "@/components/admin/ui";
import { defaultsFor } from "@/lib/admin/form";
import { RESOURCES, isResourceKey } from "@/lib/admin/resources";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ resource: string }> };

export default async function NewRecordPage({ params }: Params) {
  await requireSession();
  const { resource: key } = await params;
  if (!isResourceKey(key)) notFound();

  const resource = RESOURCES[key];
  const needsServices = resource.fields.some((f) => f.type === "services");
  const services = needsServices
    ? await prisma.service.findMany({ orderBy: { order: "asc" } })
    : [];

  const action = createRecord.bind(null, key);

  return (
    <>
      <PageTitle title={`New ${resource.singular.toLowerCase()}`} />
      <RecordForm
        fields={resource.fields}
        record={defaultsFor(resource.fields)}
        action={action}
        cancelHref={`/admin/${key}`}
        serviceOptions={services.map((s) => ({ id: s.id, label: s.title }))}
        selectedServices={[]}
      />
    </>
  );
}
