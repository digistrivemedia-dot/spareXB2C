import { OptionTile } from "@/components/ui/OptionTile";
import type { ServiceType } from "@/features/service/types";
import { formatPrice } from "@/lib/format";

type ServiceTypeOptionsProps = {
  types: ServiceType[];
  selectedId: string;
  onSelect: (id: string) => void;
};

/** Service cards with their "from" price, time and what's included. */
export function ServiceTypeOptions({ types, selectedId, onSelect }: ServiceTypeOptionsProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {types.map((type) => (
        <OptionTile
          key={type.id}
          isSelected={type.id === selectedId}
          onClick={() => onSelect(type.id)}
        >
          <span className="font-semibold text-gray-900">{type.name}</span>
          <span className="font-semibold text-orange-800">
            from {formatPrice(type.fromPriceInPaise)}
          </span>
          <span className="text-gray-600">{type.description}</span>
          <span className="text-xs text-gray-500">
            {type.duration} · {type.includes.join(", ")}
          </span>
        </OptionTile>
      ))}
    </div>
  );
}
