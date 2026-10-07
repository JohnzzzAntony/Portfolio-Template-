import { requireSession } from "@/lib/auth";
import { notFound } from "next/navigation";

import { deleteRecord, updateRecord } from "@/app/admin/actions";
import { RecordForm } from "@/components/admin/RecordForm";
import { PageTitle } from "@/components/admin/ui";
import { deserializeRecord } from "@/lib/admin/form";
import { RESOURCES, isResourceKey } from "@/lib/admin/resources";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ resource: string; id: string }> };

export default async function EditRecordPage({ params }: Params) {
  await requireSession();
  const { resource: key, id } = await params;
  if (!isResourceKey(key)) notFound();

  const resource = RESOURCES[key];
  const needsServices = resource.fields.some((f) => f.type === "services");

  const delegate = (
    prisma as unknown as Record<
      string,
      {
        findUnique: (a: {
          where: { id: string };
          include?: Record<string, boolean>;
        }) => Promise<Record<string, unknown> | null>;
      }
    >
  )[resource.delegate];

  const record = await delegate.findUnique({
    where: { id },
    include: needsServices ? { services: true } : undefined,
  });
  if (!record) notFound();

  const services = needsServices
    ? await prisma.service.findMany({ orderBy: { order: "asc" } })
    : [];

  const selected = ((record.services as { id: string }[] | undefined) ?? []).map(
    (s) => s.id,
  );

  const action = updateRecord.bind(null, key, id);
  const remove = deleteRecord.bind(null, key, id);

  return (
    <>
      <PageTitle
        title={String(record[resource.titleField] ?? resource.singular)}
        description={`Editing a ${resource.singular.toLowerCase()}`}
      />
      <RecordForm
        fields={resource.fields}
        record={deserializeRecord(resource, record)}
        action={action}
        cancelHref={`/admin/${key}`}
        serviceOptions={services.map((s) => ({ id: s.id, label: s.title }))}
        selectedServices={selected}
        onDelete={
          <form action={remove}>
            <button
              type="submit"
              className="inline-flex h-9 items-center rounded-md border border-red-300 px-3 text-sm text-red-700 hover:bg-red-50"
            >
              Delete
            </button>
          </form>
        }
      />
    </>
  );
}
