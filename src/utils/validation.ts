import type { PetDetailsDraft } from "../types/rehome.type";

/**
 * Which required fields are still blank, in the order they appear on the form.
 *
 * The backend answers a rejected payload with a generic "Incorrect request
 * format", so checking here is the only way the user learns what's wrong.
 * Shared by the wizard's final step and the Edit Pet's Profile page so the two
 * can't drift into disagreeing about what a complete listing is.
 */
export function missingFields(draft: PetDetailsDraft): string[] {
    const missing: string[] = [];

    // Name is deliberately not required — plenty of strays being rehomed have
    // never been named. registerPetAPI substitutes a fallback.
    if (draft.breed === "") missing.push("Breed");
    if (draft.color === "") missing.push("Color");
    if (draft.ageGroup === "") missing.push("Age Group");
    if (draft.gender === "") missing.push("Gender");
    if (draft.personality.length === 0) missing.push("at least one Personality");

    // Down to sub-district, because that is the level the coordinates come from
    // — and those drive the Adopt page's distance sorting. Street is free text
    // and optional.
    if (
        draft.location.state === "" ||
        draft.location.district === "" ||
        draft.location.subDistrict === ""
    ) {
        missing.push("Location");
    }

    if (draft.vaccinations.length === 0) missing.push("at least one Vaccination");
    if (draft.sterilized === null) missing.push("Sterilized");

    return missing;
}
