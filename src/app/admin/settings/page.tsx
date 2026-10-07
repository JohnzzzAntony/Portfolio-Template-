import { requireSession } from "@/lib/auth";
import { PageTitle } from "@/components/admin/ui";
import { getSettings } from "@/lib/cms";

import { SettingsForm } from "./SettingsForm";

export const metadata = { title: "Site settings" };

export default async function SettingsPage() {
  await requireSession();
  const settings = await getSettings();

  return (
    <>
      <PageTitle
        title="Site settings"
        description="Global values used by the header, footer and metadata on every page."
      />
      <SettingsForm settings={settings as unknown as Record<string, unknown>} />
    </>
  );
}
