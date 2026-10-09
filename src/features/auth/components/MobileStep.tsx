import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { requestOtpAction } from "@/features/auth/actions";
import { type MobileValues, mobileSchema } from "@/features/auth/schema";
import type { OtpRequest } from "@/features/auth/types";

type MobileStepProps = {
  defaultMobile: string;
  onSent: (mobile: string, request: OtpRequest) => void;
};

/** Step 1: the customer's mobile number. */
export function MobileStep({ defaultMobile, onSent }: MobileStepProps) {
  const form = useForm<MobileValues>({
    resolver: zodResolver(mobileSchema),
    defaultValues: { mobile: defaultMobile },
  });
  const error = form.formState.errors.mobile;

  async function onSubmit(values: MobileValues) {
    const result = await requestOtpAction(values);
    if (!result.ok) {
      form.setError("mobile", { message: result.message });
      return;
    }
    onSent(values.mobile, result);
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="grid gap-5">
      <Field data-invalid={Boolean(error)}>
        <FieldLabel htmlFor="login-mobile">Mobile number</FieldLabel>
        <div className="flex">
          <span className="flex items-center rounded-l-lg border border-r-0 border-input bg-gray-100 px-3 text-base font-medium text-gray-700 md:text-sm">
            +91
          </span>
          <Input
            id="login-mobile"
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            maxLength={10}
            autoFocus
            placeholder="98450 12345"
            aria-invalid={Boolean(error)}
            className="rounded-l-none"
            {...form.register("mobile")}
          />
        </div>
        <FieldError errors={[error]} />
      </Field>
      <Button type="submit" size="lg" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? "Sending code…" : "Get OTP"}
      </Button>
    </form>
  );
}
