import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getServiceJob } from "@/features/service/api";
import { DecidedEstimate } from "@/features/service/components/DecidedEstimate";
import { EstimateDecisionForm } from "@/features/service/components/EstimateDecisionForm";
import { JobPageHeader } from "@/features/service/components/JobPageHeader";
import { getPendingEstimate } from "@/features/service/utils";

export const metadata: Metadata = { title: "Estimate", robots: { index: false } };

/** The open estimate to answer first, then the ones already answered, newest first. */
export default async function EstimatePage({
  params,
}: PageProps<"/account/services/[id]/estimate">) {
  const job = await getServiceJob((await params).id);
  if (!job || job.estimates.length === 0) notFound();
  const pending = getPendingEstimate(job);
  const decided = job.estimates.filter((estimate) => estimate !== pending).reverse();

  return (
    <div className="grid grid-cols-1 gap-6">
      <JobPageHeader
        job={job}
        title={pending ? "Approve the estimate" : "Estimates"}
        description={
          pending
            ? "Approve each item you want done. No chat: call the garage if you have a question."
            : undefined
        }
      />
      {pending && <EstimateDecisionForm jobId={job.id} estimate={pending} />}
      {decided.map((estimate) => (
        <DecidedEstimate key={estimate.id} estimate={estimate} />
      ))}
    </div>
  );
}
