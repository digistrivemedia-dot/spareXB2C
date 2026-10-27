import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/PageHeader";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { getFaqTopics, getPolicies } from "@/features/content/api";
import { HelpCentre } from "@/features/content/components/HelpCentre";

export const metadata: Metadata = { title: "Help" };

export default async function AccountHelpPage() {
  const [topics, policies] = await Promise.all([getFaqTopics(), getPolicies()]);

  return (
    <div className="grid grid-cols-1 gap-6">
      <Breadcrumb
        items={[{ label: "My account", href: "/account/settings" }, { label: "Help and FAQ" }]}
      />
      <PageHeader title="Help" description="Quick answers to common questions." />
      <HelpCentre topics={topics} policies={policies} />
    </div>
  );
}
