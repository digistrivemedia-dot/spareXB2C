import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SelectFieldProps = {
  id: string;
  label: string;
  placeholder: string;
  value: string | undefined;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
};

/** A labelled select. An undefined value shows the placeholder; no options disables it. */
export function SelectField({
  id,
  label,
  placeholder,
  value,
  options,
  onChange,
}: SelectFieldProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Select value={value ?? ""} onValueChange={onChange} disabled={options.length === 0}>
        <SelectTrigger id={id} className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
