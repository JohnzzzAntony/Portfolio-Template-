import { requireSession } from "@/lib/auth";
import { EmptyState, PageTitle } from "@/components/admin/ui";
import { prisma } from "@/lib/prisma";

import { deleteMedia } from "./actions";
import { UploadForm } from "./UploadForm";
import { CopyUrl } from "./CopyUrl";

export const metadata = { title: "Media" };

export default async function MediaPage() {
  await requireSession();
  const items = await prisma.media.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <>
      <PageTitle
        title="Media"
        description="Uploads are stored in object storage and served from /files. Copy a URL and paste it into any image field."
      />

      <UploadForm />

      <div className="mt-8">
        {items.length === 0 ? (
          <EmptyState message="No uploads yet." />
        ) : (
          <ul className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {items.map((item) => (
              <li
                key={item.id}
                className="overflow-hidden rounded-lg border border-neutral-200 bg-white"
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- local upload preview */}
                <img
                  src={item.url}
                  alt={item.alt}
                  className="aspect-square w-full bg-neutral-100 object-cover"
                />
                <div className="flex flex-col gap-2 p-3">
                  <span className="truncate text-xs text-neutral-600" title={item.filename}>
                    {item.filename}
                  </span>
                  <span className="text-[11px] text-neutral-400">
                    {Math.round(item.size / 1024)} KB
                  </span>
                  <div className="flex gap-2">
                    <CopyUrl url={item.url} />
                    <form action={deleteMedia.bind(null, item.id)}>
                      <button
                        type="submit"
                        className="inline-flex h-7 items-center rounded border border-red-300 px-2 text-xs text-red-700 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
