import { requireSession } from "@/lib/auth";
import Link from "next/link";

import { Card, EmptyState, PageTitle } from "@/components/admin/ui";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Pages & sections" };

export default async function PagesIndex() {
  await requireSession();
  const pages = await prisma.page.findMany({
    orderBy: { key: "asc" },
    include: { _count: { select: { sections: true } } },
  });

  return (
    <>
      <PageTitle
        title="Pages & sections"
        description="Hero copy and every section block on the public pages."
      />

      {pages.length === 0 ? (
        <EmptyState message="No pages yet — run the seed to create them." />
      ) : (
        <Card>
          <ul className="divide-y divide-neutral-200">
            {pages.map((page) => (
              <li key={page.id} className="flex items-center gap-4 p-4">
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/admin/pages/${page.key}`}
                    className="font-medium hover:underline"
                  >
                    {page.name}
                  </Link>
                  <span className="block text-sm text-neutral-500">
                    /{page.key === "home" ? "" : page.key} · {page._count.sections}{" "}
                    section{page._count.sections === 1 ? "" : "s"}
                  </span>
                </div>
                <Link
                  href={`/admin/pages/${page.key}`}
                  className="inline-flex h-9 items-center rounded-md border border-neutral-300 bg-white px-3 text-sm"
                >
                  Edit
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </>
  );
}
