import { z } from "zod";

// State code (2 digits), PAN (5 letters, 4 digits, 1 letter), entity number, "Z", check character.
export const GSTIN_PATTERN = /^\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;
export const GSTIN_MESSAGE = "Enter a valid 15-character GSTIN, like 29ABCDE1234F1Z5.";

/** The fields of a postal address, shared by checkout's "new address" and the address book. */
export const addressFieldsSchema = z.object({
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

export type AddressFieldsValues = z.infer<typeof addressFieldsSchema>;

export const emptyAddressFields: AddressFieldsValues = {
  name: "",
  mobile: "",
  pin: "",
  line1: "",
  area: "",
  city: "",
  state: "",
};

export const addressLabels = ["Home", "Work", "Other"] as const;

export const addressFormSchema = z.object({
  label: z.enum(addressLabels, { message: "Choose Home, Work or Other." }),
  address: addressFieldsSchema,
  isDefault: z.boolean(),
});

export type AddressFormValues = z.infer<typeof addressFormSchema>;

export const profileSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name."),
  email: z.union([
    z.literal(""),
    z.email("Enter an email address like name@example.com, or leave it empty."),
  ]),
  gstin: z
    .string()
    .trim()
    .toUpperCase()
    .refine((value) => value === "" || GSTIN_PATTERN.test(value), GSTIN_MESSAGE),
});

export type ProfileValues = z.input<typeof profileSchema>;
