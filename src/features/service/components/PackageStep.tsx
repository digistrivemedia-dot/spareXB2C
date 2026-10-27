import { CircleCheck, MessageSquareText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { OptionTile } from "@/components/ui/OptionTile";
import { Textarea } from "@/components/ui/textarea";
import type { ServicePackage } from "@/features/service/types";
import { formatPrice } from "@/lib/format";

/** How many inclusions a tile lists before "+ n more". */
const INCLUDES_SHOWN = 4;

type PackageStepProps = {
  /** "KTM Duke 200", for the headings. */
  vehicleName: string;
  packages: ServicePackage[];
  /** A package id, null for "describe the problem", undefined while nothing is chosen. */
  selected: string | null | undefined;
  onSelect: (packageId: string | null) => void;
  /** What's wrong with the vehicle; needed without a package. */
  problem: string;
  onProblemChange: (problem: string) => void;
  /** Moves on once the problem is written. */
  onContinue: () => void;
};

/**
 * The packages the admin has set for this vehicle model, at one price at every garage; or "describe the
 * problem" for anything else, which the garage quotes after inspecting.
 */
export function PackageStep({
  vehicleName,
  packages,
  selected,
  onSelect,
  problem,
  onProblemChange,
  onContinue,
}: PackageStepProps) {
  return (
    <div className="grid gap-4">
      {packages.length > 0 ? (
        <p className="text-sm text-gray-600">
          Packages for your <span className="font-semibold text-gray-900">{vehicleName}</span>. Same
          price at every garage.
        </p>
      ) : (
        <p className="rounded-xl bg-gray-50 p-4 text-sm text-gray-700">
          Packages for your <span className="font-semibold text-gray-900">{vehicleName}</span> are
          coming soon. Tell us what you need and the garage will quote after a check.
        </p>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {packages.map((servicePackage) => {
          const hidden = servicePackage.includes.length - INCLUDES_SHOWN;
          return (
            <OptionTile
              key={servicePackage.id}
              isSelected={servicePackage.id === selected}
              onClick={() => onSelect(servicePackage.id)}
              className="justify-start gap-2"
            >
              <span className="flex w-full items-start justify-between gap-3">
                <span className="font-semibold text-gray-900">{servicePackage.name}</span>
                <span className="text-base font-bold text-gray-900 tabular-nums">
                  {formatPrice(servicePackage.priceInPaise)}
                </span>
              </span>
              <span className="text-gray-600">{servicePackage.description}</span>
              <ul className="grid gap-1 text-xs text-gray-600">
                {servicePackage.includes.slice(0, INCLUDES_SHOWN).map((item) => (
                  <li key={item} className="flex items-center gap-1.5">
                    <CircleCheck className="size-3.5 shrink-0 text-success-600" aria-hidden />
                    {item}
                  </li>
                ))}
                {hidden > 0 && <li className="pl-5">+ {hidden} more</li>}
              </ul>
              <span className="text-xs text-gray-500">Takes {servicePackage.duration}</span>
            </OptionTile>
          );
        })}

        <OptionTile
          isSelected={selected === null}
          onClick={() => onSelect(null)}
          className="justify-start gap-2"
        >
          <span className="flex items-center gap-2 font-semibold text-gray-900">
            <MessageSquareText className="size-4 text-navy-700" aria-hidden />
            Something else? Tell us the problem
          </span>
          <span className="text-gray-600">
            A noise, a warning light, an accident repair. The garage checks it and sends you an
            estimate to approve.
          </span>
        </OptionTile>
      </div>

      {selected === null && (
        <div className="grid gap-3">
          <div className="grid gap-2">
            <Label htmlFor="booking-problem">What&apos;s wrong with the vehicle?</Label>
            <Textarea
              id="booking-problem"
              value={problem}
              maxLength={300}
              placeholder="E.g. a noise from the front brake when braking hard"
              onChange={(event) => onProblemChange(event.target.value)}
            />
          </div>
          <Button className="justify-self-end" disabled={!problem.trim()} onClick={onContinue}>
            Continue
          </Button>
        </div>
      )}
    </div>
  );
}
