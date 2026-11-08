import { describe, expect, it } from "vitest";
import { petDetailsMissingLabels, petDetailsSchema } from "../src/validators/pet.validator";

const validPet = {
    petType: "dog" as const,
    name: "Milo",
    breed: "Mixed breed",
    color: "Brown",
    ageGroup: "Adult",
    gender: "Male",
    personality: ["Friendly"],
    vaccinations: ["Rabies"],
    sterilized: false,
    specialCare: [],
    note: "",
    location: {
        state: "Bangkok",
        district: "Pathum Wan",
        subDistrict: "Lumphini",
        street: "",
        lat: null,
        long: null,
    },
};

describe("petDetailsSchema", () => {
    // UT-FE-PET-01
    it("accepts a complete dog or cat listing, including a false sterilized value", () => {
        expect(petDetailsSchema.safeParse(validPet).success).toBe(true);
        expect(petDetailsSchema.safeParse({ ...validPet, petType: "cat" }).success).toBe(true);
    });

    // UT-FE-PET-01
    it("rejects unsupported species and non-blank detail/location fields", () => {
        const unsupportedSpecies = { ...validPet, petType: "rabbit" } as unknown as typeof validPet;
        expect(petDetailsSchema.safeParse(unsupportedSpecies).success).toBe(false);
        expect(petDetailsSchema.safeParse({ ...validPet, breed: "  " }).success).toBe(false);
        expect(petDetailsSchema.safeParse({
            ...validPet,
            location: { ...validPet.location, district: "  " },
        }).success).toBe(false);
    });

    // UT-FE-PET-02
    it("reports missing labels once in schema order for the registration form", () => {
        const result = petDetailsSchema.safeParse({
            ...validPet,
            breed: "",
            color: "",
            ageGroup: "",
            gender: "",
            personality: [],
            sterilized: null,
            location: { ...validPet.location, state: "", district: "", subDistrict: "" },
        });
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(petDetailsMissingLabels(result.error)).toEqual([
                "Breed", "Color", "Age Group", "Gender", "at least one Personality", "Sterilized", "Location",
            ]);
        }
    });
});
