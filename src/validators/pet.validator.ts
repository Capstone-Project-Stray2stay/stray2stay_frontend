import { z } from "zod";

export const rehomeLocationSchema = z.object({
    state: z.string().trim().min(1),
    district: z.string().trim().min(1),
    subDistrict: z.string().trim().min(1),
    street: z.string(),
    lat: z.number().nullable(),
    long: z.number().nullable(),
});

export const petDetailsSchema = z.object({
    petType: z.enum(["dog", "cat"]).nullable(),
    name: z.string(),
    breed: z.string().trim().min(1),
    color: z.string().trim().min(1),
    ageGroup: z.string().trim().min(1),
    gender: z.string().trim().min(1),
    personality: z.array(z.string()).min(1),
    vaccinations: z.array(z.string()),
    sterilized: z.boolean().nullable().refine((v): v is boolean => v !== null),
    specialCare: z.array(z.string()),
    note: z.string(),
    location: rehomeLocationSchema,
});

const PET_DETAILS_LABELS: Record<string, string> = {
    breed: "Breed",
    color: "Color",
    ageGroup: "Age Group",
    gender: "Gender",
    personality: "at least one Personality",
    sterilized: "Sterilized",
};

/** Turns a failed petDetailsSchema parse into "Breed, Color, ..." labels for the form's error text. */
export function petDetailsMissingLabels(error: z.ZodError): string[] {
    const labels = new Set<string>();
    for (const issue of error.issues) {
        const key = issue.path[0];
        if (key === "location") {
            labels.add("Location");
            continue;
        }
        const label = PET_DETAILS_LABELS[key as string];
        if (label) labels.add(label);
    }
    return [...labels];
}
