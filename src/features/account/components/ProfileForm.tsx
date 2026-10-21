"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/Card";
import { TextField } from "@/components/ui/TextField";
import { updateProfileAction } from "@/features/account/actions";
import { profileSchema, type ProfileValues } from "@/features/account/schema";
import type { User } from "@/features/auth/types";
import { formatMobile } from "@/lib/format";

/** Name, optional email and GSTIN. The mobile number is the login, so it is shown but not editable. */
export function ProfileForm({ user }: { user: User }) {
  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user.name, email: user.email ?? "", gstin: user.gstin ?? "" },
  });
  const { errors, isDirty, isSubmitting } = form.formState;

  async function onSubmit(values: ProfileValues) {
    const result = await updateProfileAction(values);
    if (!result.ok) {
      toast.error(result.message);
      return;
    }
    form.reset({ ...values, gstin: values.gstin.trim().toUpperCase() });
    toast.success("Profile saved");
  }

  return (
    <Card aria-label="Profile details" className="max-w-2xl">
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="grid gap-5">
        <TextField
          label="Full name"
          autoComplete="name"
          error={errors.name?.message}
          {...form.register("name")}
        />

        <div className="grid gap-1 rounded-lg bg-gray-50 p-3 text-sm">
          <span className="font-medium text-gray-900">Mobile number</span>
          <span className="text-gray-900 tabular-nums">{formatMobile(user.mobile)}</span>
          <span className="text-gray-600">
            You log in with this number, so it can&apos;t be changed here. Call us to move your
            account to a new number.
          </span>
        </div>

        <TextField
          label="Email (optional)"
          type="email"
          autoComplete="email"
          hint="For order emails and invoices"
          error={errors.email?.message}
          {...form.register("email")}
        />
        <TextField
          label="GSTIN (optional)"
          autoCapitalize="characters"
          maxLength={15}
          hint="For GST invoices on business purchases. We'll fill it in at checkout."
          error={errors.gstin?.message}
          {...form.register("gstin")}
        />

        <Button type="submit" disabled={!isDirty || isSubmitting} className="w-full sm:w-fit">
          {isSubmitting ? "Saving…" : "Save changes"}
        </Button>
      </form>
    </Card>
  );
}
