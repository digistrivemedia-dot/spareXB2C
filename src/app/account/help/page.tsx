import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/PageHeader";
import { getFaqTopics, getPolicies } from "@/features/content/api";
import { HelpCentre } from "@/features/content/components/HelpCentre";

export const metadata: Metadata = { title: "Help" };

export default async function AccountHelpPage() {
  const [topics, policies] = await Promise.all([getFaqTopics(), getPolicies()]);

  return (
    <div className="grid grid-cols-1 gap-6">
      <PageHeader title="Help" description="Quick answers to common questions." />
      <HelpCentre topics={topics} policies={policies} />
    </div>
  );
}
