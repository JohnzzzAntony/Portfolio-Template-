import { requireSession } from "@/lib/auth";
import Link from "next/link";

import { Card, PageTitle } from "@/components/admin/ui";
import { getSession } from "@/lib/auth";
import { RESOURCES } from "@/lib/admin/resources";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Dashboard" };

export default async function AdminDashboard() {
  await requireSession();
  const session = await getSession();

  const [projects, posts, services, unread, recent] = await Promise.all([
    prisma.project.count(),
    prisma.post.count(),
    prisma.service.count(),
    prisma.contactSubmission.count({ where: { read: false } }),
    prisma.contactSubmission.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  return (
    <>
      <PageTitle
        title={`Welcome back, ${session?.name ?? "there"}`}
        description="Everything on the public site is editable from here."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Projects" value={projects} href="/admin/projects" />
        <Stat label="Blog posts" value={posts} href="/admin/posts" />
        <Stat label="Services" value={services} href="/admin/services" />
        <Stat label="Unread messages" value={unread} href="/admin/submissions" />
      </div>

      <h2 className="mb-3 mt-10 text-lg font-semibold">Recent enquiries</h2>
      <Card>
        {recent.length === 0 ? (
          <p className="p-6 text-sm text-neutral-500">No submissions yet.</p>
        ) : (
          <ul className="divide-y divide-neutral-200">
            {recent.map((item) => (
              <li key={item.id} className="flex items-center gap-4 p-4">
                <div className="min-w-0 flex-1">
                  <Link href="/admin/submissions" className="font-medium hover:underline">
                    {item.name}
                  </Link>
                  <p className="truncate text-sm text-neutral-500">{item.message}</p>
                </div>
                {!item.read && (
                  <span className="rounded-full bg-ink px-2 py-0.5 text-xs text-paper">
                    New
                  </span>
                )}
                <time className="text-xs text-neutral-500">
                  {formatDate(item.createdAt)}
                </time>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <h2 className="mb-3 mt-10 text-lg font-semibold">Collections</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Object.entries(RESOURCES).map(([key, resource]) => (
          <Link
            key={key}
            href={`/admin/${key}`}
            className="rounded-lg border border-neutral-200 bg-white p-4 text-sm font-medium transition-colors hover:border-ink"
          >
            {resource.label}
          </Link>
        ))}
      </div>
    </>
  );
}

function Stat({
  label,
  value,
  href,
}: {
  label: string;
  value: number;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-ink"
    >
      <span className="block text-3xl font-semibold tabular-nums">{value}</span>
      <span className="mt-1 block text-sm text-neutral-500">{label}</span>
    </Link>
  );
}
