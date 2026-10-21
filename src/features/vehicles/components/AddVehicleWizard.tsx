"use client";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/Card";
import { OptionTile } from "@/components/ui/OptionTile";
import { StepProgress } from "@/components/ui/StepProgress";
import { addVehicleAction } from "@/features/vehicles/actions";
import { AddVehicleSuccess } from "@/features/vehicles/components/AddVehicleSuccess";
import { VehicleDetailsStep } from "@/features/vehicles/components/VehicleDetailsStep";
import type { VehicleDetailsValues } from "@/features/vehicles/schema";
import { useVehicleStore } from "@/features/vehicles/store";
import type { MyVehicle, VehicleCatalog, VehicleType } from "@/features/vehicles/types";
import { getVehicleName, toSelectedVehicle, vehicleTypes } from "@/features/vehicles/utils";

type Choice = {
  type?: VehicleType;
  brandId?: string;
  modelId?: string;
  variantId?: string;
  year?: number;
};

const titles = ["Type", "Brand", "Model", "Variant", "Year", "Registration"];

/** Type → Brand → Model → Variant → Year → registration and odometer → added. */
export function AddVehicleWizard({ catalog }: { catalog: VehicleCatalog }) {
  const selectVehicle = useVehicleStore((state) => state.selectVehicle);
  const [step, setStep] = useState(0);
  const [choice, setChoice] = useState<Choice>({});
  const [added, setAdded] = useState<MyVehicle | null>(null);

  const brands = catalog.brands.filter((b) =>
    catalog.models.some((m) => m.brandId === b.id && m.type === choice.type),
  );
  const models = catalog.models.filter(
    (m) => m.brandId === choice.brandId && m.type === choice.type,
  );
  const model = models.find((m) => m.id === choice.modelId);
  const brand = brands.find((b) => b.id === choice.brandId);
  const variant = model?.variants.find((v) => v.id === choice.variantId);

  function pick(changes: Choice, nextStep: number) {
    setChoice({ ...choice, ...changes });
    setStep(nextStep);
  }

  function chooseModel(modelId: string) {
    const next = models.find((m) => m.id === modelId);
    // Most models have one variant: pick it and skip the step.
    if (next?.variants.length === 1) pick({ modelId, variantId: next.variants[0].id }, 4);
    else pick({ modelId, variantId: undefined }, 3);
  }

  async function addVehicle(details: VehicleDetailsValues): Promise<string | null> {
    if (!brand || !model || !variant || !choice.year) return "Please choose your vehicle again.";
    const result = await addVehicleAction(
      {
        type: model.type,
        modelId: model.id,
        variantId: variant.id,
        year: choice.year,
        brandName: brand.name,
        modelName: model.name,
        variantName: variant.name,
      },
      details,
    );
    if (!result.ok) return result.message;
    selectVehicle(toSelectedVehicle(result.vehicle));
    setAdded(result.vehicle);
    return null;
  }

  if (added) return <AddVehicleSuccess vehicle={added} />;

  type Option = { key: string; label: string; onPick: () => void; isSelected: boolean };
  function optionsForStep(): Option[] {
    switch (step) {
      case 0:
        return vehicleTypes.map(({ value: type, label }) => ({
          key: type,
          label,
          onPick: () => pick({ type, brandId: undefined }, 1),
          isSelected: choice.type === type,
        }));
      case 1:
        return brands.map((b) => ({
          key: b.id,
          label: b.name,
          onPick: () => pick({ brandId: b.id, modelId: undefined }, 2),
          isSelected: b.id === choice.brandId,
        }));
      case 2:
        return models.map((m) => ({
          key: m.id,
          label: m.name,
          onPick: () => chooseModel(m.id),
          isSelected: m.id === choice.modelId,
        }));
      case 3:
        return (model?.variants ?? []).map((v) => ({
          key: v.id,
          label: v.name,
          onPick: () => pick({ variantId: v.id }, 4),
          isSelected: v.id === choice.variantId,
        }));
      case 4:
        return (model?.years ?? []).map((y) => ({
          key: String(y),
          label: String(y),
          onPick: () => pick({ year: y }, 5),
          isSelected: y === choice.year,
        }));
      default:
        return [];
    }
  }

  // Whatever the customer has picked so far, so the enquiry starts with it.
  const notListedHref = `/account/enquiries/new?${new URLSearchParams({
    reason: "vehicle-not-listed",
    describe: [brand?.name, model?.name].filter(Boolean).join(" "),
  })}`;

  const back = () => setStep(step === 4 && model?.variants.length === 1 ? 2 : step - 1);

  return (
    <Card aria-label="Add a vehicle" className="grid gap-6">
      <StepProgress current={step + 1} total={titles.length} title={titles[step]} />
      {brand && model && (
        <p className="text-sm text-gray-700">
          {getVehicleName({ brandName: brand.name, modelName: model.name })}
          {variant && ` · ${variant.name}`}
          {choice.year && step === 5 && ` · ${choice.year}`}
        </p>
      )}
      {step < 5 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {optionsForStep().map((option) => (
            <OptionTile key={option.key} isSelected={option.isSelected} onClick={option.onPick}>
              <span className="font-semibold text-gray-900">{option.label}</span>
            </OptionTile>
          ))}
        </div>
      ) : (
        <VehicleDetailsStep onSubmit={addVehicle} />
      )}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {step > 0 && (
          <Button variant="ghost" onClick={back}>
            <ChevronLeft aria-hidden />
            Back
          </Button>
        )}
        {step >= 1 && step <= 3 && (
          <Link
            href={notListedHref}
            className="ml-auto text-sm font-semibold text-navy-700 hover:underline"
          >
            My vehicle isn&apos;t listed
          </Link>
        )}
      </div>
    </Card>
  );
}
