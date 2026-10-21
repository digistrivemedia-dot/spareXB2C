import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { PageHeader } from "@/components/layout/PageHeader";
import { ProfileForm } from "@/features/account/components/ProfileForm";
import { getSession } from "@/features/auth/session";

export const metadata: Metadata = { title: "Your profile" };

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) redirect("/login?next=/account/profile");

  return (
    <div className="grid grid-cols-1 gap-6">
      <PageHeader title="Your profile" description="How we address you, and where invoices go." />
      <ProfileForm user={session.user} />
    </div>
  );
}
