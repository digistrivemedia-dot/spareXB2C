import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { OtpInput } from "@/components/ui/OtpInput";
import { TextField } from "@/components/ui/TextField";
import { requestOtpAction, verifyOtpAction } from "@/features/auth/actions";
import { otpSchema, type OtpValues } from "@/features/auth/schema";
import type { OtpRequest } from "@/features/auth/types";
import { formatMobile } from "@/lib/format";

type OtpStepProps = {
  mobile: string;
  request: OtpRequest;
  /** Where to go after logging in. */
  next: string | null;
  onChangeNumber: () => void;
};

/** Step 2: the code from the SMS, and a name when the number is new (sign-up is the same flow). */
export function OtpStep({ mobile, request, next, onChangeNumber }: OtpStepProps) {
  const [secondsLeft, setSecondsLeft] = useState(request.resendAfterSeconds);
  const form = useForm<OtpValues>({
    resolver: zodResolver(otpSchema(request.isNewUser)),
    defaultValues: { otp: "", name: "" },
  });

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft((seconds) => seconds - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  // On success the action redirects, so only a failure comes back here.
  async function verify(values: OtpValues) {
    const result = await verifyOtpAction(mobile, request.isNewUser, values, next);
    form.setError("otp", { message: result.message });
  }

  async function resend() {
    const result = await requestOtpAction({ mobile });
    if (!result.ok) {
      toast.error(result.message);
      return;
    }
    setSecondsLeft(result.resendAfterSeconds);
    toast.success(`New code sent to ${formatMobile(mobile)}`);
  }

  return (
    <form onSubmit={form.handleSubmit(verify)} noValidate className="grid gap-5">
      <p className="text-sm text-gray-700">
        Enter the 6-digit code sent to{" "}
        <span className="font-semibold text-gray-900">{formatMobile(mobile)}</span>.{" "}
        <Button type="button" variant="link" size="sm" onClick={onChangeNumber}>
          Change number
        </Button>
      </p>

      <Controller
        name="otp"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>One-time code</FieldLabel>
            <OtpInput
              value={field.value}
              onChange={(otp) => {
                field.onChange(otp);
                // Returning customers are signed in as soon as the last digit is typed.
                if (otp.length === 6 && !request.isNewUser) void form.handleSubmit(verify)();
              }}
              invalid={fieldState.invalid}
              autoFocus
            />
            <FieldError errors={[fieldState.error]} />
          </Field>
        )}
      />

      {request.isNewUser && (
        <TextField
          label="Your name"
          autoComplete="name"
          hint="New here? We'll create your account with this number."
          error={form.formState.errors.name?.message}
          {...form.register("name")}
        />
      )}

      <Button type="submit" size="lg" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting
          ? "Checking…"
          : request.isNewUser
            ? "Create account"
            : "Verify and continue"}
      </Button>

      <p className="text-center text-sm text-gray-600" aria-live="polite">
        {secondsLeft > 0 ? (
          <>Resend code in 0:{String(secondsLeft).padStart(2, "0")}</>
        ) : (
          <Button type="button" variant="link" size="sm" onClick={resend}>
            Resend code
          </Button>
        )}
      </p>
    </form>
  );
}
