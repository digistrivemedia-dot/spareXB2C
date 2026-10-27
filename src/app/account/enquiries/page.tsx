import { MessageSquareText, Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/layout/PageHeader";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/EmptyState";
import { getEnquiries } from "@/features/enquiries/api";
import { EnquiryCard } from "@/features/enquiries/components/EnquiryCard";

export const metadata: Metadata = { title: "My enquiries" };

export default async function EnquiriesPage() {
  const enquiries = await getEnquiries();

  return (
    <div className="grid grid-cols-1 gap-6">
      <Breadcrumb
        items={[{ label: "My account", href: "/account/settings" }, { label: "My enquiries" }]}
      />
      <PageHeader
        title="My enquiries"
        description="Can't find your vehicle or a part? Ask our parts team, and the reply shows here."
        action={
          enquiries.length > 0 && (
            <Button asChild>
              <Link href="/account/enquiries/new">
                <Plus aria-hidden />
                New enquiry
              </Link>
            </Button>
          )
        }
      />
      {enquiries.length > 0 ? (
        <ul className="grid gap-4">
          {enquiries.map((enquiry) => (
            <li key={enquiry.id}>
              <EnquiryCard enquiry={enquiry} />
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          icon={MessageSquareText}
          title="No enquiries yet"
          description="If your vehicle isn't in our list or no part fits, tell us and we'll help you find it."
        >
          <Button asChild>
            <Link href="/account/enquiries/new">Send an enquiry</Link>
          </Button>
        </EmptyState>
      )}
    </div>
  );
}
