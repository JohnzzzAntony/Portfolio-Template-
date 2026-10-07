import { requireSession } from "@/lib/auth";
import Link from "next/link";
import { notFound } from "next/navigation";

import { moveRecord } from "@/app/admin/actions";
import { AdminButton, Card, EmptyState, PageTitle } from "@/components/admin/ui";
import { RESOURCES, isResourceKey } from "@/lib/admin/resources";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ resource: string }> };

export async function generateMetadata({ params }: Params) {
  const { resource } = await params;
  if (!isResourceKey(resource)) return {};
  return { title: RESOURCES[resource].label };
}

export default async function ResourceListPage({ params }: Params) {
  await requireSession();
  const { resource: key } = await params;
  if (!isResourceKey(key)) notFound();

  const resource = RESOURCES[key];
  const delegate = (prisma as unknown as Record<string, { findMany: (a: unknown) => Promise<Record<string, unknown>[]> }>)[
    resource.delegate
  ];
  const rows = await delegate.findMany({ orderBy: resource.orderBy });

  return (
    <>
      <PageTitle
        title={resource.label}
        description={`${rows.length} ${rows.length === 1 ? "entry" : "entries"}`}
        action={
          <AdminButton href={`/admin/${key}/new`}>
            New {resource.singular.toLowerCase()}
          </AdminButton>
        }
      />

      {rows.length === 0 ? (
        <EmptyState message={`No ${resource.label.toLowerCase()} yet.`} />
      ) : (
        <Card>
          <ul className="divide-y divide-neutral-200">
            {rows.map((row, i) => {
              const id = String(row.id);
              return (
                <li key={id} className="flex items-center gap-4 p-4">
                  <Thumb row={row} />

                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/admin/${key}/${id}`}
                      className="block truncate font-medium hover:underline"
                    >
                      {String(row[resource.titleField] ?? "Untitled")}
                    </Link>
                    {resource.subtitleField && (
                      <span className="block truncate text-sm text-neutral-500">
                        {String(row[resource.subtitleField] ?? "")}
                      </span>
                    )}
                  </div>

                  <Status row={row} />

                  {resource.sortable && (
                    <div className="flex gap-1">
                      <Move resourceKey={key} id={id} direction="up" disabled={i === 0} />
                      <Move
                        resourceKey={key}
                        id={id}
                        direction="down"
                        disabled={i === rows.length - 1}
                      />
                    </div>
                  )}

                  <AdminButton href={`/admin/${key}/${id}`} variant="ghost">
                    Edit
                  </AdminButton>
                </li>
              );
            })}
          </ul>
        </Card>
      )}
    </>
  );
}

function Thumb({ row }: { row: Record<string, unknown> }) {
  const url =
    (row.previewImage as string) ||
    (row.coverImage as string) ||
    (row.image as string) ||
    (row.photo as string) ||
    (row.url as string) ||
    "";

  if (!url || !/^(https?:|\/)/.test(url)) return null;

  return (
    // eslint-disable-next-line @next/next/no-img-element -- CMS-supplied, may be remote
    <img
      src={url}
      alt=""
      className="size-12 shrink-0 rounded object-cover"
    />
  );
}

function Status({ row }: { row: Record<string, unknown> }) {
  if (!("published" in row) && !("visible" in row)) return null;
  const live = Boolean(row.published ?? row.visible);

  return (
    <span
      className={
        live
          ? "rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800"
          : "rounded-full bg-neutral-200 px-2 py-0.5 text-xs text-neutral-700"
      }
    >
      {live ? "Live" : "Hidden"}
    </span>
  );
}

function Move({
  resourceKey,
  id,
  direction,
  disabled,
}: {
  resourceKey: string;
  id: string;
  direction: "up" | "down";
  disabled: boolean;
}) {
  const move = moveRecord.bind(null, resourceKey, id, direction);

  return (
    <form action={move}>
      <button
        type="submit"
        disabled={disabled}
        aria-label={`Move ${direction}`}
        className="grid size-8 place-items-center rounded border border-neutral-300 bg-white text-xs disabled:opacity-30"
      >
        {direction === "up" ? "↑" : "↓"}
      </button>
    </form>
  );
}
