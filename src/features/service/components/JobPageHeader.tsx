import { PageHeader } from "@/components/layout/PageHeader";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import type { ServiceJob } from "@/features/service/types";

type JobPageHeaderProps = {
  job: ServiceJob;
  title: string;
  description?: string;
  action?: React.ReactNode;
};

/** Breadcrumb back to the booking, and the page title, for a booking's job card, estimate, report or bill. */
export function JobPageHeader({ job, title, description, action }: JobPageHeaderProps) {
  return (
    <>
      <Breadcrumb
        items={[
          { label: "My services", href: "/account/services" },
          { label: job.jobCardNumber, href: `/account/services/${job.id}` },
          { label: title },
        ]}
      />
      <PageHeader
        title={title}
        description={description ?? `${job.serviceType} · ${job.garage.name}`}
        action={action}
      />
    </>
  );
}
