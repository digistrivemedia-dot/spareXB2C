import {
  ChevronRight,
  ClipboardList,
  FileCheck,
  FileText,
  type LucideIcon,
  ReceiptText,
} from "lucide-react";
import Link from "next/link";

import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { ServiceJob } from "@/features/service/types";

type JobDocument = { href: string; icon: LucideIcon; title: string; text: string };

/** Links to what the garage has written up so far: job card, estimates, report and bill. */
export function ServiceJobDocuments({ job }: { job: ServiceJob }) {
  const base = `/account/services/${job.id}`;
  const documents: JobDocument[] = [];
  if (job.checkIn) {
    documents.push({
      href: `${base}/job-card`,
      icon: ClipboardList,
      title: "Job card",
      text: "Check-in notes and inspection photos",
    });
  }
  if (job.estimates.length > 0) {
    documents.push({
      href: `${base}/estimate`,
      icon: FileCheck,
      title: job.estimates.length > 1 ? "Estimates" : "Estimate",
      text: "Each item of work and what you approved",
    });
  }
  if (job.completion) {
    documents.push({
      href: `${base}/report`,
      icon: FileText,
      title: "Completion report",
      text: "Work done, parts used and the next service",
    });
  }
  if (job.bill) {
    documents.push({
      href: `${base}/bill`,
      icon: ReceiptText,
      title: "Bill",
      text: `In the garage's own name, with its GST number`,
    });
  }

  return (
    <Card aria-labelledby="job-documents-heading">
      <SectionHeader id="job-documents-heading" title="From the garage" />
      {documents.length > 0 ? (
        <ul className="divide-y divide-gray-200">
          {documents.map(({ href, icon: Icon, title, text }) => (
            <li key={href}>
              <Link
                href={href}
                className="flex items-center gap-3 py-3 outline-none hover:text-navy-700 focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <Icon className="size-5 shrink-0 text-navy-700" aria-hidden />
                <span className="flex-1 text-sm">
                  <span className="block font-semibold text-gray-900">{title}</span>
                  <span className="text-gray-600">{text}</span>
                </span>
                <ChevronRight className="size-4 text-gray-400" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-600">
          The job card, estimate and bill show here once the garage writes them up.
        </p>
      )}
    </Card>
  );
}
