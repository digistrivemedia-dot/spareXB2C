import type { Metadata } from "next";
import { connection } from "next/server";

import { PageHeader } from "@/components/layout/PageHeader";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { getDeviceSessions } from "@/features/account/api";
import { DeviceList } from "@/features/account/components/DeviceList";

export const metadata: Metadata = { title: "Logged-in devices" };

export default async function DevicesPage() {
  // "Active now" is worked out per request, so this page is never prerendered.
  await connection();
  const sessions = await getDeviceSessions();

  return (
    <div className="grid grid-cols-1 gap-6">
      <Breadcrumb
        items={[{ label: "My account", href: "/account/settings" }, { label: "Logged-in devices" }]}
      />
      <PageHeader
        title="Logged-in devices"
        description="If you see a device you don't recognise, log it out."
      />
      <DeviceList sessions={sessions} />
    </div>
  );
}
