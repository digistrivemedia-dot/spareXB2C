import { z } from "zod";

import type { PaymentMethod } from "@/features/orders/types";

export const paymentMethods = [
  "upi",
  "card",
  "netbanking",
  "wallet",
  "cod",
] as const satisfies readonly PaymentMethod[];

// State code (2 digits), PAN (5 letters, 4 digits, 1 letter), entity number, "Z", check character.
const GSTIN_PATTERN = /^\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;

export const newAddressSchema = z.object({
  name: z.string().trim().min(2, "Enter the name of the person receiving the order."),
  mobile: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Enter a 10-digit mobile number, without +91."),
  pin: z
    .string()
    .trim()
    .regex(/^[1-9]\d{5}$/, "Enter a valid 6-digit PIN code."),
  line1: z.string().trim().min(5, "Enter the house number, building and street."),
  area: z.string().trim().min(2, "Enter the area or locality."),
  city: z.string().trim().min(2, "Enter the city."),
  state: z.string().trim().min(2, "Enter the state."),
});

export type NewAddressValues = z.infer<typeof newAddressSchema>;

/** The whole checkout form. A new address is only checked when the customer chooses to add one. */
export const checkoutSchema = z
  .object({
    /** A saved address id, or "new". */
    addressId: z.string().min(1, "Choose where we should deliver."),
    newAddress: z.object({
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
    /** A saved bike id, or "" when the order isn't for a particular bike. */
    bikeId: z.string(),
    paymentMethod: z.enum(paymentMethods, { message: "Choose how you'd like to pay." }),
  })
  .superRefine(
    (values, ctx) => {
      if (values.addressId === "new") {
        const result = newAddressSchema.safeParse(values.newAddress);
        result.error?.issues.forEach((issue) =>
          ctx.addIssue({
            code: "custom",
            message: issue.message,
            path: ["newAddress", ...issue.path],
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
          message: "Enter a valid 15-character GSTIN, like 29ABCDE1234F1Z5.",
          path: ["gstin"],
        });
      }
      // Run even when another field (like the payment method) is missing, so every error shows at once.
    },
    { when: () => true },
  );

export type CheckoutValues = z.input<typeof checkoutSchema>;
