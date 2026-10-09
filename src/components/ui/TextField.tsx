import { useId } from "react";

import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type TextFieldProps = React.ComponentProps<typeof Input> & {
  label: string;
  /** The validation message, shown under the input. */
  error?: string;
  hint?: string;
};

/** A labelled text input with its hint and error, for react-hook-form's `register`. */
export function TextField({ label, error, hint, id: idProp, ...inputProps }: TextFieldProps) {
  const generatedId = useId();
  const id = idProp ?? generatedId;

  return (
    <Field data-invalid={Boolean(error)}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Input id={id} aria-invalid={Boolean(error)} {...inputProps} />
      {hint && <FieldDescription>{hint}</FieldDescription>}
      <FieldError errors={error ? [{ message: error }] : undefined} />
    </Field>
  );
}
