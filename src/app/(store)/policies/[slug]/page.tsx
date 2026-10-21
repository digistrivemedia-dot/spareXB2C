import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { TabLinks } from "@/components/ui/TabLinks";
import { getPolicies, getPolicy } from "@/features/content/api";
import { PolicyArticle } from "@/features/content/components/PolicyArticle";

export async function generateStaticParams() {
  return (await getPolicies()).map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/policies/[slug]">): Promise<Metadata> {
  const policy = await getPolicy((await params).slug);
  return policy
    ? { title: policy.title, description: policy.summary }
    : { title: "Page not found" };
}

export default async function PolicyPage({ params }: PageProps<"/policies/[slug]">) {
  const [policy, policies] = await Promise.all([getPolicy((await params).slug), getPolicies()]);
  if (!policy) notFound();

  return (
    <Container className="grid grid-cols-1 gap-6 py-6 lg:py-8">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Help centre", href: "/help" },
          { label: policy.title },
        ]}
      />
      <PageHeader title={policy.title} />
      <TabLinks
        label="Policies"
        tabs={policies.map(({ slug, title }) => ({
          href: `/policies/${slug}`,
          label: title,
          isActive: slug === policy.slug,
        }))}
      />
      <PolicyArticle policy={policy} />
    </Container>
  );
}
