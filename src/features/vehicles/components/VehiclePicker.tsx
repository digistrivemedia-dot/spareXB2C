import { useId, useState } from "react";

import { Button } from "@/components/ui/button";
import { SelectField } from "@/components/ui/SelectField";
import type { VehicleCatalog, VehicleRef, VehicleType } from "@/features/vehicles/types";

type VehiclePickerProps = {
  catalog: VehicleCatalog;
  submitLabel: string;
  onSubmit: (vehicle: VehicleRef) => void;
};

type Choice = {
  type?: VehicleType;
  brandId?: string;
  modelId?: string;
  variantId?: string;
  year?: number;
};

const vehicleTypes: { value: VehicleType; label: string }[] = [
  { value: "bike", label: "Bike" },
  { value: "scooter", label: "Scooter" },
];

/** Type → Brand → Model → Variant → Year. Changing a step clears the steps after it. */
export function VehiclePicker({ catalog, submitLabel, onSubmit }: VehiclePickerProps) {
  const [choice, setChoice] = useState<Choice>({});
  const id = useId();

  const models = catalog.models.filter((m) => m.type === choice.type);
  const brands = catalog.brands.filter((b) => models.some((m) => m.brandId === b.id));
  const brandModels = models.filter((m) => m.brandId === choice.brandId);
  const model = brandModels.find((m) => m.id === choice.modelId);
  const variant = model?.variants.find((v) => v.id === choice.variantId);
  const brand = brands.find((b) => b.id === choice.brandId);

  function chooseModel(modelId: string) {
    const next = brandModels.find((m) => m.id === modelId);
    // Most models have a single variant; pick it so the customer has one step less.
    setChoice({
      ...choice,
      modelId,
      variantId: next?.variants.length === 1 ? next.variants[0].id : undefined,
      year: undefined,
    });
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!brand || !model || !variant || !choice.year) return;
    onSubmit({
      modelId: model.id,
      variantId: variant.id,
      year: choice.year,
      brandName: brand.name,
      modelName: model.name,
      variantName: variant.name,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3 sm:gap-4">
      <SelectField
        id={`${id}-type`}
        label="Type"
        placeholder="Bike or scooter"
        value={choice.type}
        options={vehicleTypes}
        onChange={(type) => setChoice({ type: type as VehicleType })}
      />
      <SelectField
        id={`${id}-brand`}
        label="Brand"
        placeholder="Select brand"
        value={choice.brandId}
        options={brands.map((b) => ({ value: b.id, label: b.name }))}
        onChange={(brandId) => setChoice({ type: choice.type, brandId })}
      />
      <SelectField
        id={`${id}-model`}
        label="Model"
        placeholder="Select model"
        value={choice.modelId}
        options={brandModels.map((m) => ({ value: m.id, label: m.name }))}
        onChange={chooseModel}
      />
      <SelectField
        id={`${id}-variant`}
        label="Variant"
        placeholder="Select variant"
        value={choice.variantId}
        options={model?.variants.map((v) => ({ value: v.id, label: v.name })) ?? []}
        onChange={(variantId) => setChoice({ ...choice, variantId, year: undefined })}
      />
      <SelectField
        id={`${id}-year`}
        label="Year"
        placeholder="Select year"
        value={choice.year?.toString()}
        options={
          variant
            ? (model?.years.map((y) => ({
                value: y.toString(),
                label: y.toString(),
              })) ?? [])
            : []
        }
        onChange={(year) => setChoice({ ...choice, year: Number(year) })}
      />
      <Button type="submit" className="self-end" disabled={!choice.year}>
        {submitLabel}
      </Button>
    </form>
  );
}
