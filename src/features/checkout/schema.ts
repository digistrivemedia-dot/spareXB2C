import { z } from "zod";

import { addressFieldsSchema, GSTIN_MESSAGE, GSTIN_PATTERN } from "@/features/account/schema";
import type { PaymentMode } from "@/features/orders/types";

const paymentModes = ["online", "cod"] as const satisfies readonly PaymentMode[];

/** The whole checkout form. A new address is only checked when the customer chooses to add one. */
export const checkoutSchema = z
  .object({
    /** A saved address id, or "new". */
    addressId: z.string().min(1, "Choose where we should deliver."),
    address: z.object({
      name: z.string(),
      mobile: z.string(),
      pin: z.string(),
      line1: z.string(),
      area: z.string(),
      city: z.string(),
      state: z.string(),
    }),
    billingSameAsDelivery: z.boolean(),
    billingAddressId: z.string(),
    wantsGstInvoice: z.boolean(),
    gstin: z.string().trim().toUpperCase(),
    /** A saved vehicle id, or "" when the order isn't for a particular vehicle. */
    vehicleId: z.string(),
    paymentMode: z.enum(paymentModes, { message: "Choose how you'd like to pay." }),
  })
  .superRefine(
    (values, ctx) => {
      if (values.addressId === "new") {
        const result = addressFieldsSchema.safeParse(values.address);
        result.error?.issues.forEach((issue) =>
          ctx.addIssue({
            code: "custom",
            message: issue.message,
            path: ["address", ...issue.path],
          }),
        );
      }
      if (!values.billingSameAsDelivery && !values.billingAddressId) {
        ctx.addIssue({
          code: "custom",
          message: "Choose a billing address.",
          path: ["billingAddressId"],
        });
      }
      if (values.wantsGstInvoice && !GSTIN_PATTERN.test(values.gstin)) {
        ctx.addIssue({
          code: "custom",
          message: GSTIN_MESSAGE,
          path: ["gstin"],
        });
      }
      // Run even when another field (like the payment method) is missing, so every error shows at once.
    },
    { when: () => true },
  );

export type CheckoutValues = z.input<typeof checkoutSchema>;
