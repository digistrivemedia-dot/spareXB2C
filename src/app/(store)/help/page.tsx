import type { Metadata } from "next";

import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { getFaqTopics, getPolicies } from "@/features/content/api";
import { HelpCentre } from "@/features/content/components/HelpCentre";

export const metadata: Metadata = {
  title: "Help centre",
  description:
    "Answers about orders, returns, fit, service bookings and payments, and how to reach us.",
};

export default async function HelpPage() {
  const [topics, policies] = await Promise.all([getFaqTopics(), getPolicies()]);

  return (
    <Container className="grid grid-cols-1 gap-6 py-6 lg:py-8">
      <PageHeader title="Help centre" description="Quick answers to common questions." />
      <HelpCentre topics={topics} policies={policies} />
    </Container>
  );
}
