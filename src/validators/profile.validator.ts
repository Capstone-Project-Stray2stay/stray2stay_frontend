import { z } from "zod";

export const personalInfoSchema = z.object({
    firstName: z.string().trim().min(1, "First name is required"),
    lastName: z.string().trim().min(1, "Last name is required"),
    phone: z
        .string()
        .trim()
        .min(1, "Phone number is required")
        .regex(/^[0-9+\-() ]{9,20}$/, "Enter a valid phone number"),
    state: z.string().trim().min(1, "State is required"),
    district: z.string().trim().min(1, "District is required"),
    subDistrict: z.string().trim().min(1, "Sub-district is required"),
    street: z.string().trim().min(1, "Street is required"),
    lat: z.number().nullable(),
    long: z.number().nullable(),
});
