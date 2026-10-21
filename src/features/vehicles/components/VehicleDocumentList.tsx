import { FileText } from "lucide-react";
import Link from "next/link";

import { Card } from "@/components/ui/Card";
import { ImageViewer } from "@/components/ui/ImageViewer";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { MyVehicle } from "@/features/vehicles/types";
import {
  documentLabels,
  documentStatusLabels,
  documentStatusTones,
} from "@/features/vehicles/utils";
import { formatDate } from "@/lib/format";

/** Insurance, PUC and RC: number, company, expiry and photo, with their status. */
export function VehicleDocumentList({ vehicle }: { vehicle: MyVehicle }) {
  return (
    <Card aria-labelledby="documents-heading">
      <SectionHeader
        id="documents-heading"
        title="Documents"
        link={{ href: `/account/vehicles/${vehicle.id}/edit`, label: "Edit" }}
      />
      <ul className="divide-y divide-gray-200">
        {vehicle.documents.map((document) => {
          const details = [
            document.provider,
            document.number && `No. ${document.number}`,
            document.expiresOn && `Valid till ${formatDate(document.expiresOn)}`,
          ].filter(Boolean);
          return (
            <li key={document.kind} className="grid gap-3 py-4 first:pt-0 last:pb-0">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <FileText className="size-5 text-navy-700" aria-hidden />
                <h3 className="font-semibold text-gray-900">{documentLabels[document.kind]}</h3>
                <StatusBadge tone={documentStatusTones[document.status]}>
                  {documentStatusLabels[document.status]}
                </StatusBadge>
              </div>
              {details.length > 0 ? (
                <p className="text-sm text-gray-700">{details.join(" · ")}</p>
              ) : (
                <p className="text-sm text-gray-600">
                  Not added yet.{" "}
                  <Link
                    href={`/account/vehicles/${vehicle.id}/edit`}
                    className="font-semibold text-navy-700 hover:underline"
                  >
                    Add the details
                  </Link>{" "}
                  so we can remind you before it expires.
                </p>
              )}
              {document.photo && (
                <div className="max-w-40">
                  <ImageViewer
                    photos={[document.photo]}
                    label={`${documentLabels[document.kind]} photo`}
                  />
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
