import { Label } from "@/components/ui/label";

type FilterOptionProps = {
  id: string;
  /** The checkbox or radio, rendered with this `id`. */
  control: React.ReactNode;
  label: string;
  count?: number;
};

/** A checkbox or radio row with its label and result count; the whole row is a tap target. */
export function FilterOption({ id, control, label, count }: FilterOptionProps) {
  return (
    <div className="flex min-h-11 items-center gap-3 md:min-h-9">
      {control}
      <Label
        htmlFor={id}
        className="flex flex-1 cursor-pointer justify-between gap-2 py-1 leading-snug font-normal text-gray-700"
      >
        {label}
        {count !== undefined && <span className="text-gray-500 tabular-nums">{count}</span>}
      </Label>
    </div>
  );
}
