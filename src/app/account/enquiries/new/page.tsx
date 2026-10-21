import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/PageHeader";
import { EnquiryForm } from "@/features/enquiries/components/EnquiryForm";
import { getMyVehicles } from "@/features/vehicles/api";
import { getSearchParam } from "@/lib/search-params";

export const metadata: Metadata = { title: "Send an enquiry" };

/**
 * Links can fill the form in: `reason` (vehicle-not-listed or part-not-found), `vehicle` (a saved
 * vehicle id), `describe` (a vehicle that isn't listed) and `part`.
 */
export default async function NewEnquiryPage({
  searchParams,
}: PageProps<"/account/enquiries/new">) {
  const [params, vehicles] = await Promise.all([searchParams, getMyVehicles()]);
  const savedVehicle = vehicles.find((v) => v.id === getSearchParam(params, "vehicle"));

  return (
    <div className="grid grid-cols-1 gap-6">
      <PageHeader
        title="Send an enquiry"
        description="Tell us what you're looking for. Our parts team will reply on My enquiries."
      />
      <EnquiryForm
        vehicles={vehicles}
        defaultValues={{
          reason:
            getSearchParam(params, "reason") === "part-not-found"
              ? "part-not-found"
              : "vehicle-not-listed",
          vehicleChoice: savedVehicle?.id ?? vehicles[0]?.id ?? "other",
          vehicleDescription: getSearchParam(params, "describe") ?? "",
          partNeeded: getSearchParam(params, "part") ?? "",
          message: "",
        }}
      />
    </div>
  );
}
