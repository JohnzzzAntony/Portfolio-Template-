import Link from "next/link";
import { redirect } from "next/navigation";

import { getSession } from "@/lib/auth";
import { RESOURCES } from "@/lib/admin/resources";
import { prisma } from "@/lib/prisma";

import { logout } from "./login/actions";

export const metadata = { robots: { index: false, follow: false }, title: { default: "Admin", template: "%s — Admin" } };

const SINGLES = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/settings", label: "Site settings" },
  { href: "/admin/pages", label: "Pages & sections" },
  { href: "/admin/media", label: "Media" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // The login page renders inside this layout too; it has no session yet.
  if (!session) return <>{children}</>;
  if (session.role !== "ADMIN") redirect("/dashboard");

  const unread = await prisma.contactSubmission.count({ where: { read: false } });

  return (
    <div className="grid min-h-svh grid-cols-1 bg-[#f6f6f6] text-ink lg:grid-cols-[260px_1fr]">
      <aside className="flex flex-col gap-6 bg-ink p-6 text-paper">
        <div>
          <Link href="/admin" className="text-lg font-semibold tracking-tight">
            Studio admin
          </Link>
          <p className="mt-1 text-xs opacity-60">{session.email}</p>
        </div>

        <nav className="flex flex-col gap-6 text-sm" aria-label="Admin">
          <Group title="Site">
            {SINGLES.map((item) => (
              <Item key={item.href} href={item.href}>
                {item.label}
              </Item>
            ))}
            <Item href="/admin/submissions">
              Submissions
              {unread > 0 && (
                <span className="ml-2 rounded-full bg-paper px-1.5 text-[11px] text-ink">
                  {unread}
                </span>
              )}
            </Item>
          </Group>

          <Group title="Collections">
            {Object.entries(RESOURCES).map(([key, resource]) => (
              <Item key={key} href={`/admin/${key}`}>
                {resource.label}
              </Item>
            ))}
          </Group>
        </nav>

        <div className="mt-auto flex flex-col gap-2 text-sm">
          <Link
            href="/"
            target="_blank"
            className="opacity-70 transition-opacity hover:opacity-100"
          >
            View site ↗
          </Link>
          <form action={logout}>
            <button type="submit" className="opacity-70 transition-opacity hover:opacity-100">
              Sign out
            </button>
          </form>
        </div>
      </aside>

      <div className="min-w-0 p-6 lg:p-10">{children}</div>
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="mb-1 text-[11px] uppercase tracking-wider opacity-50">
        {title}
      </span>
      {children}
    </div>
  );
}

function Item({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="rounded px-2 py-1.5 opacity-80 transition-colors hover:bg-white/10 hover:opacity-100"
    >
      {children}
    </Link>
  );
}
