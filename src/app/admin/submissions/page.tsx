import { requireSession } from "@/lib/auth";
import { Card, EmptyState, PageTitle } from "@/components/admin/ui";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

import { deleteSubmission, toggleRead } from "./actions";

export const metadata = { title: "Submissions" };

export default async function SubmissionsPage() {
  await requireSession();
  const items = await prisma.contactSubmission.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <PageTitle
        title="Submissions"
        description="Messages sent through the contact form."
      />

      {items.length === 0 ? (
        <EmptyState message="No submissions yet." />
      ) : (
        <Card>
          <ul className="divide-y divide-neutral-200">
            {items.map((item) => (
              <li
                key={item.id}
                className={item.read ? "p-5" : "bg-amber-50/60 p-5"}
              >
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="font-medium">{item.name}</span>
                  <a
                    href={`mailto:${item.email}`}
                    className="text-sm text-neutral-600 hover:underline"
                  >
                    {item.email}
                  </a>
                  <time className="ml-auto text-xs text-neutral-500">
                    {formatDate(item.createdAt)}
                  </time>
                </div>

                <p className="mt-2 whitespace-pre-wrap text-sm text-neutral-700">
                  {item.message}
                </p>

                <div className="mt-3 flex gap-2">
                  <form action={toggleRead.bind(null, item.id, !item.read)}>
                    <button
                      type="submit"
                      className="inline-flex h-8 items-center rounded-md border border-neutral-300 bg-white px-3 text-xs"
                    >
                      Mark as {item.read ? "unread" : "read"}
                    </button>
                  </form>

                  <form action={deleteSubmission.bind(null, item.id)}>
                    <button
                      type="submit"
                      className="inline-flex h-8 items-center rounded-md border border-red-300 px-3 text-xs text-red-700 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </>
  );
}
